import type { InputHTMLAttributes } from 'react';
import type { ToolState } from '../types';

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  tool: ToolState;
};

export function TextInput({ tool, className = '', ...props }: TextInputProps) {
  return (
    <input
      {...props}
      value={tool.input}
      onChange={(event) => tool.setInput(event.target.value)}
      autoComplete="off"
      className={`min-h-10 w-full rounded-md border border-brand-border bg-brand-control px-3 text-sm text-brand-ink outline-none placeholder:text-brand-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-focus ${className}`}
    />
  );
}
