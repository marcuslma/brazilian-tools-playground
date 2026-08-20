import './style.css';
import {
  formatCNPJ,
  formatCPF,
  formatPhoneBR,
  formatRG,
  generateCNPJ,
  generateCPF,
  generateRG,
  lookupCEP,
  normalizeCNPJ,
  normalizeCPF,
  normalizePhoneBR,
  normalizeRG,
  parsePhoneBR,
  validateCNPJ,
  validateCPF,
  validatePhoneBR,
  validateRG,
} from 'brazilian-tools';

type ResultTone = 'neutral' | 'success' | 'error';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div class="eyebrow"><span class="pulse"></span> brazilian-tools / playground</div>
      <div class="hero-grid">
        <div>
          <h1>Documentos brasileiros,<br><em>sem achismo.</em></h1>
          <p class="hero-copy">Um laboratório local para explorar validação, normalização, formatação e geração com a biblioteca.</p>
        </div>
        <div class="hero-note">
          <span class="note-label">STATUS</span>
          <strong>LOCAL PACKAGE</strong>
          <code>file:../brazilian-tools</code>
        </div>
      </div>
    </header>

    <section class="result-panel" aria-live="polite">
      <div class="result-heading">
        <span class="eyebrow">OUTPUT</span>
        <span id="result-status" class="status neutral">Aguardando entrada</span>
      </div>
      <pre id="result-value">Escolha uma ferramenta para começar.</pre>
    </section>

    <section class="tool-grid">
      <article class="tool-card accent-yellow">
        <div class="card-top"><span class="index">01</span><span class="tag">DOCUMENTO</span></div>
        <h2>CPF</h2>
        <p>Valide, normalize, formate ou gere um CPF.</p>
        <input id="cpf-input" placeholder="529.982.247-25" autocomplete="off" />
        <div class="button-row">
          <button data-action="validate-cpf">Validar</button>
          <button data-action="normalize-cpf">Normalizar</button>
          <button data-action="format-cpf">Formatar</button>
          <button class="secondary" data-action="generate-cpf">Gerar</button>
        </div>
      </article>

      <article class="tool-card accent-pink">
        <div class="card-top"><span class="index">02</span><span class="tag">EMPRESA</span></div>
        <h2>CNPJ</h2>
        <p>Inclui o novo formato alfanumérico.</p>
        <div class="input-line">
          <input id="cnpj-input" placeholder="04.252.011/0001-10" autocomplete="off" />
          <select id="cnpj-kind" aria-label="Tipo de CNPJ"><option value="numeric">Numérico</option><option value="alphanumeric">Alfa</option></select>
        </div>
        <div class="button-row">
          <button data-action="validate-cnpj">Validar</button>
          <button data-action="normalize-cnpj">Normalizar</button>
          <button data-action="format-cnpj">Formatar</button>
          <button class="secondary" data-action="generate-cnpj">Gerar</button>
        </div>
      </article>

      <article class="tool-card accent-cyan">
        <div class="card-top"><span class="index">03</span><span class="tag">IDENTIDADE</span></div>
        <h2>RG</h2>
        <p>SP com algoritmo; outros formatos, estruturalmente.</p>
        <div class="input-line">
          <input id="rg-input" placeholder="12.345.678-2" autocomplete="off" />
          <select id="rg-state" aria-label="UF do RG"><option value="">Estrutural</option><option value="SP">SP / algoritmo</option><option value="RJ">RJ / não suportado</option></select>
        </div>
        <div class="button-row">
          <button data-action="validate-rg">Validar</button>
          <button data-action="normalize-rg">Normalizar</button>
          <button data-action="format-rg">Formatar</button>
          <button class="secondary" data-action="generate-rg">Gerar</button>
        </div>
        <label class="check-label"><input id="rg-include-state" type="checkbox" /> incluir UF ao gerar</label>
      </article>

      <article class="tool-card accent-violet">
        <div class="card-top"><span class="index">04</span><span class="tag">TELEFONE</span></div>
        <h2>Telefone BR</h2>
        <p>Fixos, celulares, DDD e parsing E.164.</p>
        <input id="phone-input" placeholder="+55 (11) 98765-4321" autocomplete="off" />
        <div class="button-row">
          <button data-action="validate-phone">Validar</button>
          <button data-action="normalize-phone">Normalizar</button>
          <button data-action="format-phone">Formatar</button>
          <button class="secondary" data-action="parse-phone">Parsear</button>
        </div>
      </article>

      <article class="tool-card accent-green wide-card">
        <div class="card-top"><span class="index">05</span><span class="tag">ENDEREÇO / REDE</span></div>
        <div class="wide-content">
          <div>
            <h2>CEP lookup</h2>
            <p>Consulte BrasilAPI, ViaCEP ou deixe o modo automático fazer o fallback.</p>
          </div>
          <div class="cep-controls">
            <input id="cep-input" placeholder="01001-000" autocomplete="off" />
            <select id="cep-provider" aria-label="Provedor do CEP"><option value="auto">Auto · fallback</option><option value="brasilapi">BrasilAPI</option><option value="viacep">ViaCEP</option></select>
            <button data-action="lookup-cep">Consultar CEP</button>
          </div>
        </div>
      </article>
    </section>

    <footer><span>brazilian-tools playground</span><span>TypeScript · Vite · ESM</span></footer>
  </main>
