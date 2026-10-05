import { Building2, MapPin, Phone, ArrowRight } from 'lucide-react';
import type { Hospital } from '../../types';
import { HospitalStatusBadge } from './HospitalStatusBadge';

interface HospitalCardProps {
  hospital: Hospital;
  onSelect: (hospitalId: string) => void;
}

export const HospitalCard = ({ hospital, onSelect }: HospitalCardProps) => {
  return (
    <div
      onClick={() => onSelect(hospital.id)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card-soft hover:shadow-card-elevated hover:border-brand-red/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
    >
      {/* TOP RED ACCENT LINE ON HOVER */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-brand-red group-hover:to-brand-bright transition-all duration-300" />

      <div className="space-y-4">
        
        {/* HEADER: LOGO, NAME & BADGE */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-red shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-red transition-colors duration-200 leading-snug">
                {hospital.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  ID: {hospital.id}
                </span>
                <span className="text-[11px] text-slate-400">
                  • {hospital.beds} Beds
                </span>
              </div>
            </div>
          </div>

          <HospitalStatusBadge status={hospital.status} />
        </div>

        {/* DETAILS GRID */}
        <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{hospital.city}, {hospital.state}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Tel: {hospital.phone}</span>
          </div>

          <div className="text-[11px] text-slate-500 pt-0.5 line-clamp-1">
            Linked Hub: <strong className="text-slate-700">{hospital.bloodBankLinked}</strong>
          </div>
        </div>

      </div>

      {/* FOOTER ACTION */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 group-hover:text-brand-red transition-colors">
          View Hospital Details
        </span>

        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 group-hover:bg-brand-red group-hover:text-white flex items-center justify-center group-hover:translate-x-1.5 transition-all duration-300">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

    </div>
  );
};
