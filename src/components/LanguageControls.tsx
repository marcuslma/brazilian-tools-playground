import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { SelectField, type SelectOption } from './SelectField';

type Theme = 'dark' | 'light';

type LanguageControlsProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

const languages: readonly SelectOption<'pt-BR' | 'en' | 'es'>[] = [
  { value: 'pt-BR', label: 'Português', icon: '🇧🇷' },
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
];

export function LanguageControls({ theme, onToggleTheme }: LanguageControlsProps) {
  const { t } = useTranslation();
  const language =
    i18n.resolvedLanguage === 'pt-BR' ||
    i18n.resolvedLanguage === 'en' ||
    i18n.resolvedLanguage === 'es'
      ? i18n.resolvedLanguage
      : 'pt-BR';

  return (
    <div className="flex flex-wrap items-end justify-end gap-2">
      <label className="grid gap-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <span>{t('hero.language')}</span>
        <SelectField
          value={language}
          onChange={(value) => void i18n.changeLanguage(value)}
          options={languages}
          ariaLabel={t('hero.language')}
          className="w-32"
        />
      </label>
      <button
        type="button"
        onClick={onToggleTheme}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-brazil-yellow bg-white px-3 text-xs font-semibold text-brazil-blue transition hover:bg-brazil-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-green dark:border-brazil-yellow dark:bg-brazil-blue dark:text-brazil-yellow dark:hover:bg-brazil-blue-dark"
      >
        {theme === 'dark' ? (
          <>
            <span className="text-lg leading-none" aria-hidden="true">
              ☀️
            </span>
            {t('hero.light')}
          </>
        ) : (
          <>
            <span className="text-lg leading-none" aria-hidden="true">
              🌙
            </span>
            {t('hero.dark')}
          </>
        )}
      </button>
    </div>
  );
}
