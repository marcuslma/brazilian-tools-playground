import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SelectFieldProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  ariaLabel: string;
  className?: string;
};

export function SelectField<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
}: SelectFieldProps<T>) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative w-max min-w-0 ${className}`}>
        <ListboxButton
          aria-label={ariaLabel}
          className="flex min-h-10 min-w-max w-full items-center justify-between gap-2 rounded-md border border-brand-border bg-brand-control px-3 text-left text-xs text-brand-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-focus"
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            {selected?.icon && (
              <span aria-hidden="true" className="text-base leading-none">
                {selected.icon}
              </span>
            )}
            <span>{selected?.label}</span>
          </span>
          <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-brand-muted" />
        </ListboxButton>
        <ListboxOptions className="absolute left-0 top-[calc(100%+0.35rem)] z-30 max-h-60 w-max min-w-full overflow-auto rounded-md border border-brand-border bg-brand-card p-1 shadow-xl outline-none">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus, selected: isSelected }) =>
                `cursor-pointer rounded px-3 py-2 text-xs outline-none ${
                  focus ? 'bg-brand-accent-soft text-brand-ink' : 'text-brand-ink'
                } ${isSelected ? 'font-semibold' : ''}`
              }
            >
              <span className="flex items-center gap-2">
                {option.icon && (
                  <span aria-hidden="true" className="text-base leading-none">
                    {option.icon}
                  </span>
                )}
                <span>{option.label}</span>
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
