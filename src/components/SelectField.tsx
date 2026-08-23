import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
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
      <div className={`relative min-w-0 ${className}`}>
        <ListboxButton
          aria-label={ariaLabel}
          className="flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-xs text-brazil-blue outline-none transition focus:border-brazil-green focus:ring-2 focus:ring-brazil-yellow/60 dark:border-brazil-blue dark:bg-brazil-blue dark:text-white dark:focus:border-brazil-yellow dark:focus:ring-brazil-green/60"
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {selected?.icon && (
              <span aria-hidden="true" className="text-base leading-none">
                {selected.icon}
              </span>
            )}
            <span className="truncate">{selected?.label}</span>
          </span>
          <span aria-hidden="true" className="text-zinc-400">
            ⌄
          </span>
        </ListboxButton>
        <ListboxOptions className="absolute left-0 top-[calc(100%+0.35rem)] z-30 max-h-60 min-w-full overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-xl outline-none dark:border-zinc-700 dark:bg-zinc-900">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus, selected: isSelected }) =>
                `cursor-pointer rounded px-3 py-2 text-xs outline-none ${
                  focus
                    ? 'bg-brazil-yellow/50 text-brazil-blue dark:bg-brazil-blue-dark dark:text-brazil-yellow'
                    : 'text-zinc-700 dark:text-white'
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
