import { useTranslation } from 'react-i18next';
import { Monitor, Moon, Sun } from 'lucide-react';
import i18n from '../i18n';
import type { Palette, Theme } from '../types';
import { SelectField, type SelectOption } from './SelectField';

type LanguageControlsProps = {
  theme: Theme;
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
  onThemeChange: (theme: Theme) => void;
};

const languages: readonly SelectOption<'pt-BR' | 'en' | 'es'>[] = [
  { value: 'pt-BR', label: 'Português', icon: '🇧🇷' },
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
];

export function LanguageControls({
  theme,
  palette,
  onPaletteChange,
  onThemeChange,
}: LanguageControlsProps) {
  const { t } = useTranslation();
  const language =
    i18n.resolvedLanguage === 'pt-BR' ||
    i18n.resolvedLanguage === 'en' ||
    i18n.resolvedLanguage === 'es'
      ? i18n.resolvedLanguage
      : 'pt-BR';
  const palettes: readonly SelectOption<Palette>[] = [
    { value: 'green', label: t('hero.palettes.green'), icon: '🟢' },
    { value: 'yellow', label: t('hero.palettes.yellow'), icon: '🟡' },
    { value: 'blue', label: t('hero.palettes.blue'), icon: '🔵' },
  ];
  const themes: readonly SelectOption<Theme>[] = [
    {
      value: 'light',
      label: t('hero.light'),
      icon: <Sun aria-hidden="true" className="size-3.5" />,
    },
    {
      value: 'dark',
      label: t('hero.dark'),
      icon: <Moon aria-hidden="true" className="size-3.5" />,
    },
    {
      value: 'system',
      label: t('hero.system'),
      icon: <Monitor aria-hidden="true" className="size-3.5" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-end justify-end gap-2">
      <label className="grid gap-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted">
        <span>{t('hero.palette')}</span>
        <SelectField
          value={palette}
          onChange={onPaletteChange}
          options={palettes}
          ariaLabel={t('hero.palette')}
        />
      </label>
      <label className="grid gap-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted">
        <span>{t('hero.language')}</span>
        <SelectField
          value={language}
          onChange={(value) => void i18n.changeLanguage(value)}
          options={languages}
          ariaLabel={t('hero.language')}
        />
      </label>
      <label className="grid gap-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted">
        <span>{t('hero.theme')}</span>
        <SelectField
          value={theme}
          onChange={onThemeChange}
          options={themes}
          ariaLabel={t('hero.theme')}
        />
      </label>
    </div>
  );
}
