import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  History 
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import { getBloodGroupStatus } from '../../components/bloodbank/BloodAvailabilityBadge';
import { UpdateInventoryModal } from '../../components/bloodbank/UpdateInventoryModal';

export const BloodBankInventory = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const bloodBank = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId);

  const [stockState, setStockState] = useState<Record<string, number>>(
    bloodBank ? bloodBank.inventory : { 'O-': 9, 'O+': 61, 'A+': 42, 'A-': 12, 'B+': 38, 'B-': 7, 'AB+': 21, 'AB-': 4 }
  );

  const [reservedState] = useState<Record<string, number>>(
    bloodBank?.reservedStock || { 'O-': 4, 'A+': 5, 'B+': 2 }
  );

  const [expiredState] = useState<Record<string, number>>(
    bloodBank?.expiredStock || { 'A-': 1 }
  );

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'low'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [auditHistory, setAuditHistory] = useState([
    { id: 'TX-901', group: 'O-', qty: 4, type: 'Reserved', reason: 'OT-3 Trauma Surgery (Raj Hospital)', time: '15 mins ago' },
    { id: 'TX-902', group: 'A+', qty: 10, type: 'Added', reason: 'Camp Collection Batch #C4', time: '1 hour ago' },
    { id: 'TX-903', group: 'A-', qty: 1, type: 'Expired', reason: 'Biohazard Discard (Expiry Date Passed)', time: '2 hours ago' },
    { id: 'TX-904', group: 'B+', qty: 5, type: 'Issued', reason: 'Dispatched to Medanta Gurugram', time: '5 hours ago' },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  if (!bloodBank) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Blood Bank Not Found</h2>
          <Link to="/blood-banks" className="inline-block px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl">
            View Registered Blood Banks
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdate = (data: { group: string; quantity: number; operation: 'add' | 'remove' | 'adjust'; reason: string }) => {
    setStockState((prev) => {
      const current = prev[data.group] || 0;
      let next = current;
      if (data.operation === 'add') next = current + data.quantity;
      if (data.operation === 'remove') next = Math.max(0, current - data.quantity);
      if (data.operation === 'adjust') next = data.quantity;
      return { ...prev, [data.group]: next };
    });

    setAuditHistory((prev) => [
      {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        group: data.group,
        qty: data.quantity,
        type: data.operation === 'add' ? 'Added' : data.operation === 'remove' ? 'Issued' : 'Adjusted',
        reason: data.reason,
        time: 'Just now',
      },
      ...prev,
    ]);

    triggerToast(`Inventory updated for ${data.group}: ${data.operation.toUpperCase()} ${data.quantity} Units`);
  };

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredGroups = bloodGroups.filter((grp) => {
    const units = stockState[grp] ?? 0;
    if (filterMode === 'critical') return units <= 5;
    if (filterMode === 'low') return units > 5 && units <= 15;
    return true;
  });

  const totalStockUnits = Object.values(stockState).reduce((acc, curr) => acc + curr, 0);
  const totalReservedUnits = Object.values(reservedState).reduce((acc, curr) => acc + curr, 0);
  const totalExpiredUnits = Object.values(expiredState).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white pb-16">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BloodBankNav bloodBank={bloodBank} activeTab="inventory" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* TOP OVERVIEW BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-brand-red" />
              <span>Blood Inventory Ledger</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Full component reserve ledger, safety buffer thresholds, and live quarantine metrics for {bloodBank.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInventoryModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Update Stock / Audit</span>
            </button>
          </div>
        </div>

        {/* SUMMARY TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
            <span className="text-xs text-slate-400 font-bold uppercase">Available for Dispatch</span>
            <div className="text-3xl font-black text-white font-mono mt-1">{totalStockUnits} Units</div>
            <p className="text-[11px] text-emerald-400 mt-0.5">8 component groups active</p>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
            <span className="text-xs text-blue-400 font-bold uppercase">Reserved for Requisitions</span>
            <div className="text-3xl font-black text-blue-400 font-mono mt-1">{totalReservedUnits} Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Trauma OT & scheduled surgery buffers</p>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
            <span className="text-xs text-amber-400 font-bold uppercase">Quarantine / Expired</span>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1">{totalExpiredUnits} Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for incinerator bio-disposal</p>
          </div>
        </div>

        {/* INVENTORY TABLE & FILTERS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          {/* FILTER TABS */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1">Filter View:</span>
              {[
                { id: 'all', label: 'All 8 Groups' },
                { id: 'critical', label: '🔴 Critical Stock (< 5)' },
                { id: 'low', label: '🟡 Low Stock (6–15)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterMode(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterMode === tab.id
                      ? 'bg-brand-red text-white shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Cold Chain Temp: <strong className="text-emerald-400">3.8°C (Normal)</strong>
            </div>
          </div>

          {/* TABLE (Requirement 11) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/5">
                  <th className="py-3.5 px-4 rounded-l-xl">Blood Group</th>
                  <th className="py-3.5 px-4">Available</th>
                  <th className="py-3.5 px-4">Reserved</th>
                  <th className="py-3.5 px-4">Expired</th>
                  <th className="py-3.5 px-4">Critical Threshold</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredGroups.map((grp) => {
                  const available = stockState[grp] ?? 0;
                  const reserved = reservedState[grp] ?? 0;
                  const expired = expiredState[grp] ?? 0;
                  const meta = getBloodGroupStatus(available);

                  return (
                    <tr key={grp} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-black text-lg shadow-md">
                            {grp}
                          </div>
                          <div>
                            <span className="font-bold text-white text-base">{grp} Whole Blood</span>
                            <span className="text-[11px] text-slate-400 block font-mono">Rack ID: RK-{grp}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-black text-lg text-white">
                        {available} <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-blue-400">
                        {reserved} Units
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-slate-400">
                        {expired} Units
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-slate-300">
                        10 Units
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.border} ${meta.color}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                          <span>{meta.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              handleUpdate({
                                group: grp,
                                quantity: 1,
                                operation: 'add',
                                reason: 'Manual Adjustment',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                          >
                            + Add
                          </button>
                          <button
                            onClick={() => {
                              handleUpdate({
                                group: grp,
                                quantity: 1,
                                operation: 'remove',
                                reason: 'Manual Issue',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 text-xs font-bold"
                          >
                            - Issue
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* AUDIT LOG TRANSACTION HISTORY */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-black text-white">Recent Inventory Audit Trail</h3>
            </div>
            <span className="text-xs text-slate-400">Automated ledger timestamping</span>
          </div>

          <div className="space-y-2">
            {auditHistory.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 font-bold">{tx.id}</span>
                  <span className="px-2 py-0.5 rounded font-black text-xs bg-red-950 text-red-300 border border-red-700">
                    {tx.group}
                  </span>
                  <span className="text-slate-300">{tx.reason}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold font-mono ${
                      tx.type === 'Added' ? 'text-emerald-400' : tx.type === 'Reserved' ? 'text-blue-400' : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'Added' ? '+' : '-'}{tx.qty} Units
                  </span>
                  <span className="text-slate-500 text-[11px]">{tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <UpdateInventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        onUpdate={handleUpdate}
        currentStock={stockState}
      />

    </div>
  );
};
