import { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { VERIFIED_FACILITIES } from '../../data/mockData';

interface BloodFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency: () => void;
}

export const BloodFinderModal = ({ isOpen, onClose, onOpenEmergency }: BloodFinderModalProps) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O-');
  const [reservedFacility, setReservedFacility] = useState<string | null>(null);

  const filteredFacilities = VERIFIED_FACILITIES.filter(fac => {
    const matchesQuery = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fac.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fac.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0B1220] border border-white/20 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-white relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Verified Blood Resource Finder</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Stock Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Search verified hospital EHR reserves and regional blood banks in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="p-6 border-b border-white/10 space-y-4 bg-black/30">
          
          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, area, or landmark (e.g. AIIMS, Safdarjung, New Delhi)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* BLOOD GROUP SELECTOR PILLS */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Required Blood Group:
            </span>
            <div className="flex flex-wrap gap-2">
              {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(group => (
                <button
                  key={group}
                  onClick={() => setSelectedBloodGroup(group)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedBloodGroup === group
                      ? 'bg-brand-red text-white ring-2 ring-brand-red/50 shadow-md scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RESULTS LIST */}
        <div className="p-6 space-y-4 flex-1">
          {reservedFacility && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Unit reserved at <strong>{reservedFacility}</strong>. Verification code #RES-{Math.floor(1000 + Math.random() * 9000)} sent to your device.</span>
              </div>
              <button 
                onClick={() => setReservedFacility(null)}
                className="text-white hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="space-y-3">
            {filteredFacilities.map((fac) => {
              const availableUnits = fac.stock[selectedBloodGroup] || 0;
              const isLow = availableUnits <= 3;
              const isCritical = availableUnits === 0;

              return (
                <div
                  key={fac.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-white">{fac.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {fac.type}
                      </span>
                      {fac.verified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> {fac.location}
                      </span>
                      <span>•</span>
                      <span className="text-blue-400 font-semibold">{fac.distance} away</span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{fac.phone}</span>
                    </div>
                  </div>

                  {/* STOCK STATUS & ACTIONS */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedBloodGroup} Stock</div>
                      <div className={`text-xl font-black ${
                        isCritical ? 'text-red-500' : isLow ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {availableUnits} <span className="text-xs font-normal text-slate-400">Units</span>
                      </div>
                    </div>

                    <div>
                      {availableUnits > 0 ? (
                        <button
                          onClick={() => setReservedFacility(fac.name)}
                          className="px-4 py-2 bg-brand-red hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow transition-all"
                        >
                          Reserve Unit
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenEmergency();
                          }}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-red-300 border border-red-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>Trigger Urgent Alert</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
