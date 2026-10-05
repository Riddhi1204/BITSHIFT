import { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { group: string; quantity: number; operation: 'add' | 'remove' | 'adjust'; reason: string }) => void;
  currentStock: Record<string, number>;
}

export const UpdateInventoryModal = ({
  isOpen,
  onClose,
  onUpdate,
  currentStock,
}: UpdateInventoryModalProps) => {
  const [group, setGroup] = useState('O-');
  const [quantity, setQuantity] = useState('5');
  const [operation, setOperation] = useState<'add' | 'remove' | 'adjust'>('add');
  const [reason, setReason] = useState('Donation Camp Batch');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    if (operation === 'remove' && (currentStock[group] || 0) < qty) {
      setError(`Cannot remove ${qty} units. Current available stock of ${group} is only ${currentStock[group] || 0} units.`);
      return;
    }

    setError(null);
    onUpdate({
      group,
      quantity: qty,
      operation,
      reason: notes ? `${reason} (${notes})` : reason,
    });
    onClose();
  };

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative space-y-5">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Update Blood Inventory</h3>
            <p className="text-xs text-slate-400">Log adjustments, incoming donations, and ward dispatches</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* BLOOD GROUP & CURRENT STOCK PREVIEW */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Blood Group *</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white font-bold"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} Blood
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Current In Stock</label>
              <div className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm font-mono font-bold text-brand-bright">
                {currentStock[group] ?? 0} Units
              </div>
            </div>
          </div>

          {/* OPERATION TYPE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Operation Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'add', label: '+ Add Stock', desc: 'New donation / transfer' },
                { id: 'remove', label: '- Remove Stock', desc: 'Hospital issue / expiry' },
                { id: 'adjust', label: '⇄ Exact Adjust', desc: 'Audit correction' },
              ].map((op) => (
                <button
                  type="button"
                  key={op.id}
                  onClick={() => setOperation(op.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    operation === op.id
                      ? 'bg-brand-red text-white border-red-500 shadow-md ring-1 ring-brand-red/50'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{op.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{op.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {operation === 'adjust' ? 'Set Total Exact Available Units *' : 'Number of Units *'}
            </label>
            <input
              type="number"
              min="1"
              max="500"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white font-mono font-bold focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* REASON */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Transaction Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
            >
              <option value="Donation Camp Batch">Volunteer Blood Donation Camp</option>
              <option value="Hospital Emergency Request Fulfillment">Hospital Emergency Request Fulfillment</option>
              <option value="Inter-Facility Transfer Received">Inter-Facility Transfer Received</option>
              <option value="Expired Units Discarded">Expired Units Discarded (Biohazard disposal)</option>
              <option value="Damaged / Clotted Units">Damaged / Clotted / Hemolyzed Batch</option>
              <option value="Physical Audit Adjustment">Physical Audit & Calibration Adjustment</option>
            </select>
          </div>

          {/* NOTES / REMARKS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Batch / Requisition ID / Remarks (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Batch #BAT-2026-1005 or OT-3 Trauma Request"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white text-xs font-bold shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Inventory Update</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
