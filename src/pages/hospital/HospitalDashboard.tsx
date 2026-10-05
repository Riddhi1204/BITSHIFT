import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Droplet, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Send, 
  LogOut,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';

export const HospitalDashboard = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();

  const hospital = REGISTERED_HOSPITALS.find((h) => h.id === hospitalId);

  // Local state for interactive features
  const [stockState, setStockState] = useState<Record<string, number>>(
    hospital ? hospital.stock : { 'O-': 4, 'O+': 22, 'A+': 18, 'A-': 3, 'B+': 28, 'B-': 5, 'AB+': 12, 'AB-': 2 }
  );

  const [reqGroup, setReqGroup] = useState('O-');
  const [reqUnits, setReqUnits] = useState('3');
  const [reqUrgency, setReqUrgency] = useState('immediate');
  const [reqWard, setReqWard] = useState('OT-3 (Trauma Emergency)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'inventory' | 'requisitions' | 'transfers' | 'radar'>('inventory');

  // Simulated transfer actions
  const [transfers, setTransfers] = useState([
    {
      id: 'TRF-8821',
      from: hospital?.bloodBankLinked || 'Ranchi Central Blood Bank',
      group: 'O-',
      units: 4,
      status: 'In Transit (Cold Chain Carrier)',
      eta: '14 Mins',
      critical: true,
    },
    {
      id: 'TRF-8819',
      from: 'Apex Regional Transfusion Unit',
      group: 'A+',
      units: 6,
      status: 'Dispatched',
      eta: '32 Mins',
      critical: false,
    },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // INVALID HOSPITAL ID ERROR STATE
  if (!hospital) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500 text-brand-bright flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Hospital Not Found</h2>
            <p className="text-sm text-slate-400">
              Invalid hospital ID <strong className="text-red-400 font-mono">"{hospitalId}"</strong>.
            </p>
          </div>
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Registered Hospitals</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleBroadcastRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Emergency requisition of ${reqUnits} Units of ${reqGroup} for ${reqWard} broadcasted to ${hospital.bloodBankLinked}!`);
    // Optimistic inventory update simulation
    setStockState((prev) => ({
      ...prev,
      [reqGroup]: Math.max(0, (prev[reqGroup] || 0) + Number(reqUnits)),
    }));
  };

  const totalStockUnits = Object.values(stockState).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative">
      
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP DASHBOARD NAVIGATION */}
      <header className="bg-[#111827] border-b border-white/10 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* HOSPITAL BRAND & ID */}
          <div className="flex items-center gap-4">
            <Link
              to="/hospitals"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Switch Hospital"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hospitals</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white leading-none">
                    {hospital.name}
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-600/50 text-red-300">
                    {hospital.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hospital Administrator Dashboard • {hospital.city}, {hospital.state}
                </p>
              </div>
            </div>
          </div>

          {/* TELEMETRY & LOGOUT ACTIONS */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>EHR Telemetry Live (HL7)</span>
            </div>

            <button
              onClick={() => {
                triggerToast('Session closed. Returning to hospital directory...');
                setTimeout(() => navigate('/hospitals'), 600);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* DASHBOARD BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* TOP STATUS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Reserve */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Blood Units</span>
              <Droplet className="w-4 h-4 text-brand-red" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalStockUnits} <span className="text-xs font-normal text-slate-400">Units</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">8 Wards & ICU Synchronized</p>
          </div>

          {/* 2. Critical Warning */}
          <div className="bg-gradient-to-br from-red-950/60 to-[#111827] border border-red-500/30 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-red-300">
              <span>Active AI Shortage Alert</span>
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brand-bright">
              O− Critical (4 Days)
            </div>
            <p className="text-[11px] text-red-200">Requisition dispatched to central bank</p>
          </div>

          {/* 3. Linked Blood Bank */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Linked Supply Hub</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-bold text-white truncate">
              {hospital.bloodBankLinked}
            </div>
            <p className="text-[11px] text-slate-400">Direct 24/7 Buffer Line Active</p>
          </div>

          {/* 4. ICU & Bed Capacity */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Facility Capacity</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {hospital.beds} <span className="text-xs font-normal text-slate-400">Beds</span>
            </div>
            <p className="text-[11px] text-purple-300 truncate">{hospital.icuCapacity}</p>
          </div>

        </div>

        {/* SECTION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          {[
            { id: 'inventory', label: 'Ward Inventory Ledger' },
            { id: 'requisitions', label: 'Emergency Requisition Broadcast' },
            { id: 'transfers', label: 'Inter-Facility Transfers (2 Active)' },
            { id: 'radar', label: 'AI Shortage Radar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. WARD INVENTORY LEDGER */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Live Ward Blood Inventory Matrix</h3>
                  <p className="text-xs text-slate-400">
                    Real-time stock across {hospital.name} blood storage units and trauma reserve fridges.
                  </p>
                </div>

                <button
                  onClick={() => triggerToast('Inventory data re-synchronized with hospital EHR system.')}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sync EHR Feed</span>
                </button>
              </div>

              {/* 8 BLOOD GROUPS CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.keys(stockState).map((groupKey) => {
                  const units = stockState[groupKey];
                  const isCritical = units <= 4;
                  const isModerate = units > 4 && units <= 15;

                  return (
                    <div
                      key={groupKey}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCritical
                          ? 'bg-red-950/40 border-red-600/50'
                          : isModerate
                          ? 'bg-amber-950/30 border-amber-600/40'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-white">{groupKey}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            isCritical
                              ? 'bg-red-600 text-white'
                              : isModerate
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Optimal'}
                        </span>
                      </div>

                      <div className="text-3xl font-black text-white mt-3 font-mono">
                        {units} <span className="text-xs font-normal text-slate-400">Units</span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            setStockState((prev) => ({
                              ...prev,
                              [groupKey]: Math.max(0, prev[groupKey] - 1),
                            }));
                            triggerToast(`Issued 1 Unit of ${groupKey} to ward.`);
                          }}
                          className="text-slate-400 hover:text-red-400 font-bold px-2 py-1 bg-white/5 rounded"
                        >
                          - Issue
                        </button>
                        <button
                          onClick={() => {
                            setStockState((prev) => ({
                              ...prev,
                              [groupKey]: prev[groupKey] + 1,
                            }));
                            triggerToast(`Added 1 Unit of ${groupKey} to stock.`);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 bg-white/5 rounded"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* 2. EMERGENCY REQUISITION BROADCAST */}
        {activeTab === 'requisitions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-brand-red" />
                  <span>Create Direct Emergency Requisition / Inter-Facility Broadcast</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Requisitions are automatically routed to {hospital.bloodBankLinked} and nearby verified blood banks.
                </p>
              </div>

              <form onSubmit={handleBroadcastRequisition} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Blood Group */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Blood Group *</label>
                    <select
                      value={reqGroup}
                      onChange={(e) => setReqGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white font-bold"
                    >
                      {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((g) => (
                        <option key={g} value={g}>{g} Blood</option>
                      ))}
                    </select>
                  </div>

                  {/* Units */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Units Required (Units) *</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={reqUnits}
                      onChange={(e) => setReqUnits(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                    />
                  </div>

                  {/* Urgency */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Urgency Level *</label>
                    <select
                      value={reqUrgency}
                      onChange={(e) => setReqUrgency(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                    >
                      <option value="immediate">Immediate (&lt; 1 Hour / OT Emergency)</option>
                      <option value="2hours">Within 2–4 Hours</option>
                      <option value="today">Scheduled Surgery</option>
                    </select>
                  </div>

                  {/* Target Ward */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Target Ward / OT *</label>
                    <input
                      type="text"
                      required
                      value={reqWard}
                      onChange={(e) => setReqWard(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Requisition to {hospital.bloodBankLinked}</span>
                </button>

              </form>

            </div>
          </div>
        )}

        {/* 3. INTER-FACILITY TRANSFERS */}
        {activeTab === 'transfers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Active Inter-Facility Buffer Transfers</h3>
                  <p className="text-xs text-slate-400">
                    Real-time cold-chain tracking for incoming hospital blood supply dispatches.
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  GPS Transit Live
                </span>
              </div>

              <div className="space-y-3">
                {transfers.map((trf) => (
                  <div
                    key={trf.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">{trf.id}</span>
                        <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-xs rounded">
                          {trf.group} • {trf.units} Units
                        </span>
                        {trf.critical && (
                          <span className="text-[10px] bg-red-950 text-red-400 border border-red-700 px-2 py-0.5 rounded font-bold">
                            Emergency Buffer
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300">
                        Dispatch Source: <strong className="text-white">{trf.from}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Status: <span className="text-emerald-400 font-semibold">{trf.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">Estimated Arrival</div>
                        <div className="text-base font-black text-amber-400">{trf.eta}</div>
                      </div>

                      <button
                        onClick={() => {
                          triggerToast(`Transfer ${trf.id} received and checked into ${hospital.name} cold-storage.`);
                          setTransfers((prev) => prev.filter((t) => t.id !== trf.id));
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                      >
                        Confirm Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* 4. AI SHORTAGE RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-bright" />
                  <span>AI Shortage Radar for {hospital.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Predictive ML model (XGBoost v3.2) calculating next 7-day shortage probability for this facility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950/40 border border-red-600/40 rounded-2xl p-4 space-y-2">
                  <div className="text-xs text-red-300 font-bold uppercase">High Risk Deficit</div>
                  <div className="text-2xl font-black text-brand-bright">O− Blood (82% Risk)</div>
                  <p className="text-xs text-slate-300">
                    Depletion estimated in <strong className="text-white">4 Days</strong> under current surgical demand velocity.
                  </p>
                </div>

                <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-4 space-y-2">
                  <div className="text-xs text-amber-300 font-bold uppercase">Moderate Monitoring</div>
                  <div className="text-2xl font-black text-amber-400">A− Blood (68% Risk)</div>
                  <p className="text-xs text-slate-300">
                    Expected supply boundary breach in <strong className="text-white">6 Days</strong>.
                  </p>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 space-y-2">
                  <div className="text-xs text-emerald-300 font-bold uppercase">Stable Reserve</div>
                  <div className="text-2xl font-black text-emerald-400">B+ Blood (19% Risk)</div>
                  <p className="text-xs text-slate-300">
                    Surplus available (95 Units) for secondary hospital network sharing.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#111827] border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Logged in as Administrator • {hospital.name} ({hospital.id}) • HemoVite Hospital Command Grid
      </footer>

    </div>
  );
};
