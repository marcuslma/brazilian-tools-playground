import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { Accent, ToolState } from '../types';

const accents: Record<Accent, string> = {
  yellow: 'border-t-brazil-yellow',
  pink: 'border-t-brazil-blue',
  cyan: 'border-t-brazil-blue',
  violet: 'border-t-brazil-blue',
  green: 'border-t-brazil-green',
  orange: 'border-t-brazil-yellow',
  blue: 'border-t-brazil-blue',
  red: 'border-t-brazil-green',
  gold: 'border-t-brazil-yellow',
  lime: 'border-t-brazil-green',
};

type ToolCardProps = {
  index: string;
  tag: string;
  title: string;
  description: string;
  accent: Accent;
  tool: ToolState;
  control: ReactNode;
  children: ReactNode;
  note?: ReactNode;
};

function displayValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

export function ToolCard({
  index,
  tag,
  title,
  description,
  accent,
  tool,
  control,
  children,
  note,
}: ToolCardProps) {
  const { t } = useTranslation();

  return (
    <article
      className={`min-h-[270px] rounded-lg border border-slate-200 border-t-2 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-brazil-blue dark:bg-brazil-blue/70 ${accents[accent]}`}
      aria-busy={tool.busy}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-brazil-green-dark dark:text-brazil-yellow">
          {index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
          {tag}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="mt-1.5 min-h-10 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      <fieldset disabled={tool.busy} className="m-0 min-w-0 border-0 p-0">
        {control}
      </fieldset>
      <fieldset disabled={tool.busy} className="m-0 min-w-0 border-0 p-0">
        <div className="mt-3 flex flex-wrap gap-1.5">{children}</div>
      </fieldset>
      {note && (
        <small className="mt-3 block font-mono text-[10px] text-zinc-500 dark:text-zinc-500">
          {note}
        </small>
      )}
      <div
        className={`mt-4 min-h-24 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-brazil-blue dark:bg-brazil-blue-dark ${tool.tone === 'error' ? 'ring-1 ring-red-400/60' : ''}`}
        aria-live="polite"
      >
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          <span>{t('common.output')}</span>
          <span
            className={
              tool.tone === 'error'
                ? 'text-red-600 dark:text-red-300'
                : tool.tone === 'success'
                  ? 'text-brazil-green-dark dark:text-brazil-yellow'
                  : ''
            }
          >
            {tool.busy
              ? t('common.lookingUp')
              : tool.tone === 'error'
                ? t('common.error')
                : tool.tone === 'success'
                  ? t('common.ok')
                  : t('common.waiting')}
          </span>
        </div>
        <pre className="mt-2 max-h-36 min-h-9 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-600 dark:text-zinc-300">
          {tool.busy
            ? t('common.waitingResponse')
            : tool.output === null
              ? t('common.waitingAction')
              : displayValue(tool.output)}
        </pre>
      </div>
    </article>
  );
}
