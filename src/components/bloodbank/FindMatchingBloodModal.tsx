import { useState, useEffect } from 'react';
import { X, Phone, MapPin, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';
import { bloodBankApi } from '../../services/bloodBankApi';
import type { BloodBank } from '../../types';

interface FindMatchingBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBloodBankId?: string;
  initialGroup?: string;
}

export const FindMatchingBloodModal = ({
  isOpen,
  onClose,
  currentBloodBankId,
  initialGroup = 'O-',
}: FindMatchingBloodModalProps) => {
  const [allBanks, setAllBanks] = useState<BloodBank[]>(REGISTERED_BLOOD_BANKS);
  const [targetGroup, setTargetGroup] = useState(initialGroup);
  const [unitsNeeded, setUnitsNeeded] = useState('8');
  const [urgency, setUrgency] = useState('Emergency (< 30 Mins)');
  const [requestedSuccess, setRequestedSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAll = async () => {
      try {
        const list = await bloodBankApi.getAll();
        if (list && list.length > 0) {
          setAllBanks(list);
        }
      } catch {}
    };
    fetchAll();
  }, [isOpen]);

  if (!isOpen) return null;

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Filter and rank matching blood banks with availability
  const matchingBanks = allBanks
    .filter((b) => b.id !== currentBloodBankId && b.registrationNumber !== currentBloodBankId)
    .map((b) => {
      const availableUnits = b.inventory ? (b.inventory[targetGroup] ?? 0) : 0;
      return {
        ...b,
        availableForGroup: availableUnits,
        sufficient: availableUnits >= parseInt(unitsNeeded || '1', 10),
      };
    })
    .sort((a, b) => b.availableForGroup - a.availableForGroup);

  const handleRequestTransfer = (bankName: string) => {
    setRequestedSuccess(`Inter-facility transfer request for ${unitsNeeded} Units of ${targetGroup} dispatched to ${bankName}!`);
    setTimeout(() => {
      setRequestedSuccess(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6 text-brand-bright" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Find Matching Blood in Network</h3>
            <p className="text-xs text-slate-400">Search real-time stock across connected HemoVite blood banks</p>
          </div>
        </div>

        {requestedSuccess && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs sm:text-sm text-emerald-200 font-bold flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{requestedSuccess}</span>
          </div>
        )}

        {/* CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-black/40 rounded-2xl border border-white/10">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Blood Group</label>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs font-bold text-white"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg} Blood</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Units Required</label>
            <input
              type="number"
              min="1"
              max="50"
              value={unitsNeeded}
              onChange={(e) => setUnitsNeeded(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs font-bold text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
            >
              <option value="Emergency (< 30 Mins)">Emergency (&lt; 30 Mins)</option>
              <option value="Urgent (2-4 Hours)">Urgent (2-4 Hours)</option>
              <option value="Standard Scheduled">Standard Scheduled</option>
            </select>
          </div>

        </div>

        {/* MATCHING RESULTS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Nearby Blood Banks with {targetGroup} Stock ({matchingBanks.length})</span>
            <span className="text-emerald-400 font-normal">Real-Time Telemetry</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {matchingBanks.map((bank, index) => (
              <div
                key={bank.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-red/40 hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">#{index + 1}</span>
                    <h4 className="text-sm font-black text-white">{bank.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300">
                      {bank.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-red" />
                      {bank.city}, {bank.state} ({bank.distance || 'Nearby'})
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      {bank.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Available</div>
                    <div className={`text-base font-black font-mono ${bank.availableForGroup > 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {bank.availableForGroup} Units
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequestTransfer(bank.name)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Transfer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Cold-chain logistics coordination assisted by HemoVite GPS.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
