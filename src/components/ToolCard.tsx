import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { ToolState } from '../types';

type ToolCardProps = {
  index: string;
  tag: string;
  title: string;
  description: string;
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
  tool,
  control,
  children,
  note,
}: ToolCardProps) {
  const { t } = useTranslation();

  return (
    <article
      className="min-h-[270px] rounded-lg border border-brand-border border-t-2 border-t-brand-primary bg-brand-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      aria-busy={tool.busy}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-brand-primary">{index}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-brand-muted">
          {tag}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-brand-ink">{title}</h2>
      <p className="mt-1.5 min-h-10 text-sm leading-6 text-brand-muted">{description}</p>
      <fieldset disabled={tool.busy} className="m-0 min-w-0 border-0 p-0">
        {control}
      </fieldset>
      <fieldset disabled={tool.busy} className="m-0 min-w-0 border-0 p-0">
        <div className="mt-3 flex flex-wrap gap-1.5">{children}</div>
      </fieldset>
      {note && <small className="mt-3 block font-mono text-[10px] text-brand-muted">{note}</small>}
      <div
        className={`mt-4 min-h-24 rounded-md border border-brand-border bg-brand-output p-3 ${tool.tone === 'error' ? 'ring-1 ring-red-400/60' : ''}`}
        aria-live="polite"
      >
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          <span>{t('common.output')}</span>
          <span
            className={
              tool.tone === 'error'
                ? 'text-red-600 dark:text-red-300'
                : tool.tone === 'success'
                  ? 'text-brand-primary'
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
        <pre className="mt-2 max-h-36 min-h-9 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-brand-secondary">
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
