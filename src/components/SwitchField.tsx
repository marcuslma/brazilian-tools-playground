import { Field, Label, Switch } from '@headlessui/react';

type SwitchFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function SwitchField({ checked, onChange, label }: SwitchFieldProps) {
  return (
    <Field
      as="label"
      className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
    >
      <Switch
        checked={checked}
        onChange={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-brazil-yellow ${
          checked ? 'bg-brazil-green' : 'bg-slate-300 dark:bg-brazil-blue'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none block size-4 rounded-full bg-white shadow-sm transition ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </Switch>
      <Label className="font-mono text-[10px] uppercase tracking-wide">{label}</Label>
    </Field>
  );
}
