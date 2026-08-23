export type ResultTone = 'neutral' | 'success' | 'error';
export type Action = () => unknown | Promise<unknown>;
export type Accent =
  'yellow' | 'pink' | 'cyan' | 'violet' | 'green' | 'orange' | 'blue' | 'red' | 'gold' | 'lime';

export type ToolState = {
  input: string;
  setInput: (value: string) => void;
  output: unknown;
  tone: ResultTone;
  busy: boolean;
  execute: (action: Action, fillInput?: boolean) => Promise<void>;
};
