import { Radar } from 'lucide-react';

interface ProductVisualProps {
  brand: string;
  name: string;
  category: string;
  compact?: boolean;
}

export function ProductVisual({
  brand,
  name,
  category,
  compact = false,
}: ProductVisualProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-700 opacity-20" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-cyan-400/20" />
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-blue-400/20" />
      <div className={`absolute inset-0 flex flex-col justify-between ${compact ? 'p-4' : 'p-8'}`}>
        <div className="flex items-center gap-2 text-cyan-300">
          <Radar className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
          <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-[0.2em]`}>
            RadarScout Pick
          </span>
        </div>
        <div>
          <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold uppercase tracking-wider text-cyan-300`}>
            {brand}
          </p>
          <p className={`${compact ? 'mt-1 text-lg' : 'mt-2 text-3xl'} max-w-md font-black leading-tight text-white`}>
            {name}
          </p>
          <p className={`${compact ? 'mt-2 text-[10px]' : 'mt-3 text-xs'} font-semibold uppercase tracking-[0.18em] text-slate-400`}>
            {category}
          </p>
        </div>
      </div>
    </div>
  );
}
