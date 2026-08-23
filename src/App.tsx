import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { LanguageControls } from './components/LanguageControls';
import { BrlCard } from './components/cards/BrlCard';
import { CepCard } from './components/cards/CepCard';
import { CnhCard, PisCard } from './components/cards/WorkCards';
import { CnpjCard, CpfCard, RgCard } from './components/cards/DocumentCards';
import { PhoneCard } from './components/cards/PhoneCard';
import { PlateCard } from './components/cards/PlateCard';
import { StatesCard } from './components/cards/StatesCard';

type Theme = 'dark' | 'light';

function initialTheme(): Theme {
  const stored = window.localStorage.getItem('brazilian-tools-theme');
  return stored === 'light' ? 'light' : 'dark';
}

export default function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('brazilian-tools-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'pt-BR';
  }, [i18n.resolvedLanguage]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-zinc-900 transition-colors dark:bg-brazil-blue-dark dark:text-white">
      <main className="mx-auto w-[min(1180px,calc(100%-2rem))] py-7 sm:py-10">
        <header className="border-b border-brazil-blue/20 pb-8 dark:border-brazil-yellow/20">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            <span>
              <span className="mr-2 inline-block size-2 rounded-full bg-brazil-green shadow-[0_0_14px_#009c3b]" />
              brazilian-tools / playground
            </span>
            <LanguageControls
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </div>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_260px]">
            <div>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-[-0.075em] sm:text-7xl">
                {t('hero.allFeatures')}
                <br />
                <em className="not-italic text-brazil-green-dark dark:text-brazil-green">
                  {t('hero.noGuesswork')}
                </em>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
                {t('hero.description')}
              </p>
            </div>
            <div className="border border-brazil-yellow/70 bg-white p-4 dark:border-brazil-green dark:bg-brazil-blue">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {t('hero.status')}
              </span>
              <strong className="mt-2 block text-xs tracking-widest text-brazil-green-dark dark:text-brazil-yellow">
                {t('hero.package')}
              </strong>
              <code className="mt-2 block font-mono text-[11px] text-zinc-500">
                github:marcuslma/brazilian-tools#main
              </code>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <CpfCard />
          <CnpjCard />
          <RgCard />
          <PhoneCard />
          <PisCard />
          <CnhCard />
          <PlateCard />
          <BrlCard />
          <StatesCard />
          <CepCard />
        </section>

        <footer className="mt-7 flex flex-col gap-3 border-t border-brazil-blue/20 pt-5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 sm:flex-row sm:justify-between dark:border-brazil-yellow/20">
          <span>{t('footer.library')}</span>
          <span>{t('footer.stack')}</span>
        </footer>
      </main>
    </div>
  );
}
