import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  BadgeCheck,
  BookOpen,
  CarFront,
  CircleHelp,
  Dices,
  FileSearch,
  List,
  Map,
  MapPin,
  ScanLine,
  Search,
  Smartphone,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';

const actionIcons = {
  validate: BadgeCheck,
  normalize: ScanLine,
  format: WandSparkles,
  generate: Dices,
  parse: FileSearch,
  list: List,
  generateMobile: Smartphone,
  generateVehicle: CarFront,
  find: MapPin,
  question: CircleHelp,
  map: Map,
  catalog: BookOpen,
  lookup: Search,
  lookupBatch: List,
} as const satisfies Record<string, LucideIcon>;

export type ActionIcon = keyof typeof actionIcons;

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
  children: ReactNode;
  icon: ActionIcon;
};

export function ActionButton({
  secondary = false,
  className = '',
  children,
  icon,
  ...props
}: ActionButtonProps) {
  const Icon = actionIcons[icon];

  return (
    <button
      {...props}
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border px-3 text-[11px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus disabled:cursor-wait disabled:opacity-60 ${
        secondary
          ? 'border-brand-secondary/40 bg-transparent text-brand-secondary hover:bg-brand-primary-soft hover:text-brand-secondary-hover'
          : 'border-brand-primary bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover'
      } ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.25} />
      {children}
    </button>
  );
}
