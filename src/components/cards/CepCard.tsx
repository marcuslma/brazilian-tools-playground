import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCEP, lookupCEP, lookupCEPs, normalizeCEP, validateCEP } from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { SelectField, type SelectOption } from '../SelectField';
import { SwitchField } from '../SwitchField';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

type Provider = 'auto' | 'brasilapi' | 'viacep';

export function CepCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.cep', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };
  const [provider, setProvider] = useState<Provider>('auto');
  const [includeRaw, setIncludeRaw] = useState(false);
  const providerOptions: readonly SelectOption<Provider>[] = [
    { value: 'auto', label: t('options.autoFallback') },
    { value: 'brasilapi', label: 'BrasilAPI' },
    { value: 'viacep', label: 'ViaCEP' },
  ];

  return (
    <ToolCard
      index="10"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      note={t('notes.batch')}
      control={
        <>
          <div className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2">
            <TextInput tool={tool} id="cep-input" placeholder={card.placeholder} />
            <SelectField
              value={provider}
              onChange={setProvider}
              options={providerOptions}
              ariaLabel={t('fields.cepProvider')}
            />
          </div>
          <SwitchField checked={includeRaw} onChange={setIncludeRaw} label={t('fields.raw')} />
        </>
      }
    >
      <ActionButton onClick={() => void tool.execute(() => validateCEP(tool.input))}>
        {t('common.validate')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => normalizeCEP(tool.input))}>
        {t('common.normalize')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => formatCEP(tool.input))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton
        onClick={() => void tool.execute(() => lookupCEP(tool.input, { provider, includeRaw }))}
      >
        {t('options.lookup')}
      </ActionButton>
      <ActionButton
        secondary
        onClick={() =>
          void tool.execute(() =>
            lookupCEPs(
              tool.input
                .split(/[\n,;]+/)
                .map((value) => value.trim())
                .filter(Boolean),
              { provider, includeRaw },
            ),
          )
        }
      >
        {t('options.lookupBatch')}
      </ActionButton>
    </ToolCard>
  );
}
