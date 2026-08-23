import { useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import {
  BRAZILIAN_REGIONS,
  BRAZILIAN_STATES,
  formatBRL,
  formatCEP,
  formatCNPJ,
  formatCNH,
  formatCPF,
  formatLicensePlate,
  formatPIS,
  formatPhoneBR,
  formatRG,
  generateCNPJ,
  generateCNH,
  generateCPF,
  generateLicensePlate,
  generatePIS,
  generatePhoneBR,
  generateRG,
  getBrazilianState,
  getBrazilianStatesByRegion,
  isBrazilianState,
  lookupCEP,
  lookupCEPs,
  normalizeCEP,
  normalizeCNPJ,
  normalizeCNH,
  normalizeCPF,
  normalizeLicensePlate,
  normalizePIS,
  normalizePhoneBR,
  normalizeRG,
  parseBRL,
  parseLicensePlate,
  parsePhoneBR,
  SUPPORTED_PHONE_DDDS,
  SUPPORTED_RG_STATES,
  validateCEP,
  validateCNPJ,
  validateCNH,
  validateCPF,
  validateLicensePlate,
  validatePIS,
  validatePhoneBR,
  validateRG,
} from 'brazilian-tools';

type Locale = 'pt-BR' | 'en' | 'es';
type Theme = 'dark' | 'light';

type MessageKey =
  | 'waitingAction'
  | 'lookingUp'
  | 'error'
  | 'ok'
  | 'waiting'
  | 'waitingResponse'
  | 'allFeatures'
  | 'noGuesswork'
  | 'heroCopy'
  | 'status'
  | 'localPackage'
  | 'document'
  | 'business'
  | 'identity'
  | 'phone'
  | 'work'
  | 'driverLicense'
  | 'vehicle'
  | 'money'
  | 'states'
  | 'network'
  | 'validationDescription'
  | 'cnpjDescription'
  | 'numeric'
  | 'alpha'
  | 'rgDescription'
  | 'structural'
  | 'algorithm'
  | 'unsupported'
  | 'rgState'
  | 'validate'
  | 'normalize'
  | 'format'
  | 'generate'
  | 'supportedStates'
  | 'includeState'
  | 'phoneDescription'
  | 'formatInternational'
  | 'parse'
  | 'supportedDDDs'
  | 'generateMobile'
  | 'algorithmicDescription'
  | 'plateDescription'
  | 'generateOld'
  | 'generateMercosur'
  | 'brlValues'
  | 'brlDescription'
  | 'statesDescription'
  | 'region'
  | 'allRegions'
  | 'findState'
  | 'isState'
  | 'listRegion'
  | 'catalog'
  | 'cepDescription'
  | 'multipleCep'
  | 'cepProvider'
  | 'autoFallback'
  | 'includeRaw'
  | 'batchNote'
  | 'lookup'
  | 'lookupBatch'
  | 'language'
  | 'theme'
  | 'light'
  | 'dark'
  | 'domains'
  | 'phoneTitle'
  | 'plateTitle'
  | 'cnpjType'
  | 'platePlaceholder'
  | 'statePlaceholder'
  | 'footerLibrary'
  | 'footerStack'
  | 'output';

const messages: Record<Locale, Record<MessageKey, string>> = {
  'pt-BR': {
    waitingAction: 'Aguardando ação.',
    output: 'SAÍDA',
    lookingUp: 'CONSULTANDO…',
    error: 'ERRO',
    ok: 'OK',
    waiting: 'AGUARDANDO',
    waitingResponse: 'Aguardando resposta…',
    allFeatures: 'Todos os recursos,',
    noGuesswork: 'sem achismo.',
    heroCopy:
      'Um laboratório local em React para explorar todos os domínios públicos da biblioteca: validação, normalização, formatação, geração, parsing, catálogo e consultas de CEP.',
    status: 'STATUS',
    localPackage: 'REACT · PACOTE LOCAL',
    document: 'DOCUMENTO',
    business: 'EMPRESA',
    cnpjType: 'Tipo de CNPJ',
    identity: 'IDENTIDADE',
    phone: 'TELEFONE',
    phoneTitle: 'Telefone brasileiro',
    work: 'TRABALHO',
    driverLicense: 'HABILITAÇÃO',
    vehicle: 'VEÍCULO',
    plateTitle: 'Placa',
    money: 'DINHEIRO',
    states: 'ESTADOS',
    network: 'REDE',
    validationDescription: 'Validação, normalização, formatação e geração.',
    cnpjDescription: 'Formato numérico e novo formato alfanumérico.',
    numeric: 'Numérico',
    alpha: 'Alfa',
    rgDescription: 'SP com algoritmo; outros formatos, estruturalmente.',
    structural: 'Estrutural',
    algorithm: 'algoritmo',
    unsupported: 'não suportado',
    rgState: 'UF do RG',
    validate: 'Validar',
    normalize: 'Normalizar',
    format: 'Formatar',
    generate: 'Gerar',
    supportedStates: 'UFs suportadas',
    includeState: 'incluir UF ao gerar',
    phoneDescription: 'Fixos, celulares, DDD e parsing E.164.',
    formatInternational: 'formatar internacional',
    parse: 'Parsear',
    supportedDDDs: 'DDDs suportados',
    generateMobile: 'Gerar celular',
    algorithmicDescription: 'Validação algorítmica, normalização, formatação e geração.',
    plateDescription: 'Placa antiga e Mercosul, incluindo parsing do tipo.',
    platePlaceholder: 'ABC-1234 ou ABC1D23',
    generateOld: 'Gerar antiga',
    generateMercosur: 'Gerar Mercosul',
    brlValues: 'Valores em reais',
    brlDescription: 'Formate valores e faça parsing de texto em reais.',
    statesDescription: 'Catálogo de UFs, capitais, regiões e códigos IBGE.',
    statePlaceholder: 'SP ou São Paulo',
    region: 'Região',
    allRegions: 'Todas as regiões',
    findState: 'Buscar UF',
    isState: 'É UF?',
    listRegion: 'Listar região',
    catalog: 'Catálogo',
    cepDescription: 'Valide, normalize, formate, consulte um CEP ou teste consultas em lote.',
    multipleCep: 'ou vários separados por vírgula',
    cepProvider: 'Provedor do CEP',
    autoFallback: 'Auto · fallback',
    includeRaw: 'incluir resposta raw',
    batchNote: 'Para lote, separe os CEPs por vírgula ou quebra de linha.',
    lookup: 'Consultar',
    lookupBatch: 'Consultar lote',
    language: 'Idioma',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    domains: 'domínios',
    footerLibrary: 'brazilian-tools playground · React · 10 domínios',
    footerStack: 'TypeScript · Vite · ESM',
  },
  en: {
    waitingAction: 'Waiting for action.',
    output: 'OUTPUT',
    lookingUp: 'LOOKING UP…',
    error: 'ERROR',
    ok: 'OK',
    waiting: 'WAITING',
    waitingResponse: 'Waiting for response…',
    allFeatures: 'All features,',
    noGuesswork: 'no guesswork.',
    heroCopy:
      'A local React lab for exploring every public library domain: validation, normalization, formatting, generation, parsing, catalog browsing, and CEP lookups.',
    status: 'STATUS',
    localPackage: 'REACT · LOCAL PACKAGE',
    document: 'DOCUMENT',
    business: 'BUSINESS',
    cnpjType: 'CNPJ type',
    identity: 'IDENTITY',
    phone: 'PHONE',
    phoneTitle: 'Brazilian Phone',
    work: 'WORK',
    driverLicense: 'DRIVER LICENSE',
    vehicle: 'VEHICLE',
    plateTitle: 'License plate',
    money: 'MONEY',
    states: 'STATES',
    network: 'NETWORK',
    validationDescription: 'Validation, normalization, formatting, and generation.',
    cnpjDescription: 'Numeric and new alphanumeric formats.',
    numeric: 'Numeric',
    alpha: 'Alpha',
    rgDescription: 'SP with an algorithm; other formats structurally.',
    structural: 'Structural',
    algorithm: 'algorithm',
    unsupported: 'unsupported',
    rgState: 'RG state',
    validate: 'Validate',
    normalize: 'Normalize',
    format: 'Format',
    generate: 'Generate',
    supportedStates: 'Supported states',
    includeState: 'include state when generating',
    phoneDescription: 'Landlines, mobile numbers, DDD, and E.164 parsing.',
    formatInternational: 'format internationally',
    parse: 'Parse',
    supportedDDDs: 'Supported DDDs',
    generateMobile: 'Generate mobile',
    algorithmicDescription: 'Algorithmic validation, normalization, formatting, and generation.',
    plateDescription: 'Old and Mercosur plates, including type parsing.',
    platePlaceholder: 'ABC-1234 or ABC1D23',
    generateOld: 'Generate old',
    generateMercosur: 'Generate Mercosur',
    brlValues: 'BRL Values',
    brlDescription: 'Format values and parse BRL text.',
    statesDescription: 'Catalog of states, capitals, regions, and IBGE codes.',
    statePlaceholder: 'SP or São Paulo',
    region: 'Region',
    allRegions: 'All regions',
    findState: 'Find state',
    isState: 'Is a state?',
    listRegion: 'List region',
    catalog: 'Catalog',
    cepDescription: 'Validate, normalize, format, look up a CEP, or test batch lookups.',
    multipleCep: 'or multiple values separated by commas',
    cepProvider: 'CEP provider',
    autoFallback: 'Auto · fallback',
    includeRaw: 'include raw response',
    batchNote: 'For batch lookups, separate CEPs with commas or line breaks.',
    lookup: 'Look up',
    lookupBatch: 'Look up batch',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    domains: 'domains',
    footerLibrary: 'brazilian-tools playground · React · 10 domains',
    footerStack: 'TypeScript · Vite · ESM',
  },
  es: {
    waitingAction: 'Esperando una acción.',
    output: 'SALIDA',
    lookingUp: 'CONSULTANDO…',
    error: 'ERROR',
    ok: 'OK',
    waiting: 'ESPERANDO',
    waitingResponse: 'Esperando respuesta…',
    allFeatures: 'Todas las funciones,',
    noGuesswork: 'sin adivinanzas.',
    heroCopy:
      'Un laboratorio local en React para explorar todos los dominios públicos de la biblioteca: validación, normalización, formato, generación, análisis, catálogo y consultas de CEP.',
    status: 'ESTADO',
    localPackage: 'REACT · PAQUETE LOCAL',
    document: 'DOCUMENTO',
    business: 'EMPRESA',
    cnpjType: 'Tipo de CNPJ',
    identity: 'IDENTIDAD',
    phone: 'TELÉFONO',
    phoneTitle: 'Teléfono brasileño',
    work: 'TRABAJO',
    driverLicense: 'LICENCIA DE CONDUCIR',
    vehicle: 'VEHÍCULO',
    plateTitle: 'Matrícula',
    money: 'DINERO',
    states: 'ESTADOS',
    network: 'RED',
    validationDescription: 'Validación, normalización, formato y generación.',
    cnpjDescription: 'Formato numérico y nuevo formato alfanumérico.',
    numeric: 'Numérico',
    alpha: 'Alfa',
    rgDescription: 'SP con algoritmo; otros formatos estructuralmente.',
    structural: 'Estructural',
    algorithm: 'algoritmo',
    unsupported: 'no compatible',
    rgState: 'Estado del RG',
    validate: 'Validar',
    normalize: 'Normalizar',
    format: 'Formatear',
    generate: 'Generar',
    supportedStates: 'Estados compatibles',
    includeState: 'incluir estado al generar',
    phoneDescription: 'Líneas fijas, móviles, DDD y análisis E.164.',
    formatInternational: 'formatear internacionalmente',
    parse: 'Analizar',
    supportedDDDs: 'DDDs compatibles',
    generateMobile: 'Generar móvil',
    algorithmicDescription: 'Validación algorítmica, normalización, formato y generación.',
    plateDescription: 'Matrículas antiguas y Mercosur, incluido el análisis del tipo.',
    platePlaceholder: 'ABC-1234 o ABC1D23',
    generateOld: 'Generar antigua',
    generateMercosur: 'Generar Mercosur',
    brlValues: 'Valores en BRL',
    brlDescription: 'Formatea valores y analiza texto en BRL.',
    statesDescription: 'Catálogo de estados, capitales, regiones y códigos IBGE.',
    statePlaceholder: 'SP o São Paulo',
    region: 'Región',
    allRegions: 'Todas las regiones',
    findState: 'Buscar estado',
    isState: '¿Es un estado?',
    listRegion: 'Listar región',
    catalog: 'Catálogo',
    cepDescription: 'Valida, normaliza, formatea, consulta un CEP o prueba consultas por lote.',
    multipleCep: 'o varios valores separados por comas',
    cepProvider: 'Proveedor de CEP',
    autoFallback: 'Automático · fallback',
    includeRaw: 'incluir respuesta raw',
    batchNote: 'Para consultas por lote, separa los CEPs con comas o saltos de línea.',
    lookup: 'Consultar',
    lookupBatch: 'Consultar lote',
    language: 'Idioma',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    domains: 'dominios',
    footerLibrary: 'brazilian-tools playground · React · 10 dominios',
    footerStack: 'TypeScript · Vite · ESM',
  },
};

type Translate = (key: MessageKey) => string;

type ResultTone = 'neutral' | 'success' | 'error';
type Action = () => unknown | Promise<unknown>;

type ToolState = {
  input: string;
  setInput: (value: string) => void;
  output: unknown;
  tone: ResultTone;
  busy: boolean;
  execute: (action: Action, fillInput?: boolean) => Promise<void>;
};

function useToolState(initialInput = ''): ToolState {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState<unknown>(null);
  const [tone, setTone] = useState<ResultTone>('neutral');
  const [busy, setBusy] = useState(false);

  async function execute(action: Action, fillInput = false): Promise<void> {
    setBusy(true);
    try {
      const value = await action();
      setOutput(value);
      setTone(typeof value === 'boolean' ? (value ? 'success' : 'error') : 'success');
      if (fillInput) {
        const generated =
          typeof value === 'object' && value !== null && 'value' in value ? value.value : value;
        if (typeof generated === 'string' || typeof generated === 'number')
          setInput(String(generated));
      }
    } catch (error) {
      setOutput(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      setTone('error');
    } finally {
      setBusy(false);
    }
  }

  return { input, setInput, output, tone, busy, execute };
}

function displayValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function ToolCard({
  index,
  tag,
  title,
  description,
  accent,
  tool,
  control,
  children,
  note,
  t,
}: {
  index: string;
  tag: string;
  title: string;
  description: string;
  accent: string;
  tool: ToolState;
  control: ReactNode;
  children: ReactNode;
  note?: string;
  t: Translate;
}) {
  return (
    <article className={`tool-card ${accent}`}>
      <div className="card-top">
        <span className="index">{index}</span>
        <span className="tag">{tag}</span>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {control}
      <div className="button-row">{children}</div>
      {note && <small>{note}</small>}
      <div className={`card-output ${tool.tone}`} aria-live="polite">
        <div className="output-heading">
          <span>{t('output')}</span>
          <span>
            {tool.busy
              ? t('lookingUp')
              : tool.tone === 'error'
                ? t('error')
                : tool.tone === 'success'
                  ? t('ok')
                  : t('waiting')}
          </span>
        </div>
        <pre>
          {tool.busy
            ? t('waitingResponse')
            : tool.output === null
              ? t('waitingAction')
              : displayValue(tool.output)}
        </pre>
      </div>
    </article>
  );
}

function TextInput({
  tool,
  id,
  placeholder,
}: {
  tool: ToolState;
  id: string;
  placeholder: string;
}) {
  return (
    <input
      id={id}
      value={tool.input}
      onChange={(event) => tool.setInput(event.target.value)}
      placeholder={placeholder}
      autoComplete="off"
    />
  );
}

function App() {
  const cpf = useToolState();
  const cnpj = useToolState();
  const rg = useToolState();
  const phone = useToolState();
  const pis = useToolState();
  const cnh = useToolState();
  const plate = useToolState();
  const brl = useToolState();
  const states = useToolState();
  const cep = useToolState();
  const [cnpjKind, setCnpjKind] = useState<'numeric' | 'alphanumeric'>('numeric');
  const [rgState, setRgState] = useState('');
  const [includeRGState, setIncludeRGState] = useState(false);
  const [internationalPhone, setInternationalPhone] = useState(false);
  const [stateRegion, setStateRegion] = useState('');
  const [cepProvider, setCepProvider] = useState<'auto' | 'brasilapi' | 'viacep'>('auto');
  const [cepRaw, setCepRaw] = useState(false);
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem('brazilian-tools-locale');
    if (stored === 'en' || stored === 'es' || stored === 'pt-BR') return stored;
    const browserLocale = navigator.language.toLowerCase();
    if (browserLocale.startsWith('en')) return 'en';
    if (browserLocale.startsWith('es')) return 'es';
    return 'pt-BR';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = window.localStorage.getItem('brazilian-tools-theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const t: Translate = (key) => messages[locale][key];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('brazilian-tools-locale', locale);
    window.localStorage.setItem('brazilian-tools-theme', theme);
  }, [locale, theme]);

  return (
    <main className="shell">
      <header className="hero">
        <div className="eyebrow">
          <span className="pulse" /> brazilian-tools / playground
        </div>
        <div className="top-controls">
          <label>
            <span>{t('language')}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
              <option value="pt-BR">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? `☀ ${t('light')}` : `☾ ${t('dark')}`}
          </button>
        </div>
        <div className="hero-grid">
          <div>
            <h1>
              {t('allFeatures')}
              <br />
              <em>{t('noGuesswork')}</em>
            </h1>
            <p className="hero-copy">{t('heroCopy')}</p>
          </div>
          <div className="hero-note">
            <span className="note-label">{t('status')}</span>
            <strong>{t('localPackage')}</strong>
            <code>file:../brazilian-tools</code>
          </div>
        </div>
      </header>

      <section className="tool-grid">
        <ToolCard
          index="01"
          tag={t('document')}
          title="CPF"
          description={t('validationDescription')}
          accent="accent-yellow"
          tool={cpf}
          t={t}
          control={<TextInput tool={cpf} id="cpf-input" placeholder="529.982.247-25" />}
        >
          <button onClick={() => void cpf.execute(() => validateCPF(cpf.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void cpf.execute(() => normalizeCPF(cpf.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void cpf.execute(() => formatCPF(cpf.input))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() => void cpf.execute(() => generateCPF({ formatted: true }), true)}
          >
            {t('generate')}
          </button>
        </ToolCard>
        <ToolCard
          index="02"
          tag={t('business')}
          title="CNPJ"
          description={t('cnpjDescription')}
          accent="accent-pink"
          tool={cnpj}
          t={t}
          control={
            <div className="input-line">
              <TextInput tool={cnpj} id="cnpj-input" placeholder="04.252.011/0001-10" />
              <select
                value={cnpjKind}
                onChange={(event) => setCnpjKind(event.target.value as 'numeric' | 'alphanumeric')}
                aria-label={t('cnpjType')}
              >
                <option value="numeric">{t('numeric')}</option>
                <option value="alphanumeric">{t('alpha')}</option>
              </select>
            </div>
          }
        >
          <button onClick={() => void cnpj.execute(() => validateCNPJ(cnpj.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void cnpj.execute(() => normalizeCNPJ(cnpj.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void cnpj.execute(() => formatCNPJ(cnpj.input))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void cnpj.execute(() => generateCNPJ({ kind: cnpjKind, formatted: true }), true)
            }
          >
            {t('generate')}
          </button>
        </ToolCard>
        <ToolCard
          index="03"
          tag={t('identity')}
          title="RG"
          description={t('rgDescription')}
          accent="accent-cyan"
          tool={rg}
          t={t}
          control={
            <div className="input-line">
              <TextInput tool={rg} id="rg-input" placeholder="12.345.678-2" />
              <select
                value={rgState}
                onChange={(event) => setRgState(event.target.value)}
                aria-label={t('rgState')}
              >
                <option value="">{t('structural')}</option>
                <option value="SP">SP / {t('algorithm')}</option>
                <option value="RJ">RJ / {t('unsupported')}</option>
              </select>
            </div>
          }
        >
          <button
            onClick={() =>
              void rg.execute(() => validateRG(rg.input, rgState ? { state: rgState } : {}))
            }
          >
            {t('validate')}
          </button>
          <button onClick={() => void rg.execute(() => normalizeRG(rg.input, { state: 'SP' }))}>
            {t('normalize')}
          </button>
          <button onClick={() => void rg.execute(() => formatRG(rg.input, { state: 'SP' }))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void rg.execute(() => {
                if (includeRGState) return generateRG({ formatted: true, includeState: true });
                return generateRG({ formatted: true });
              }, true)
            }
          >
            {t('generate')}
          </button>
          <button className="secondary" onClick={() => void rg.execute(() => SUPPORTED_RG_STATES)}>
            {t('supportedStates')}
          </button>
          <label className="check-label">
            <input
              type="checkbox"
              checked={includeRGState}
              onChange={(event) => setIncludeRGState(event.target.checked)}
            />{' '}
            {t('includeState')}
          </label>
        </ToolCard>
        <ToolCard
          index="04"
          tag={t('phone')}
          title={t('phoneTitle')}
          description={t('phoneDescription')}
          accent="accent-violet"
          tool={phone}
          t={t}
          control={
            <>
              <TextInput tool={phone} id="phone-input" placeholder="+55 (11) 98765-4321" />
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={internationalPhone}
                  onChange={(event) => setInternationalPhone(event.target.checked)}
                />{' '}
                {t('formatInternational')}
              </label>
            </>
          }
        >
          <button onClick={() => void phone.execute(() => validatePhoneBR(phone.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void phone.execute(() => normalizePhoneBR(phone.input))}>
            {t('normalize')}
          </button>
          <button
            onClick={() =>
              void phone.execute(() =>
                formatPhoneBR(phone.input, { international: internationalPhone }),
              )
            }
          >
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() => void phone.execute(() => parsePhoneBR(phone.input))}
          >
            {t('parse')}
          </button>
          <button
            className="secondary"
            onClick={() => void phone.execute(() => SUPPORTED_PHONE_DDDS)}
          >
            {t('supportedDDDs')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void phone.execute(
                () =>
                  generatePhoneBR({
                    type: 'mobile',
                    formatted: true,
                    international: internationalPhone,
                  }),
                true,
              )
            }
          >
            {t('generateMobile')}
          </button>
        </ToolCard>
        <ToolCard
          index="05"
          tag={t('work')}
          title="PIS / PASEP / NIT"
          description={t('validationDescription')}
          accent="accent-orange"
          tool={pis}
          t={t}
          control={<TextInput tool={pis} id="pis-input" placeholder="120.4456.789-5" />}
        >
          <button onClick={() => void pis.execute(() => validatePIS(pis.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void pis.execute(() => normalizePIS(pis.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void pis.execute(() => formatPIS(pis.input))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() => void pis.execute(() => generatePIS({ formatted: true }), true)}
          >
            {t('generate')}
          </button>
        </ToolCard>
        <ToolCard
          index="06"
          tag={t('driverLicense')}
          title="CNH"
          description={t('algorithmicDescription')}
          accent="accent-blue"
          tool={cnh}
          t={t}
          control={<TextInput tool={cnh} id="cnh-input" placeholder="01234567890" />}
        >
          <button onClick={() => void cnh.execute(() => validateCNH(cnh.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void cnh.execute(() => normalizeCNH(cnh.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void cnh.execute(() => formatCNH(cnh.input))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() => void cnh.execute(() => generateCNH({ formatted: true }), true)}
          >
            {t('generate')}
          </button>
        </ToolCard>
        <ToolCard
          index="07"
          tag={t('vehicle')}
          title={t('plateTitle')}
          description={t('plateDescription')}
          accent="accent-red"
          tool={plate}
          t={t}
          control={<TextInput tool={plate} id="plate-input" placeholder={t('platePlaceholder')} />}
        >
          <button onClick={() => void plate.execute(() => validateLicensePlate(plate.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void plate.execute(() => normalizeLicensePlate(plate.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void plate.execute(() => formatLicensePlate(plate.input))}>
            {t('format')}
          </button>
          <button
            className="secondary"
            onClick={() => void plate.execute(() => parseLicensePlate(plate.input))}
          >
            {t('parse')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void plate.execute(() => generateLicensePlate({ kind: 'old', formatted: true }), true)
            }
          >
            {t('generateOld')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void plate.execute(() => generateLicensePlate({ kind: 'mercosul' }), true)
            }
          >
            {t('generateMercosur')}
          </button>
        </ToolCard>
        <ToolCard
          index="08"
          tag={t('money')}
          title={t('brlValues')}
          description={t('brlDescription')}
          accent="accent-gold"
          tool={brl}
          t={t}
          control={<TextInput tool={brl} id="brl-input" placeholder="R$ 1.234,56" />}
        >
          <button onClick={() => void brl.execute(() => formatBRL(parseBRL(brl.input)))}>
            {t('format')}
          </button>
          <button onClick={() => void brl.execute(() => parseBRL(brl.input))}>{t('parse')}</button>
        </ToolCard>
        <ToolCard
          index="09"
          tag={t('states')}
          title={t('states')}
          description={t('statesDescription')}
          accent="accent-green"
          tool={states}
          t={t}
          control={
            <div className="input-line">
              <TextInput tool={states} id="state-input" placeholder={t('statePlaceholder')} />
              <select
                value={stateRegion}
                onChange={(event) => setStateRegion(event.target.value)}
                aria-label={t('region')}
              >
                <option value="">{t('allRegions')}</option>
                {BRAZILIAN_REGIONS.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </div>
          }
        >
          <button onClick={() => void states.execute(() => getBrazilianState(states.input))}>
            {t('findState')}
          </button>
          <button onClick={() => void states.execute(() => isBrazilianState(states.input))}>
            {t('isState')}
          </button>
          <button
            onClick={() =>
              void states.execute(() => getBrazilianStatesByRegion(stateRegion || states.input))
            }
          >
            {t('listRegion')}
          </button>
          <button className="secondary" onClick={() => void states.execute(() => BRAZILIAN_STATES)}>
            {t('catalog')}
          </button>
        </ToolCard>
        <ToolCard
          index="10"
          tag={`${t('cepProvider')} / ${t('network')}`}
          title="CEP"
          description={t('cepDescription')}
          accent="accent-lime"
          tool={cep}
          t={t}
          control={
            <>
              <div className="input-line">
                <TextInput
                  tool={cep}
                  id="cep-input"
                  placeholder={`01001-000 ${t('multipleCep')}`}
                />
                <select
                  value={cepProvider}
                  onChange={(event) =>
                    setCepProvider(event.target.value as 'auto' | 'brasilapi' | 'viacep')
                  }
                  aria-label={t('cepProvider')}
                >
                  <option value="auto">{t('autoFallback')}</option>
                  <option value="brasilapi">BrasilAPI</option>
                  <option value="viacep">ViaCEP</option>
                </select>
              </div>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={cepRaw}
                  onChange={(event) => setCepRaw(event.target.checked)}
                />{' '}
                {t('includeRaw')}
              </label>
            </>
          }
          note={t('batchNote')}
        >
          <button onClick={() => void cep.execute(() => validateCEP(cep.input))}>
            {t('validate')}
          </button>
          <button onClick={() => void cep.execute(() => normalizeCEP(cep.input))}>
            {t('normalize')}
          </button>
          <button onClick={() => void cep.execute(() => formatCEP(cep.input))}>
            {t('format')}
          </button>
          <button
            onClick={() =>
              void cep.execute(() =>
                lookupCEP(cep.input, { provider: cepProvider, includeRaw: cepRaw }),
              )
            }
          >
            {t('lookup')}
          </button>
          <button
            className="secondary"
            onClick={() =>
              void cep.execute(() =>
                lookupCEPs(
                  cep.input
                    .split(/[\n,;]+/)
                    .map((value) => value.trim())
                    .filter(Boolean),
                  { provider: cepProvider, includeRaw: cepRaw },
                ),
              )
            }
          >
            {t('lookupBatch')}
          </button>
        </ToolCard>
      </section>
      <footer>
        <span>{t('footerLibrary')}</span>
        <span>{t('footerStack')}</span>
      </footer>
    </main>
  );
}

createRoot(document.querySelector('#app')!).render(<App />);
