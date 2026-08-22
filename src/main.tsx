import { useState, type ReactNode } from 'react';
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
  normalizeBRL,
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
  const [output, setOutput] = useState<unknown>('Aguardando ação.');
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
          <span>OUTPUT</span>
          <span>
            {tool.busy
              ? 'CONSULTANDO…'
              : tool.tone === 'error'
                ? 'ERRO'
                : tool.tone === 'success'
                  ? 'OK'
                  : 'AGUARDANDO'}
          </span>
        </div>
        <pre>{tool.busy ? 'Aguardando resposta…' : displayValue(tool.output)}</pre>
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

  return (
    <main className="shell">
      <header className="hero">
        <div className="eyebrow">
          <span className="pulse" /> brazilian-tools / playground
        </div>
        <div className="hero-grid">
          <div>
            <h1>
              Todos os recursos,
              <br />
              <em>sem achismo.</em>
            </h1>
            <p className="hero-copy">
              Um laboratório local em React para explorar todos os domínios públicos da biblioteca:
              validação, normalização, formatação, geração, parsing, catálogo e consultas de CEP.
            </p>
          </div>
          <div className="hero-note">
            <span className="note-label">STATUS</span>
            <strong>REACT · LOCAL PACKAGE</strong>
            <code>file:../brazilian-tools</code>
          </div>
        </div>
      </header>

      <section className="tool-grid">
        <ToolCard
          index="01"
          tag="DOCUMENTO"
          title="CPF"
          description="Validação, normalização, formatação e geração."
          accent="accent-yellow"
          tool={cpf}
          control={<TextInput tool={cpf} id="cpf-input" placeholder="529.982.247-25" />}
        >
          <button onClick={() => void cpf.execute(() => validateCPF(cpf.input))}>Validar</button>
          <button onClick={() => void cpf.execute(() => normalizeCPF(cpf.input))}>
            Normalizar
          </button>
          <button onClick={() => void cpf.execute(() => formatCPF(cpf.input))}>Formatar</button>
          <button
            className="secondary"
            onClick={() => void cpf.execute(() => generateCPF({ formatted: true }), true)}
          >
            Gerar
          </button>
        </ToolCard>
        <ToolCard
          index="02"
          tag="EMPRESA"
          title="CNPJ"
          description="Formato numérico e novo formato alfanumérico."
          accent="accent-pink"
          tool={cnpj}
          control={
            <div className="input-line">
              <TextInput tool={cnpj} id="cnpj-input" placeholder="04.252.011/0001-10" />
              <select
                value={cnpjKind}
                onChange={(event) => setCnpjKind(event.target.value as 'numeric' | 'alphanumeric')}
                aria-label="Tipo de CNPJ"
              >
                <option value="numeric">Numérico</option>
                <option value="alphanumeric">Alfa</option>
              </select>
            </div>
          }
        >
          <button onClick={() => void cnpj.execute(() => validateCNPJ(cnpj.input))}>Validar</button>
          <button onClick={() => void cnpj.execute(() => normalizeCNPJ(cnpj.input))}>
            Normalizar
          </button>
          <button onClick={() => void cnpj.execute(() => formatCNPJ(cnpj.input))}>Formatar</button>
          <button
            className="secondary"
            onClick={() =>
              void cnpj.execute(() => generateCNPJ({ kind: cnpjKind, formatted: true }), true)
            }
          >
            Gerar
          </button>
        </ToolCard>
        <ToolCard
          index="03"
          tag="IDENTIDADE"
          title="RG"
          description="SP com algoritmo; outros formatos, estruturalmente."
          accent="accent-cyan"
          tool={rg}
          control={
            <div className="input-line">
              <TextInput tool={rg} id="rg-input" placeholder="12.345.678-2" />
              <select
                value={rgState}
                onChange={(event) => setRgState(event.target.value)}
                aria-label="UF do RG"
              >
                <option value="">Estrutural</option>
                <option value="SP">SP / algoritmo</option>
                <option value="RJ">RJ / não suportado</option>
              </select>
            </div>
          }
        >
          <button
            onClick={() =>
              void rg.execute(() => validateRG(rg.input, rgState ? { state: rgState } : {}))
            }
          >
            Validar
          </button>
          <button onClick={() => void rg.execute(() => normalizeRG(rg.input, { state: 'SP' }))}>
            Normalizar
          </button>
          <button onClick={() => void rg.execute(() => formatRG(rg.input, { state: 'SP' }))}>
            Formatar
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
            Gerar
          </button>
          <button className="secondary" onClick={() => void rg.execute(() => SUPPORTED_RG_STATES)}>
            UFs suportadas
          </button>
          <label className="check-label">
            <input
              type="checkbox"
              checked={includeRGState}
              onChange={(event) => setIncludeRGState(event.target.checked)}
            />{' '}
            incluir UF ao gerar
          </label>
        </ToolCard>
        <ToolCard
          index="04"
          tag="TELEFONE"
          title="Telefone BR"
          description="Fixos, celulares, DDD e parsing E.164."
          accent="accent-violet"
          tool={phone}
          control={
            <>
              <TextInput tool={phone} id="phone-input" placeholder="+55 (11) 98765-4321" />
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={internationalPhone}
                  onChange={(event) => setInternationalPhone(event.target.checked)}
                />{' '}
                formatar internacional
              </label>
            </>
          }
        >
          <button onClick={() => void phone.execute(() => validatePhoneBR(phone.input))}>
            Validar
          </button>
          <button onClick={() => void phone.execute(() => normalizePhoneBR(phone.input))}>
            Normalizar
          </button>
          <button
            onClick={() =>
              void phone.execute(() =>
                formatPhoneBR(phone.input, { international: internationalPhone }),
              )
            }
          >
            Formatar
          </button>
          <button
            className="secondary"
            onClick={() => void phone.execute(() => parsePhoneBR(phone.input))}
          >
            Parsear
          </button>
          <button
            className="secondary"
            onClick={() => void phone.execute(() => SUPPORTED_PHONE_DDDS)}
          >
            DDDs suportados
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
            Gerar celular
          </button>
        </ToolCard>
        <ToolCard
          index="05"
          tag="TRABALHO"
          title="PIS / PASEP / NIT"
          description="Validação, normalização, formatação e geração."
          accent="accent-orange"
          tool={pis}
          control={<TextInput tool={pis} id="pis-input" placeholder="120.4456.789-5" />}
        >
          <button onClick={() => void pis.execute(() => validatePIS(pis.input))}>Validar</button>
          <button onClick={() => void pis.execute(() => normalizePIS(pis.input))}>
            Normalizar
          </button>
          <button onClick={() => void pis.execute(() => formatPIS(pis.input))}>Formatar</button>
          <button
            className="secondary"
            onClick={() => void pis.execute(() => generatePIS({ formatted: true }), true)}
          >
            Gerar
          </button>
        </ToolCard>
        <ToolCard
          index="06"
          tag="HABILITAÇÃO"
          title="CNH"
          description="Validação algorítmica, normalização, formatação e geração."
          accent="accent-blue"
          tool={cnh}
          control={<TextInput tool={cnh} id="cnh-input" placeholder="01234567890" />}
        >
          <button onClick={() => void cnh.execute(() => validateCNH(cnh.input))}>Validar</button>
          <button onClick={() => void cnh.execute(() => normalizeCNH(cnh.input))}>
            Normalizar
          </button>
          <button onClick={() => void cnh.execute(() => formatCNH(cnh.input))}>Formatar</button>
          <button
            className="secondary"
            onClick={() => void cnh.execute(() => generateCNH({ formatted: true }), true)}
          >
            Gerar
          </button>
        </ToolCard>
        <ToolCard
          index="07"
          tag="VEÍCULO"
          title="Placa"
          description="Placa antiga e Mercosul, incluindo parsing do tipo."
          accent="accent-red"
          tool={plate}
          control={<TextInput tool={plate} id="plate-input" placeholder="ABC-1234 ou ABC1D23" />}
        >
          <button onClick={() => void plate.execute(() => validateLicensePlate(plate.input))}>
            Validar
          </button>
          <button onClick={() => void plate.execute(() => normalizeLicensePlate(plate.input))}>
            Normalizar
          </button>
          <button onClick={() => void plate.execute(() => formatLicensePlate(plate.input))}>
            Formatar
          </button>
          <button
            className="secondary"
            onClick={() => void plate.execute(() => parseLicensePlate(plate.input))}
          >
            Parsear
          </button>
          <button
            className="secondary"
            onClick={() =>
              void plate.execute(() => generateLicensePlate({ kind: 'old', formatted: true }), true)
            }
          >
            Gerar antiga
          </button>
          <button
            className="secondary"
            onClick={() =>
              void plate.execute(() => generateLicensePlate({ kind: 'mercosul' }), true)
            }
          >
            Gerar Mercosul
          </button>
        </ToolCard>
        <ToolCard
          index="08"
          tag="DINHEIRO"
          title="Valores em reais"
          description="Normalize, formate e faça parsing de valores BRL."
          accent="accent-gold"
          tool={brl}
          control={<TextInput tool={brl} id="brl-input" placeholder="R$ 1.234,56" />}
        >
          <button onClick={() => void brl.execute(() => normalizeBRL(brl.input))}>
            Normalizar
          </button>
          <button onClick={() => void brl.execute(() => formatBRL(normalizeBRL(brl.input)))}>
            Formatar
          </button>
          <button onClick={() => void brl.execute(() => parseBRL(brl.input))}>Parsear</button>
        </ToolCard>
        <ToolCard
          index="09"
          tag="ESTADOS"
          title="Estados e regiões"
          description="Catálogo de UFs, capitais, regiões e códigos IBGE."
          accent="accent-green"
          tool={states}
          control={
            <div className="input-line">
              <TextInput tool={states} id="state-input" placeholder="SP ou São Paulo" />
              <select
                value={stateRegion}
                onChange={(event) => setStateRegion(event.target.value)}
                aria-label="Região"
              >
                <option value="">Todas as regiões</option>
                {BRAZILIAN_REGIONS.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </div>
          }
        >
          <button onClick={() => void states.execute(() => getBrazilianState(states.input))}>
            Buscar UF
          </button>
          <button onClick={() => void states.execute(() => isBrazilianState(states.input))}>
            É UF?
          </button>
          <button
            onClick={() =>
              void states.execute(() => getBrazilianStatesByRegion(stateRegion || states.input))
            }
          >
            Listar região
          </button>
          <button className="secondary" onClick={() => void states.execute(() => BRAZILIAN_STATES)}>
            Catálogo
          </button>
        </ToolCard>
        <ToolCard
          index="10"
          tag="CEP / REDE"
          title="CEP"
          description="Valide, normalize, formate, consulte um CEP ou teste consultas em lote."
          accent="accent-lime"
          tool={cep}
          control={
            <>
              <div className="input-line">
                <TextInput
                  tool={cep}
                  id="cep-input"
                  placeholder="01001-000 ou vários separados por vírgula"
                />
                <select
                  value={cepProvider}
                  onChange={(event) =>
                    setCepProvider(event.target.value as 'auto' | 'brasilapi' | 'viacep')
                  }
                  aria-label="Provedor do CEP"
                >
                  <option value="auto">Auto · fallback</option>
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
                incluir resposta raw
              </label>
            </>
          }
          note="Para lote, separe os CEPs por vírgula ou quebra de linha."
        >
          <button onClick={() => void cep.execute(() => validateCEP(cep.input))}>Validar</button>
          <button onClick={() => void cep.execute(() => normalizeCEP(cep.input))}>
            Normalizar
          </button>
          <button onClick={() => void cep.execute(() => formatCEP(cep.input))}>Formatar</button>
          <button
            onClick={() =>
              void cep.execute(() =>
                lookupCEP(cep.input, { provider: cepProvider, includeRaw: cepRaw }),
              )
            }
          >
            Consultar
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
            Consultar lote
          </button>
        </ToolCard>
      </section>
      <footer>
        <span>brazilian-tools playground · React · 10 domínios</span>
        <span>TypeScript · Vite · ESM</span>
      </footer>
    </main>
  );
}

createRoot(document.querySelector('#app')!).render(<App />);
