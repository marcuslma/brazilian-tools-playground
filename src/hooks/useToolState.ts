import { useRef, useState } from 'react';
import type { Action, ResultTone, ToolState } from '../types';

export function useToolState(initialInput = ''): ToolState {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState<unknown>(null);
  const [tone, setTone] = useState<ResultTone>('neutral');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  async function execute(action: Action, fillInput = false): Promise<void> {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const value = await action();
      setOutput(value);
      setTone(typeof value === 'boolean' ? (value ? 'success' : 'error') : 'success');
      if (fillInput) {
        const generated =
          typeof value === 'object' && value !== null && 'value' in value ? value.value : value;
        if (typeof generated === 'string' || typeof generated === 'number') {
          setInput(String(generated));
        }
      }
    } catch (error) {
      setOutput(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      setTone('error');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return { input, setInput, output, tone, busy, execute };
}
