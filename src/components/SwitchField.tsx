import { Field, Label, Switch } from '@headlessui/react';
import type { LucideIcon } from 'lucide-react';

type SwitchFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon: LucideIcon;
};

export function SwitchField({ checked, onChange, label, icon: Icon }: SwitchFieldProps) {
  return (
    <Field
      as="label"
      className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-brand-muted"
    >
      <Switch
        checked={checked}
        onChange={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-focus ${
          checked ? 'bg-brand-primary' : 'bg-brand-border'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none flex size-4 items-center justify-center rounded-full bg-brand-ink shadow-sm transition ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        >
          <Icon aria-hidden="true" className="size-2.5 text-brand-control" strokeWidth={2.5} />
        </span>
      </Switch>
      <Label className="font-mono text-[10px] uppercase tracking-wide">{label}</Label>
    </Field>
  );
}
