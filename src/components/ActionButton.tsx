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
      className={`min-h-8 rounded-md border px-3 text-[11px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-yellow disabled:cursor-wait disabled:opacity-60 ${
        secondary
          ? 'border-brazil-blue/25 bg-transparent text-brazil-blue-dark hover:bg-brazil-yellow/20 dark:border-brazil-yellow/30 dark:text-white dark:hover:bg-brazil-blue'
          : 'border-brazil-green bg-brazil-green text-white hover:bg-brazil-green-dark'
      } ${className}`}
    >
      {children}
    </button>
  );
}
