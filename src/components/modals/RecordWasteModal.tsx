import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';
import { inventoryApi, type ExpiryBatchItem } from '../../services/inventoryApi';

interface RecordWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch?: ExpiryBatchItem | null;
  bloodBankId?: string;
  hospitalId?: string;
  onSuccess: () => void;
}

const WASTE_REASONS = [
  'Expired',
  'Damaged Bag',
  'Contamination',
  'Temperature Excursion',
  'Quality Issue',
  'Leakage',
  'Processing Error',
  'Other',
];

const COMPONENTS = [
  'Whole Blood',
  'Packed Red Blood Cells',
  'Platelets',
  'Fresh Frozen Plasma',
  'Cryoprecipitate',
];

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const RecordWasteModal = ({
  isOpen,
  onClose,
  batch,
  bloodBankId,
  hospitalId,
  onSuccess,
}: RecordWasteModalProps) => {
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [component, setComponent] = useState('Whole Blood');
  const [units, setUnits] = useState(1);
  const [reason, setReason] = useState('Expired');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (batch) {
      setBloodGroup(batch.bloodGroup || 'O+');
      setComponent(batch.component || 'Whole Blood');
      setUnits(batch.units || 1);
      if (batch.calculatedStatus === 'EXPIRED') {
        setReason('Expired');
      }
    } else {
      setUnits(1);
      setReason('Expired');
    }
    setError(null);
    setNotes('');
  }, [batch, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (units <= 0) {
      setError('Please enter at least 1 unit to record waste.');
      return;
    }

    if (batch && units > batch.units) {
      setError(`Cannot discard more units than available in this batch (${batch.units} Units).`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await inventoryApi.recordWaste({
        batchId: batch?.id,
        bloodBankId: bloodBankId || batch?.organizationId,
        hospitalId: hospitalId,
        bloodGroup,
        component,
        units: Number(units),
        reason,
        notes: notes.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record blood waste');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-red-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-white space-y-5 relative overflow-hidden">
        
        {/* Subtle Top Red Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-brand-bright shadow-inner">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Record Blood Unit Discard / Waste</h3>
              <p className="text-xs text-slate-400">
                {batch ? `Batch ${batch.batchNumber}` : 'Record discarded or contaminated units into audit ledger'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Blood Group</label>
              {batch ? (
                <div className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono font-bold text-sm text-brand-bright">
                  {batch.bloodGroup}
                </div>
              ) : (
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500"
                >
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Component */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Component Type</label>
              {batch ? (
                <div className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-xs text-slate-300 truncate">
                  {batch.component}
                </div>
              ) : (
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-red-500"
                >
                  {COMPONENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3">
            
            {/* Quantity / Units */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Units Discarded <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={batch ? batch.units : 500}
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
                required
              />
              {batch && (
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Batch Total: {batch.units} Units
                </span>
              )}
            </div>

            {/* Waste Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Waste Reason <span className="text-red-400">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500"
                required
              >
                {WASTE_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Notes / Clinical QA Log */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Disposal Notes / QA Remarks <span className="text-slate-500 text-[10px]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Discarded following refrigeration cold-chain temperature excursion above 8°C logged during routine audit..."
              className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
            />
          </div>

          {/* AUDIT NOTICE */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-[11px] text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              This discard will be timestamped in the national regulatory audit trail. Inventory ledger counts will automatically be deducted.
            </span>
          </div>

          {/* BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging Waste...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Discard & Log</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RecordWasteModal;
