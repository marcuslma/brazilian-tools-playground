import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { LanguageControls } from './components/LanguageControls';
import { BrlCard } from './components/cards/BrlCard';
import { CepCard } from './components/cards/CepCard';
import { CnhCard, PisCard } from './components/cards/WorkCards';
import { CnpjCard, CpfCard, RgCard } from './components/cards/DocumentCards';
import { PhoneCard } from './components/cards/PhoneCard';
import { PlateCard } from './components/cards/PlateCard';
import { StatesCard } from './components/cards/StatesCard';
import type { Palette, Theme } from './types';

function initialTheme(): Theme {
  const stored = window.localStorage.getItem('brazilian-tools-theme');
  return stored === 'light' || stored === 'system' ? stored : 'dark';
}

function getSystemTheme(): Exclude<Theme, 'system'> {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initialPalette(): Palette {
  const stored = window.localStorage.getItem('brazilian-tools-palette');
  return stored === 'yellow' || stored === 'blue' ? stored : 'green';
}

export default function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<Exclude<Theme, 'system'>>(getSystemTheme);
  const [palette, setPalette] = useState<Palette>(initialPalette);
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (matches: boolean) => {
      setSystemTheme(matches ? 'dark' : 'light');
    };
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      updateSystemTheme(event.matches);
    };

    updateSystemTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.palette = palette;
    window.localStorage.setItem('brazilian-tools-theme', theme);
    window.localStorage.setItem('brazilian-tools-palette', palette);
  }, [palette, resolvedTheme, theme]);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'pt-BR';
  }, [i18n.resolvedLanguage]);

  return (
    <div className="min-h-screen bg-brand-page font-sans text-brand-ink transition-colors">
      <main className="mx-auto w-[min(1180px,calc(100%-2rem))] py-7 sm:py-10">
        <header className="border-b border-brand-border pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-muted">
            <span>
              <span className="mr-2 inline-block size-2 rounded-full bg-brand-primary shadow-[0_0_14px_var(--brand-primary)]" />
              brazilian-tools / playground
            </span>
            <LanguageControls
              theme={theme}
              palette={palette}
              onPaletteChange={setPalette}
              onThemeChange={setTheme}
            />
          </div>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_260px]">
            <div>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-[-0.075em] sm:text-7xl">
                {t('hero.allFeatures')}
                <br />
                <em className="not-italic text-brand-primary">{t('hero.noGuesswork')}</em>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted">
                {t('hero.description')}
              </p>
            </div>
            <div className="border border-brand-accent bg-brand-card p-4">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-muted">
                {t('hero.status')}
              </span>
              <strong className="mt-2 block text-xs tracking-widest text-brand-primary">
                {t('hero.package')}
              </strong>
              <code className="mt-2 block font-mono text-[11px] text-brand-muted">
                github:marcuslma/brazilian-tools#main
              </code>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <CpfCard />
          <CnpjCard />
          <RgCard />
          <PhoneCard />
          <PisCard />
          <CnhCard />
          <PlateCard />
          <BrlCard />
          <StatesCard />
          <CepCard />
        </section>

        <footer className="mt-7 flex flex-col gap-3 border-t border-brand-border pt-5 font-mono text-[10px] uppercase tracking-widest text-brand-muted sm:flex-row sm:justify-between">
          <span>{t('footer.library')}</span>
          <span>{t('footer.stack')}</span>
        </footer>
      </main>
    </div>
  );
}
