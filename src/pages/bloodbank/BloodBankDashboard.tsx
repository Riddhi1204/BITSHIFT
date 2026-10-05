import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Droplet, 
  Layers, 
  HeartHandshake, 
  Inbox, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  Phone
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS, MOCK_BLOOD_REQUESTS, MOCK_EXPIRY_ITEMS, MOCK_DONATIONS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import { getBloodGroupStatus } from '../../components/bloodbank/BloodAvailabilityBadge';
import { UpdateInventoryModal } from '../../components/bloodbank/UpdateInventoryModal';
import { RecordDonationModal } from '../../components/bloodbank/RecordDonationModal';
import { FindMatchingBloodModal } from '../../components/bloodbank/FindMatchingBloodModal';

export const BloodBankDashboard = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();

  const bloodBank = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId);

  // Local state for live interactions
  const [stockState, setStockState] = useState<Record<string, number>>(
    bloodBank ? bloodBank.inventory : { 'O-': 9, 'O+': 61, 'A+': 42, 'A-': 12, 'B+': 38, 'B-': 7, 'AB+': 21, 'AB-': 4 }
  );

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);
  const [selectedMatchingGroup, setSelectedMatchingGroup] = useState('O-');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [expiryFilter, setExpiryFilter] = useState<'all' | '2days' | '7days' | '30days'>('all');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // INVALID BLOOD BANK ERROR STATE
  if (!bloodBank) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500 text-brand-bright flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Blood Bank Not Found</h2>
            <p className="text-sm text-slate-400">
              Invalid identifier <strong className="text-red-400 font-mono">"{bloodBankId}"</strong>.
            </p>
          </div>
          <Link
            to="/blood-banks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-all"
          >
            <span>Return to Registered Blood Banks</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateInventory = (data: { group: string; quantity: number; operation: 'add' | 'remove' | 'adjust'; reason: string }) => {
    setStockState((prev) => {
      const current = prev[data.group] || 0;
      let next = current;
      if (data.operation === 'add') next = current + data.quantity;
      if (data.operation === 'remove') next = Math.max(0, current - data.quantity);
      if (data.operation === 'adjust') next = data.quantity;
      return { ...prev, [data.group]: next };
    });

    triggerToast(`Inventory updated for ${data.group}: ${data.operation.toUpperCase()} ${data.quantity} Units (${data.reason})`);
  };

  const totalStockUnits = Object.values(stockState).reduce((acc, curr) => acc + curr, 0);
  const criticalGroups = Object.keys(stockState).filter((g) => stockState[g] <= 5);
  const emergencyRequests = MOCK_BLOOD_REQUESTS.filter((r) => r.urgency === 'emergency' && r.status === 'Pending');

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredExpiry = MOCK_EXPIRY_ITEMS.filter((item) => {
    if (expiryFilter === '2days') return item.daysRemaining <= 2;
    if (expiryFilter === '7days') return item.daysRemaining <= 7;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative pb-16">
      
      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* BLOOD BANK ADMIN NAVBAR & SUBNAV */}
      <BloodBankNav bloodBank={bloodBank} activeTab="dashboard" />

      {/* DASHBOARD BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. TOP 4 KEY TELEMETRY METRICS (Requirement 10) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* TOTAL BLOOD UNITS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">Total Blood Units</span>
              <Droplet className="w-4 h-4 text-brand-red" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {totalStockUnits} <span className="text-xs font-normal text-slate-400">Units</span>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <Activity className="w-3 h-3" /> 8 Component Racks Live
            </p>
          </div>

          {/* TODAY'S DONATIONS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">Today's Donations</span>
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              36 <span className="text-xs font-normal text-slate-400">Donors</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold">+18% vs Weekly Average</p>
          </div>

          {/* PENDING REQUESTS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider">Pending Requisitions</span>
              <Inbox className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">
              12 <span className="text-xs font-normal text-slate-400">Hospital Orders</span>
            </div>
            <p className="text-[11px] text-amber-300 font-semibold">{emergencyRequests.length} Immediate Trauma OT</p>
          </div>

          {/* CRITICAL STOCK */}
          <div className="bg-gradient-to-br from-red-950/60 to-[#111827] border border-red-500/40 rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-red-300">
              <span className="font-bold uppercase tracking-wider">Critical Stock Groups</span>
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-brand-bright font-mono">
              {criticalGroups.length} <span className="text-xs font-normal text-red-300">Deficits</span>
            </div>
            <p className="text-[11px] text-red-300 font-semibold">O− & AB− Below Safe Threshold</p>
          </div>

        </div>

        {/* 2. PROMINENT EMERGENCY REQUESTS SECTION (Requirement 14) */}
        {emergencyRequests.length > 0 && (
          <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-[#111827] border-2 border-red-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-red-600 text-white animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🚨 INCOMING EMERGENCY BLOOD REQUESTS</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold">
                      {emergencyRequests.length} PENDING
                    </span>
                  </h3>
                  <p className="text-xs text-red-300">Immediate trauma action required within clinical safety window</p>
                </div>
              </div>

              <Link
                to={`/blood-bank/${bloodBank.id}/requests`}
                className="text-xs font-bold text-red-300 hover:text-white flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-black/60 border border-red-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white">{req.hospitalName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                            {req.hospitalId}
                          </span>
                        </div>
                        <p className="text-xs text-red-200 mt-0.5 font-medium">{req.targetWard}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-red-600/30 text-red-300 border border-red-500/50 rounded-lg text-xs font-mono font-black">
                      {req.unitsRequired} Units Needed
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-white/5 p-2.5 rounded-xl">
                    <div>Patient: <strong className="text-white">{req.patientDetails}</strong></div>
                    <div className="flex items-center justify-between text-[11px] text-amber-300">
                      <span>Timeline: {req.requiredBy}</span>
                      <span>Requested: {req.requestedTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const available = stockState[req.bloodGroup] || 0;
                        if (available >= req.unitsRequired) {
                          handleUpdateInventory({
                            group: req.bloodGroup,
                            quantity: req.unitsRequired,
                            operation: 'remove',
                            reason: `Emergency fulfillment for ${req.hospitalName} (${req.id})`,
                          });
                          triggerToast(`Approved & Dispatched ${req.unitsRequired} Units of ${req.bloodGroup} to ${req.hospitalName}!`);
                        } else {
                          setSelectedMatchingGroup(req.bloodGroup);
                          setMatchingModalOpen(true);
                          triggerToast(`Insufficient stock (${available} available). Opening network match finder...`);
                        }
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Reserve Units</span>
                    </button>

                    <a
                      href={`tel:${req.contactPhone}`}
                      className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hospital</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LIVE BLOOD GROUP STOCK LEDGER (8 GROUPS) */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-red" />
                <span>Live Blood Inventory Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time component units in cold-chain storage at {bloodBank.name}.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setDonationModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Record Donation</span>
              </button>

              <button
                onClick={() => setInventoryModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Update Stock</span>
              </button>

              <Link
                to={`/blood-bank/${bloodBank.id}/inventory`}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all"
              >
                Full Ledger →
              </Link>
            </div>
          </div>

          {/* 8 BLOOD GROUPS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bloodGroups.map((grp) => {
              const units = stockState[grp] ?? 0;
              const meta = getBloodGroupStatus(units);

              return (
                <div
                  key={grp}
                  className={`p-4 rounded-2xl border transition-all ${meta.bg} ${meta.border} space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{grp}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        meta.status === 'Critical'
                          ? 'bg-red-600 text-white border-red-500'
                          : meta.status === 'Low'
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-emerald-600/40 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {meta.status}
                    </span>
                  </div>

                  <div className="text-3xl font-black text-white font-mono">
                    {units} <span className="text-xs font-normal text-slate-400">Units</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        handleUpdateInventory({
                          group: grp,
                          quantity: 1,
                          operation: 'remove',
                          reason: 'Ward Issue',
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 text-xs font-bold transition-all"
                    >
                      - Issue
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateInventory({
                          group: grp,
                          quantity: 1,
                          operation: 'add',
                          reason: 'Direct Donation Collection',
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-bold transition-all"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4. EXPIRY ALERTS & LOW STOCK INTELLIGENCE (Requirements 16 & 17) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* EXPIRY ALERTS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-black text-white">⚠️ Blood Expiry Tracking</h4>
              </div>

              {/* Expiry Filter Pills */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px] font-bold">
                {[
                  { id: 'all', label: 'All' },
                  { id: '2days', label: '2 Days' },
                  { id: '7days', label: '7 Days' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setExpiryFilter(f.id as any)}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      expiryFilter === f.id ? 'bg-brand-red text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredExpiry.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-950 border border-red-500/40 text-brand-bright font-black flex items-center justify-center">
                        {item.bloodGroup}
                      </span>
                      <span className="font-bold text-white font-mono">{item.units} Units</span>
                      <span className="text-[10px] font-mono text-slate-400">({item.batchId})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.storageUnit}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
                      {item.expiryDate}
                    </span>
                    <button
                      onClick={() => {
                        triggerToast(`Priority notification dispatched to nearby surgical wards for rotation of batch ${item.batchId}`);
                      }}
                      className="text-[10px] text-blue-400 hover:underline block font-semibold"
                    >
                      Prioritize Issue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTELLIGENT SHORTAGE WARNINGS & ACTIONS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-bright" />
                <h4 className="text-base font-black text-white">Intelligent Shortage Actions</h4>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-red-950 text-red-300 rounded border border-red-800">
                XGBoost Model v3.2
              </span>
            </div>

            <div className="space-y-3">
              {/* O- Critical */}
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-600/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300 uppercase">🔴 Critical Stock Deficit</span>
                  <span className="text-xs font-mono font-bold text-white">O− (9 Units Total, 4 Reserved)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recommended safe minimum is <strong>15 units</strong>. High surgical trauma risk in Ranchi corridor.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerToast('Automated emergency SMS/FCM broadcast sent to 28 eligible registered O− donors!');
                    }}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    Send Emergency Donor Broadcast
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMatchingGroup('O-');
                      setMatchingModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Match Other Banks
                  </button>
                </div>
              </div>

              {/* B- Low */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase">🟡 Low Stock Warning</span>
                  <span className="text-xs font-mono font-bold text-white">B− (7 Units)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Stock at 40% target reserve. Recommended action: schedule routine community drive.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 5. RECENT DONATIONS & QUICK ACCESS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">Recent Volunteer Blood Collections</h3>
              <p className="text-xs text-slate-400">Verified donor entries from camp drives and walk-ins.</p>
            </div>
            <Link
              to={`/blood-bank/${bloodBank.id}/donations`}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>View All Donations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {MOCK_DONATIONS.slice(0, 4).map((d) => (
              <div key={d.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-white">{d.donorName}</span>
                  <span className="px-2 py-0.5 rounded font-black text-xs bg-red-950 text-red-300 border border-red-600/50">
                    {d.bloodGroup}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Date: {d.donationDate}</div>
                  <div>Status: <span className="text-emerald-400 font-bold">{d.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* MODALS */}
      <UpdateInventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        onUpdate={handleUpdateInventory}
        currentStock={stockState}
      />

      <RecordDonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        onRecord={(donation) => {
          handleUpdateInventory({
            group: donation.bloodGroup,
            quantity: donation.units,
            operation: 'add',
            reason: `Donation by ${donation.donorName} (${donation.id})`,
          });
          triggerToast(`Recorded donation from ${donation.donorName} (${donation.bloodGroup})!`);
        }}
      />

      <FindMatchingBloodModal
        isOpen={matchingModalOpen}
        onClose={() => setMatchingModalOpen(false)}
        currentBloodBankId={bloodBank.id}
        initialGroup={selectedMatchingGroup}
      />

    </div>
  );
};
