import { useTranslation } from 'react-i18next';
import {
  formatCNH,
  formatPIS,
  generateCNH,
  generatePIS,
  normalizeCNH,
  normalizePIS,
  validateCNH,
  validatePIS,
} from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function PisCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.pis', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };

  return (
    <ToolCard
      index="05"
      accent="orange"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={<TextInput tool={tool} id="pis-input" placeholder={card.placeholder} />}
    >
      <ActionButton onClick={() => void tool.execute(() => validatePIS(tool.input))}>
        {t('common.validate')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => normalizePIS(tool.input))}>
        {t('common.normalize')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => formatPIS(tool.input))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton
        secondary
        onClick={() => void tool.execute(() => generatePIS({ formatted: true }), true)}
      >
        {t('common.generate')}
      </ActionButton>
    </ToolCard>
  );
}

export function CnhCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.cnh', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };

  return (
    <ToolCard
      index="06"
      accent="blue"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={<TextInput tool={tool} id="cnh-input" placeholder={card.placeholder} />}
    >
      <ActionButton onClick={() => void tool.execute(() => validateCNH(tool.input))}>
        {t('common.validate')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => normalizeCNH(tool.input))}>
        {t('common.normalize')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => formatCNH(tool.input))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton
        secondary
        onClick={() => void tool.execute(() => generateCNH({ formatted: true }), true)}
      >
        {t('common.generate')}
      </ActionButton>
    </ToolCard>
  );
}
