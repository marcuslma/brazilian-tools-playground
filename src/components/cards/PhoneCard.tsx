import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatPhoneBR,
  generatePhoneBR,
  normalizePhoneBR,
  parsePhoneBR,
  SUPPORTED_PHONE_DDDS,
  validatePhoneBR,
} from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { SwitchField } from '../SwitchField';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function PhoneCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.phone', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };
  const [international, setInternational] = useState(false);

  return (
    <ToolCard
      index="04"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={
        <>
          <TextInput tool={tool} id="phone-input" placeholder={card.placeholder} />
          <SwitchField
            checked={international}
            onChange={setInternational}
            label={t('fields.international')}
          />
        </>
      }
    >
      <ActionButton onClick={() => void tool.execute(() => validatePhoneBR(tool.input))}>
        {t('common.validate')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => normalizePhoneBR(tool.input))}>
        {t('common.normalize')}
      </ActionButton>
      <ActionButton
        onClick={() => void tool.execute(() => formatPhoneBR(tool.input, { international }))}
      >
        {t('common.format')}
      </ActionButton>
      <ActionButton secondary onClick={() => void tool.execute(() => parsePhoneBR(tool.input))}>
        {t('common.parse')}
      </ActionButton>
      <ActionButton secondary onClick={() => void tool.execute(() => SUPPORTED_PHONE_DDDS)}>
        {t('options.supportedDDDs')}
      </ActionButton>
      <ActionButton
        secondary
        onClick={() =>
          void tool.execute(
            () => generatePhoneBR({ type: 'mobile', formatted: true, international }),
            true,
          )
        }
      >
        {t('options.generateMobile')}
      </ActionButton>
    </ToolCard>
  );
}
