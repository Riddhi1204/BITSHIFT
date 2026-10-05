import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Clock,
  ShieldCheck,
  AlertOctagon,
  Droplet,
  Flame,
  TrendingUp,
  CheckCircle2,
  Eye,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import {
  MOCK_GOV_STATS,
  MOCK_GOV_ALERTS,
  MOCK_BLOOD_HOTSPOTS,
  MOCK_HOSPITAL_APPLICATIONS,
  MOCK_DONATION_RECORDS,
  MOCK_REGIONAL_SUPPLY
} from '../../data/mockData';
import type { HospitalApplication } from '../../types';

export const GovernmentDashboard = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<HospitalApplication[]>(MOCK_HOSPITAL_APPLICATIONS);
  const [stats, setStats] = useState(MOCK_GOV_STATS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleQuickVerify = (id: string, name: string) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              status: 'Verified' as const,
              auditLog: [
                ...h.auditLog,
                {
                  action: 'Quick Verified via Overview Command',
                  by: 'Dr. Rajeshwar Sharma (DGHS)',
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  note: 'Expedited verification under national blood network mandate.',
                },
              ],
            }
          : h
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingVerification: Math.max(0, prev.pendingVerification - 1),
      verifiedHospitals: prev.verifiedHospitals + 1,
    }));
    triggerToast(`Hospital ${name} (${id}) has been successfully verified!`);
  };

  const activeAlert = MOCK_GOV_ALERTS[0]; // Primary critical alert

  return (
    <GovernmentLayout activeNav="dashboard">
      <div className="space-y-6">
        
        {/* TOAST ALERT */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. CRITICAL ALERTS BANNER AT TOP                         */}
        {/* ======================================================== */}
        {activeAlert && (
          <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-red-900/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-white text-red-700 text-[10px] font-black uppercase tracking-wider">
                    Emergency Alert
                  </span>
                  <span className="text-xs font-mono font-bold text-red-100">{activeAlert.region}</span>
                  <span className="text-[11px] text-red-200">• {activeAlert.time}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {activeAlert.title}
                </h2>
                <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
                  {activeAlert.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
              <Link
                to="/government/hotspots"
                className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>View Hotspot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/government/hospitals"
                className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-950 text-white border border-white/20 font-bold text-xs transition-all"
              >
                <span>View Hospitals</span>
              </Link>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. TOP DASHBOARD KPI STATISTICS CARDS (6 CARDS)           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          
          {/* 1. Registered Hospitals */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Hospitals</span>
              <Building2 className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.registeredHospitals}
            </div>
            <p className="text-[10px] text-slate-400">Total clinical network</p>
          </div>

          {/* 2. Pending Verification */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-1 bg-amber-50/30">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">
              {stats.pendingVerification}
            </div>
            <p className="text-[10px] text-amber-600 font-medium">Awaiting audit review</p>
          </div>

          {/* 3. Verified Hospitals */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm space-y-1 bg-emerald-50/30">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Verified</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {stats.verifiedHospitals}
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Active clinical nodes</p>
          </div>

          {/* 4. Active Blood Shortages */}
          <div className="bg-white rounded-2xl border border-red-200 p-4 shadow-sm space-y-1 bg-red-50/30">
            <div className="flex items-center justify-between text-red-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Shortages</span>
              <AlertOctagon className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
              {stats.criticalShortages}
            </div>
            <p className="text-[10px] text-red-600 font-medium">Regional deficit zones</p>
          </div>

          {/* 5. Blood Units Donated */}
          <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm space-y-1 bg-blue-50/30">
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Units Donated</span>
              <Droplet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
              {stats.bloodUnitsDonated.toLocaleString()}
            </div>
            <p className="text-[10px] text-blue-600 font-medium">State network total</p>
          </div>

          {/* 6. Critical Emergency Requests */}
          <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm space-y-1 bg-rose-50/30">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Emergencies</span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
              {stats.emergencyRequests}
            </div>
            <p className="text-[10px] text-rose-600 font-medium">Active trauma dispatches</p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. MIDDLE SECTION: HOTSPOTS (LEFT) + SUPPLY OVERVIEW (RIGHT) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT (7 COLS): URGENT BLOOD REQUIREMENT HOTSPOTS */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Urgent Blood Requirement Hotspots
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time high-deficit cities requiring buffer intervention
                  </p>
                </div>
              </div>

              <Link
                to="/government/hotspots"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
              >
                <span>All Hotspots ({MOCK_BLOOD_HOTSPOTS.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* HOTSPOTS MINI GRID */}
            <div className="space-y-3">
              {MOCK_BLOOD_HOTSPOTS.slice(0, 4).map((hotspot) => {
                const isCrit = hotspot.severity === 'Critical';
                return (
                  <div
                    key={hotspot.id}
                    onClick={() => navigate('/government/hotspots')}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-red-300 hover:bg-slate-50/80 transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{hotspot.city}</span>
                        <span className="text-xs text-slate-400 font-medium">({hotspot.state})</span>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                            : 'bg-amber-100 text-amber-700 border border-amber-300'
                        }`}
                      >
                        {isCrit ? '🔴 Critical Shortage' : '🟠 High Demand'}
                      </span>
                    </div>

                    {/* BLOOD DEFICIT CHIPS */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(hotspot.bloodGroupShortages).map(([grp, data]) => (
                        <span
                          key={grp}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="font-mono text-red-600">{grp}</span>
                          <span className="text-slate-400 text-[10px]">need</span>
                          <span className="font-mono text-slate-900 font-black">{data.required}u</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{hotspot.hospitalsAffected} Hospitals Affected • {hotspot.patientsAffected} Patients</span>
                      <span className="text-red-600 font-bold">Urgency: {hotspot.urgencyWindow}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT (5 COLS): REGIONAL BLOOD SUPPLY OVERVIEW & COMPARISON */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Blood Supply Overview
                  </h3>
                  <p className="text-xs text-slate-500">Required vs Available by Region</p>
                </div>
              </div>

              <Link
                to="/government/supply"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
              >
                <span>Full Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* COMPARATIVE PROGRESS BARS */}
            <div className="space-y-4">
              {MOCK_REGIONAL_SUPPLY.slice(0, 5).map((reg) => {
                const isCrit = reg.status === 'critical';
                const isLow = reg.status === 'low';
                return (
                  <div key={reg.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">{reg.region}</span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-emerald-600 font-bold">{reg.availableUnits}u</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-700">{reg.requiredUnits}u</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isCrit ? 'text-red-700 bg-red-100' : isLow ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'
                          }`}
                        >
                          {reg.supplyCoverage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`rounded-full transition-all duration-500 ${
                          isCrit ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, reg.supplyCoverage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY STATS CALLOUT */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600 font-medium">National Buffer Ratio:</span>
              </div>
              <span className="font-black text-slate-900 font-mono">87.4% Coverage</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. BOTTOM SECTION: RECENT VERIFICATIONS + DONATION FEED   */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT (7 COLS): RECENT HOSPITAL VERIFICATION REQUESTS */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Recent Hospital Verification Requests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clinical establishment and NABH registration reviews
                  </p>
                </div>
              </div>

              <Link
                to="/government/hospitals"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline"
              >
                <span>View All ({hospitals.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {hospitals.slice(0, 4).map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{hosp.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {hosp.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      📍 {hosp.city}, {hosp.state} • {hosp.bedCapacity} Beds • Linked: {hosp.bloodBankLinked}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        hosp.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hosp.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : hosp.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {hosp.status}
                    </span>

                    {hosp.status === 'Pending' && (
                      <button
                        onClick={() => handleQuickVerify(hosp.id, hosp.name)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Verify
                      </button>
                    )}

                    <Link
                      to={`/government/hospitals/${hosp.id}`}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Inspect full dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT (5 COLS): RECENT BLOOD DONATION ACTIVITY */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Blood Donation Activity
                  </h3>
                  <p className="text-xs text-slate-500">Live voluntary & camp dispatches</p>
                </div>
              </div>

              <Link
                to="/government/donations"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
              >
                <span>Analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_DONATION_RECORDS.slice(0, 5).map((don) => (
                <div
                  key={don.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      {don.bloodGroup}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{don.donorName}</div>
                      <div className="text-[11px] text-slate-500">{don.centerName} • {don.city}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{don.units} Unit
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{don.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
};
