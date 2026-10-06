import { ShieldCheck, Activity, Clock } from 'lucide-react';

interface HospitalStatusBadgeProps {
  status?: 'verified' | 'active' | 'pending' | string;
}

export const HospitalStatusBadge = ({ status }: HospitalStatusBadgeProps) => {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verified Node</span>
      </span>
    );
  }

  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
        <Activity className="w-3.5 h-3.5 text-blue-600" />
        <span>Active Grid</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      <span>Pending Verification</span>
    </span>
  );
};
