import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import {
  formatCNPJ,
  formatCPF,
  formatRG,
  generateCNPJ,
  generateCPF,
  generateRG,
  normalizeCNPJ,
  normalizeCPF,
  normalizeRG,
  SUPPORTED_RG_STATES,
  validateCNPJ,
  validateCPF,
  validateRG,
} from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { SelectField, type SelectOption } from '../SelectField';
import { SwitchField } from '../SwitchField';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function CpfCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.cpf', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };

  return (
    <ToolCard
      index="01"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={<TextInput tool={tool} id="cpf-input" placeholder={card.placeholder} />}
    >
      <ActionButton
        icon="validate"
        onClick={() => void tool.execute(() => validateCPF(tool.input))}
      >
        {t('common.validate')}
      </ActionButton>
      <ActionButton
        icon="normalize"
        onClick={() => void tool.execute(() => normalizeCPF(tool.input))}
      >
        {t('common.normalize')}
      </ActionButton>
      <ActionButton icon="format" onClick={() => void tool.execute(() => formatCPF(tool.input))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton
        icon="generate"
        secondary
        onClick={() => void tool.execute(() => generateCPF({ formatted: true }), true)}
      >
        {t('common.generate')}
      </ActionButton>
    </ToolCard>
  );
}

export function CnpjCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.cnpj', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };
  const [kind, setKind] = useState<'numeric' | 'alphanumeric'>('numeric');
  const options: readonly SelectOption<'numeric' | 'alphanumeric'>[] = [
    { value: 'numeric', label: t('options.numeric') },
    { value: 'alphanumeric', label: t('options.alpha') },
  ];

  return (
    <ToolCard
      index="02"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2">
          <TextInput tool={tool} id="cnpj-input" placeholder={card.placeholder} />
          <SelectField
            value={kind}
            onChange={setKind}
            options={options}
            ariaLabel={t('fields.cnpjType')}
          />
        </div>
      }
    >
      <ActionButton
        icon="validate"
        onClick={() => void tool.execute(() => validateCNPJ(tool.input))}
      >
        {t('common.validate')}
      </ActionButton>
      <ActionButton
        icon="normalize"
        onClick={() => void tool.execute(() => normalizeCNPJ(tool.input))}
      >
        {t('common.normalize')}
      </ActionButton>
      <ActionButton icon="format" onClick={() => void tool.execute(() => formatCNPJ(tool.input))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton
        icon="generate"
        secondary
        onClick={() => void tool.execute(() => generateCNPJ({ kind, formatted: true }), true)}
      >
        {t('common.generate')}
      </ActionButton>
    </ToolCard>
  );
}

export function RgCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.rg', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };
  const [state, setState] = useState('');
  const [includeState, setIncludeState] = useState(false);
  const options: readonly SelectOption<string>[] = [
    { value: '', label: t('options.structural') },
    { value: 'SP', label: `SP / ${t('options.algorithm')}` },
    { value: 'RJ', label: `RJ / ${t('options.unsupported')}` },
  ];

  return (
    <ToolCard
      index="03"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2">
          <TextInput tool={tool} id="rg-input" placeholder={card.placeholder} />
          <SelectField
            value={state}
            onChange={setState}
            options={options}
            ariaLabel={t('fields.rgState')}
          />
        </div>
      }
    >
      <ActionButton
        icon="validate"
        onClick={() => void tool.execute(() => validateRG(tool.input, state ? { state } : {}))}
      >
        {t('common.validate')}
      </ActionButton>
      <ActionButton
        icon="normalize"
        onClick={() => void tool.execute(() => normalizeRG(tool.input, { state: 'SP' }))}
      >
        {t('common.normalize')}
      </ActionButton>
      <ActionButton
        icon="format"
        onClick={() => void tool.execute(() => formatRG(tool.input, { state: 'SP' }))}
      >
        {t('common.format')}
      </ActionButton>
      <ActionButton
        icon="generate"
        secondary
        onClick={() =>
          void tool.execute(() => {
            if (includeState) return generateRG({ formatted: true, includeState: true });
            return generateRG({ formatted: true });
          }, true)
        }
      >
        {t('common.generate')}
      </ActionButton>
      <ActionButton
        icon="list"
        secondary
        onClick={() => void tool.execute(() => SUPPORTED_RG_STATES)}
      >
        {t('options.supportedStates')}
      </ActionButton>
      <SwitchField
        checked={includeState}
        onChange={setIncludeState}
        label={t('fields.includeState')}
        icon={MapPin}
      />
    </ToolCard>
  );
}
