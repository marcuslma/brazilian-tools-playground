import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
  children: ReactNode;
};

export function ActionButton({
  secondary = false,
  className = '',
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={`min-h-8 rounded-md border px-3 text-[11px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus disabled:cursor-wait disabled:opacity-60 ${
        secondary
          ? 'border-brand-secondary/40 bg-transparent text-brand-secondary hover:bg-brand-primary-soft hover:text-brand-secondary-hover'
          : 'border-brand-primary bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover'
      } ${className}`}
    >
      {children}
    </button>
  );
}