`;

const resultValue = document.querySelector<HTMLPreElement>('#result-value')!;
const resultStatus = document.querySelector<HTMLSpanElement>('#result-status')!;

function showResult(value: unknown, tone: ResultTone = 'neutral'): void {
  resultStatus.className = `status ${tone}`;
  resultStatus.textContent = tone === 'success' ? 'OK' : tone === 'error' ? 'ERRO' : 'RESULTADO';
  resultValue.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function inputValue(id: string): string {
  return document.querySelector<HTMLInputElement>(`#${id}`)!.value.trim();
}

function selectedValue(id: string): string {
  return document.querySelector<HTMLSelectElement>(`#${id}`)!.value;
}

function runSafely(action: () => unknown): void {
  try {
    const value = action();
    showResult(value, typeof value === 'boolean' ? (value ? 'success' : 'error') : 'success');
  } catch (error) {
    showResult(error instanceof Error ? error.message : String(error), 'error');
  }
}

const actions: Record<string, () => void> = {
  'validate-cpf': () => runSafely(() => validateCPF(inputValue('cpf-input'))),
  'normalize-cpf': () => runSafely(() => normalizeCPF(inputValue('cpf-input'))),
  'format-cpf': () => runSafely(() => formatCPF(inputValue('cpf-input'))),
  'generate-cpf': () => runSafely(() => generateCPF({ formatted: true })),
  'validate-cnpj': () => runSafely(() => validateCNPJ(inputValue('cnpj-input'))),
  'normalize-cnpj': () => runSafely(() => normalizeCNPJ(inputValue('cnpj-input'))),
  'format-cnpj': () => runSafely(() => formatCNPJ(inputValue('cnpj-input'))),
  'generate-cnpj': () =>
    runSafely(() =>
      generateCNPJ({
        kind: selectedValue('cnpj-kind') as 'numeric' | 'alphanumeric',
        formatted: true,
      }),
    ),
  'validate-rg': () =>
    runSafely(() => {
      const state = selectedValue('rg-state');
      return validateRG(inputValue('rg-input'), state ? { state } : {});
    }),
  'normalize-rg': () => runSafely(() => normalizeRG(inputValue('rg-input'), { state: 'SP' })),
  'format-rg': () => runSafely(() => formatRG(inputValue('rg-input'), { state: 'SP' })),
  'generate-rg': () =>
    runSafely(() => {
      const includeState = document.querySelector<HTMLInputElement>('#rg-include-state')!.checked;
      return includeState
        ? generateRG({ formatted: true, includeState: true })
        : generateRG({ formatted: true });
    }),
  'validate-phone': () => runSafely(() => validatePhoneBR(inputValue('phone-input'))),
  'normalize-phone': () => runSafely(() => normalizePhoneBR(inputValue('phone-input'))),
  'format-phone': () => runSafely(() => formatPhoneBR(inputValue('phone-input'))),
  'parse-phone': () => runSafely(() => parsePhoneBR(inputValue('phone-input'))),
};

document.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.dataset.action!;
    if (action === 'lookup-cep') {
      resultStatus.className = 'status neutral';
      resultStatus.textContent = 'CONSULTANDO…';
      resultValue.textContent = 'Aguardando resposta do provedor…';
      try {
        const address = await lookupCEP(inputValue('cep-input'), {
          provider: selectedValue('cep-provider') as 'auto' | 'brasilapi' | 'viacep',
        });
        showResult(address, 'success');
      } catch (error) {
        showResult(error instanceof Error ? error.message : String(error), 'error');
      }
      return;
    }
    actions[action]?.();
  });
});
