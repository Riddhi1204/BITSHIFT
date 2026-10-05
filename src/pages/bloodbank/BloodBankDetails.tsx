import { useParams, Link } from 'react-router-dom';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Activity, 
  AlertCircle,
  HeartHandshake
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';

export const BloodBankDetails = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();

  const bloodBank = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId);

  // 12. ERROR HANDLING (404 Not Found)
  if (!bloodBank) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 text-brand-bright flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Blood Bank Not Found</h2>
            <p className="text-sm text-slate-400">
              The blood bank identifier <strong className="text-red-400 font-mono">"{bloodBankId}"</strong> does not match any registered facility in the HemoVite network.
            </p>
            <p className="text-xs text-slate-500">
              Please select a registered blood bank from the HemoVite network.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/blood-banks"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blood Banks</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // 7. Dynamic blood availability status helper based on units
  const getBloodAvailabilityMeta = (units: number) => {
    if (units === 0) {
      return {
        status: 'Unavailable',
        label: '⚪ Unavailable',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
        dotClass: 'bg-slate-400',
      };
    }
    if (units <= 2) {
      return {
        status: 'Critical',
        label: '🔴 Critical',
        badgeClass: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
        dotClass: 'bg-red-600',
      };
    }
    if (units <= 10) {
      return {
        status: 'Low Stock',
        label: '🟠 Low Stock',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    }
    return {
      status: 'Available',
      label: '🟢 Available',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
    };
  };

  // 6. Dynamic Inventory Summary Metrics
  const totalUnits = Object.values(bloodBank.inventory).reduce((sum, u) => sum + (u || 0), 0);

  const lowStockGroupsCount = bloodGroups.filter((grp) => {
    const u = bloodBank.inventory[grp] ?? 0;
    return u > 2 && u <= 10;
  }).length;

  const criticalGroupsCount = bloodGroups.filter((grp) => {
    const u = bloodBank.inventory[grp] ?? 0;
    return u > 0 && u <= 2;
  }).length;

  const isOperational = bloodBank.status === 'operational';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* 4. TOP HEADER BAR */}
      <header className="bg-[#0B1220] text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/blood-banks"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blood Banks</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-sm">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <span className="text-base font-black text-white">
              Hemo<span className="text-brand-bright">Vite</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Blood Grid Verified</span>
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 4 & 10. PUBLIC HERO FACILITY BANNER */}
        <div className="bg-[#0B1220] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-xl shadow-brand-red/40 shrink-0">
                <Droplet className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {bloodBank.name}
                  </h1>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-red-950 border border-red-500/50 text-red-300">
                    Blood Bank ID: {bloodBank.id}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                  <span>{bloodBank.address}, {bloodBank.city}, {bloodBank.state}</span>
                </p>

                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border ${
                    isOperational 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isOperational ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{isOperational ? 'Operational 24/7' : 'Under Maintenance'}</span>
                  </span>

                  {bloodBank.ngoPartner && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                      <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                      <span>NGO / Non-Profit Partner</span>
                    </span>
                  )}

                  {bloodBank.verified && (
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Verified Blood Bank</span>
                    </span>
                  )}

                  <span className="text-slate-400 font-mono">
                    License: {bloodBank.licenseNo || 'NABH-BB-2026'}
                  </span>
                </div>

                {bloodBank.initiative && (
                  <div className="mt-2 text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 flex items-center gap-2">
                    <span className="font-bold text-rose-400 shrink-0">Initiative / Mission:</span>
                    <span>{bloodBank.initiative}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PUBLIC FACILITY QUICK HIGHLIGHT BOX */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shrink-0 lg:max-w-xs w-full backdrop-blur-md space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Public Transparency Ledger
              </span>
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>
                  Connected to HemoVite's national component grid for live inventory telemetry and emergency hospital dispatches.
                </p>
                <div className="pt-1 flex items-center justify-between font-mono font-bold text-white">
                  <span>Available Reserve:</span>
                  <span className="text-brand-bright text-sm">{totalUnits} Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT STRIP */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-mono font-bold text-white">{bloodBank.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="text-red-400 block text-[10px] uppercase font-bold">Emergency 24/7 Hotline</span>
                <span className="font-mono font-bold text-brand-bright">{bloodBank.emergencyContact}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Email</span>
                <span className="text-white truncate">{bloodBank.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Operating Hours</span>
                <span className="text-white font-semibold">{bloodBank.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. INVENTORY SUMMARY CARDS */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900">
            Inventory Summary Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Inventory */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Inventory
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalUnits} <span className="text-xs font-normal text-slate-400">Units</span>
              </div>
              <p className="text-[10px] text-slate-500">Live storage count</p>
            </div>

            {/* Low Stock Groups */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                Low Stock
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">
                {lowStockGroupsCount} <span className="text-xs font-normal text-slate-400">{lowStockGroupsCount === 1 ? 'Group' : 'Groups'}</span>
              </div>
              <p className="text-[10px] text-slate-500">3–10 units remaining</p>
            </div>

            {/* Critical Groups */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-brand-bright uppercase tracking-wider block">
                Critical
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-bright font-mono">
                {criticalGroupsCount} <span className="text-xs font-normal text-slate-400">{criticalGroupsCount === 1 ? 'Group' : 'Groups'}</span>
              </div>
              <p className="text-[10px] text-slate-500">≤ 2 units remaining</p>
            </div>

            {/* Last Updated */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                Last Updated
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-800 pt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{bloodBank.lastUpdated}</span>
              </div>
              <p className="text-[10px] text-slate-500">Telemetry sync</p>
            </div>

            {/* Operating Status */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Operating Status
              </span>
              <div className="text-base sm:text-lg font-black text-emerald-700 pt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{isOperational ? '🟢 Operational' : '🟡 Maintenance'}</span>
              </div>
              <p className="text-[10px] text-slate-500">Active component dispatch</p>
            </div>
          </div>
        </div>

        {/* 5 & 7. LIVE BLOOD INVENTORY SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Live Blood Inventory</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Complete Blood Group Inventory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time stock ledger of whole blood and PRBC units stored at {bloodBank.name}.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium">Total Available Reserve</span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {totalUnits} <span className="text-xs font-normal text-slate-500">Units</span>
              </div>
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Blood Group</th>
                  <th className="py-3 px-4">Available Units</th>
                  <th className="py-3 px-4">Availability Status</th>
                  <th className="py-3 px-4">Safe Minimum Reserve</th>
                  <th className="py-3 px-4 rounded-r-xl">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bloodGroups.map((grp) => {
                  const units = bloodBank.inventory[grp] ?? 0;
                  const meta = getBloodAvailabilityMeta(units);

                  return (
                    <tr key={grp} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-black text-base shadow-sm border border-red-100">
                            {grp}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block">{grp} Blood</span>
                            <span className="text-xs text-slate-400">Whole Blood / PRBC</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-black text-lg text-slate-900">
                        {units} <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeClass}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                          <span>{meta.label}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-slate-600">
                        10 Units (Standard)
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500">
                        {bloodBank.lastUpdated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* BOTTOM BACK ACTION */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <Link
            to="/blood-banks"
            className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Blood Banks & NGOs</span>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to Top ↑
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • Verified Public Healthcare Resource Ledger
      </footer>

    </div>
  );
};
