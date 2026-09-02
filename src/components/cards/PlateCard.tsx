import { useTranslation } from 'react-i18next';
import {
  formatLicensePlate,
  generateLicensePlate,
  normalizeLicensePlate,
  parseLicensePlate,
  validateLicensePlate,
} from 'brazilian-tools';
import { useToolState } from '../../hooks/useToolState';
import { ActionButton } from '../ActionButton';
import { TextInput } from '../TextInput';
import { ToolCard } from '../ToolCard';

export function PlateCard() {
  const { t } = useTranslation();
  const tool = useToolState();
  const card = t('cards.plate', { returnObjects: true }) as {
    tag: string;
    title: string;
    description: string;
    placeholder: string;
  };

  return (
    <ToolCard
      index="07"
      tag={card.tag}
      title={card.title}
      description={card.description}
      tool={tool}
      control={<TextInput tool={tool} id="plate-input" placeholder={card.placeholder} />}
    >
      <ActionButton
        icon="validate"
        onClick={() => void tool.execute(() => validateLicensePlate(tool.input))}
      >
        {t('common.validate')}
      </ActionButton>
      <ActionButton
        icon="normalize"
        onClick={() => void tool.execute(() => normalizeLicensePlate(tool.input))}
      >
        {t('common.normalize')}
      </ActionButton>
      <ActionButton
        icon="format"
        onClick={() => void tool.execute(() => formatLicensePlate(tool.input))}
      >
        {t('common.format')}
      </ActionButton>
      <ActionButton
        icon="parse"
        secondary
        onClick={() => void tool.execute(() => parseLicensePlate(tool.input))}
      >
        {t('common.parse')}
      </ActionButton>
      <ActionButton
        icon="generateVehicle"
        secondary
        onClick={() =>
          void tool.execute(() => generateLicensePlate({ kind: 'old', formatted: true }), true)
        }
      >
        {t('options.generateOld')}
      </ActionButton>
      <ActionButton
        icon="generateVehicle"
        secondary
        onClick={() => void tool.execute(() => generateLicensePlate({ kind: 'mercosul' }), true)}
      >
        {t('options.generateMercosur')}
      </ActionButton>
    </ToolCard>
  );
}
