import { useTranslation } from 'react-i18next';
import { formatBRL, parseBRL } from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function BrlCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.brl', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };

  return (
    <ToolCard
      index="08"
      accent="gold"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={<TextInput tool={tool} id="brl-input" placeholder={card.placeholder} />}
    >
      <ActionButton onClick={() => void tool.execute(() => formatBRL(parseBRL(tool.input)))}>
        {t('common.format')}
      </ActionButton>
      <ActionButton onClick={() => void tool.execute(() => parseBRL(tool.input))}>
        {t('common.parse')}
      </ActionButton>
    </ToolCard>
  );
}
