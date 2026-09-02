// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function createMatchMedia(): MediaQueryList {
  return {
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  };
}

function createLocalStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

function installLocalStorage() {
  const storage = createLocalStorage();

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  });

  return storage;
}

function restoreAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}

describe('App', () => {
  let App: typeof import('./App').default;
  let i18n: typeof import('./i18n').default;
  let container: HTMLDivElement;
  let root: Root | undefined;
  let storage: Storage;
  let documentElementState: {
    className: string | null;
    lang: string | null;
    palette: string | null;
    theme: string | null;
  };
  let analyticsModeState: { exists: boolean; value: Window['vam'] };

  beforeAll(async () => {
    storage = installLocalStorage();
    ({ default: i18n } = await import('./i18n'));
    ({ default: App } = await import('./App'));
  });

  beforeEach(async () => {
    storage.clear();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(createMatchMedia),
      writable: true,
    });
    documentElementState = {
      className: document.documentElement.getAttribute('class'),
      lang: document.documentElement.getAttribute('lang'),
      palette: document.documentElement.getAttribute('data-palette'),
      theme: document.documentElement.getAttribute('data-theme'),
    };
    const analyticsWindow = window;
    analyticsModeState = {
      exists: Object.prototype.hasOwnProperty.call(analyticsWindow, 'vam'),
      value: analyticsWindow.vam,
    };
    await i18n.changeLanguage('pt-BR');
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => root?.unmount());
    }
    container?.remove();
    document.head
      .querySelectorAll('script[data-sdkn^="@vercel/"]')
      .forEach((script) => script.remove());
    delete (window as Window & { si?: unknown }).si;
    delete (window as Window & { siq?: unknown }).siq;
    delete (window as Window & { va?: unknown }).va;
    delete (window as Window & { vaq?: unknown }).vaq;
    const analyticsWindow = window;
    if (analyticsModeState.exists) {
      analyticsWindow.vam = analyticsModeState.value;
    } else {
      delete analyticsWindow.vam;
    }
    restoreAttribute(document.documentElement, 'class', documentElementState.className);
    restoreAttribute(document.documentElement, 'lang', documentElementState.lang);
    restoreAttribute(document.documentElement, 'data-palette', documentElementState.palette);
    restoreAttribute(document.documentElement, 'data-theme', documentElementState.theme);
  });

  it('injects Vercel Analytics and Speed Insights', async () => {
    await act(async () => root?.render(<App />));

    expect(
      document.head.querySelector('script[data-sdkn="@vercel/analytics/react"]'),
    ).not.toBeNull();
    expect(
      document.head.querySelector('script[data-sdkn="@vercel/speed-insights/react"]'),
    ).not.toBeNull();
  });

  it('identifies brazilian-tools as the published npm package', async () => {
    await act(async () => root?.render(<App />));

    expect(container.textContent).toContain('REACT · PACOTE PUBLICADO');
    expect(container.textContent).toContain('npm:brazilian-tools@0.1.0');
  });

  it('renders a decorative icon in every interactive button and the selected theme control', async () => {
    await act(async () => root?.render(<App />));

    const buttons = [...container.querySelectorAll('button')];

    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect(button.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    });
    expect(container.querySelector('[aria-label="Tema"] svg.lucide-moon')).not.toBeNull();
  });
});
