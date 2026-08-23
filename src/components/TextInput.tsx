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
      className={`min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-brazil-blue outline-none placeholder:text-zinc-400 focus:border-brazil-green focus:ring-2 focus:ring-brazil-yellow/60 dark:border-brazil-blue dark:bg-brazil-blue-dark dark:text-white dark:placeholder:text-blue-200/60 dark:focus:border-brazil-yellow dark:focus:ring-brazil-green/60 ${className}`}
    />
  );
}
