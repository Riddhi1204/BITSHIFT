interface BloodAvailabilityBadgeProps {
  group: string;
  units: number;
  compact?: boolean;
}

export const getBloodGroupStatus = (units: number): { status: 'Critical' | 'Low' | 'Available'; color: string; bg: string; border: string; dot: string } => {
  if (units <= 5) {
    return {
      status: 'Critical',
      color: 'text-red-400',
      bg: 'bg-red-950/60',
      border: 'border-red-600/50',
      dot: 'bg-red-500',
    };
  }
  if (units <= 15) {
    return {
      status: 'Low',
      color: 'text-amber-400',
      bg: 'bg-amber-950/60',
      border: 'border-amber-600/50',
      dot: 'bg-amber-500',
    };
  }
  return {
    status: 'Available',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-600/40',
    dot: 'bg-emerald-400',
  };
};

export const BloodAvailabilityBadge = ({ group, units, compact = false }: BloodAvailabilityBadgeProps) => {
  const meta = getBloodGroupStatus(units);

  if (compact) {
    return (
      <div className={`flex items-center justify-between px-2 py-1 rounded-lg border ${meta.bg} ${meta.border} text-xs`}>
        <span className="font-black text-white">{group}</span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          <span className={`font-bold ${meta.color}`}>{units}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${meta.bg} ${meta.border} flex flex-col justify-between transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-black text-white">{group}</span>
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${meta.bg} ${meta.color} border ${meta.border}`}>
          {meta.status}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-black text-white font-mono">{units}</span>
        <span className="text-[10px] text-slate-400">Units</span>
      </div>
    </div>
  );
};
