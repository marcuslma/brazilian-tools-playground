export type ResultTone = 'neutral' | 'success' | 'error';
export type Action = () => unknown | Promise<unknown>;
export type Palette = 'green' | 'yellow' | 'blue';
export type Theme = 'light' | 'dark' | 'system';

export type ToolState = {
  input: string;
  setInput: (value: string) => void;
  output: unknown;
  tone: ResultTone;
  busy: boolean;
  execute: (action: Action, fillInput?: boolean) => Promise<void>;
};
