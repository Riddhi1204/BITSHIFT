import { useNavigate } from 'react-router-dom';
import { Droplet, MapPin, Phone, ShieldCheck, Clock, ArrowRight, Activity, Lock } from 'lucide-react';
import type { BloodBank } from '../../types';
import { BloodAvailabilityBadge } from './BloodAvailabilityBadge';

interface BloodBankCardProps {
  bloodBank: BloodBank;
}

export const BloodBankCard = ({ bloodBank }: BloodBankCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blood-bank/${bloodBank.id}`);
  };

  const handleAdminAuthClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/blood-bank/${bloodBank.id}/auth`);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const isOperational = bloodBank.status === 'operational';

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-card-soft hover:shadow-card-elevated hover:border-brand-red/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
    >
      {/* TOP RED HOVER ACCENT LINE */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-brand-red group-hover:to-brand-bright transition-all duration-300" />

      <div className="space-y-5">
        
        {/* HEADER: LOGO, TITLE, ID & STATUS BADGES */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-red shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors duration-300 shadow-sm">
              <Droplet className="w-6 h-6 fill-current" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-red transition-colors duration-200 leading-snug">
                {bloodBank.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-brand-red border border-red-200">
                  ID: {bloodBank.id}
                </span>
                {bloodBank.ngoPartner && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                    <span>🤝 NGO / Non-Profit</span>
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  • {bloodBank.operatingHours}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Operational badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isOperational
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOperational ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isOperational ? 'Operational' : 'Maintenance'}</span>
            </span>

            {/* Verified badge */}
            {bloodBank.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Verified Blood Bank</span>
              </span>
            )}
          </div>
        </div>

        {/* INITIATIVE / MISSION HIGHLIGHT IF PRESENT */}
        {bloodBank.initiative && (
          <div className="text-[11px] font-medium text-slate-700 bg-rose-50/70 border border-rose-100/90 rounded-2xl px-3 py-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span className="font-bold text-rose-800 shrink-0">Focus:</span>
            <span className="truncate text-slate-700">{bloodBank.initiative}</span>
          </div>
        )}

        {/* LOCATION & CONTACT INFO */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span className="font-semibold text-slate-800">
              {bloodBank.city}, {bloodBank.state}
            </span>
            <span className="text-slate-400 text-[11px]">({bloodBank.address})</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span className="font-mono">{bloodBank.phone}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated: {bloodBank.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* COMPACT BLOOD AVAILABILITY SUMMARY (8 GROUPS) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-red" />
              <span>Live Blood Inventory</span>
            </span>
            <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              Total: {bloodBank.totalUnits} Units
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {bloodGroups.map((grp) => (
              <BloodAvailabilityBadge
                key={grp}
                group={grp}
                units={bloodBank.inventory[grp] ?? 0}
                compact
              />
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER ACTION BUTTONS */}
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
        
        <button
          onClick={handleCardClick}
          className="text-xs font-bold text-slate-600 hover:text-brand-red transition-colors flex items-center gap-1"
        >
          <span>View Full Inventory</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleAdminAuthClick}
          className="px-4 py-2 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-glow-red flex items-center gap-1.5 transition-all group/btn"
        >
          <Lock className="w-3 h-3" />
          <span>Administrator Login</span>
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

      </div>

    </div>
  );
};
