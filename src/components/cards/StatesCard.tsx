import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BRAZILIAN_REGIONS,
  BRAZILIAN_STATES,
  getBrazilianState,
  getBrazilianStatesByRegion,
  isBrazilianState,
} from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { SelectField, type SelectOption } from '../SelectField';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function StatesCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.states', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };
  const [region, setRegion] = useState('');
  const options: readonly SelectOption<string>[] = [
    { value: '', label: t('options.allRegions') },
    ...BRAZILIAN_REGIONS.map((value) => ({ value, label: value })),
  ];

  return (
    <ToolCard
      index="09"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2">
          <TextInput tool={tool} id="state-input" placeholder={card.placeholder} />
          <SelectField
            value={region}
            onChange={setRegion}
            options={options}
            ariaLabel={t('fields.region')}
          />
        </div>
      }
    >
      <ActionButton onClick={() => void tool.execute(() => getBrazilianState(tool.input))}>
        {t('options.findState')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => isBrazilianState(tool.input))}>
        {t('options.isState')}
      </ActionButton>
      <ActionButton
        onClick={() => void tool.execute(() => getBrazilianStatesByRegion(region || tool.input))}
      >
        {t('options.listRegion')}
      </ActionButton>
      <ActionButton secondary onClick={() => void tool.execute(() => BRAZILIAN_STATES)}>
        {t('options.catalog')}
      </ActionButton>
    </ToolCard>
  );
}
