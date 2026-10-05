import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  AlertOctagon,
  Droplet,
  Flame,
  CheckCircle2,
  Eye,
  ChevronRight,
  Activity,
  Layers,
  FileCheck,
  Send,
  X,
  MapPin,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  HeartHandshake
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import {
  MOCK_GOV_STATS,
  MOCK_GOV_ALERTS,
  MOCK_BLOOD_HOTSPOTS,
  MOCK_HOSPITAL_APPLICATIONS
} from '../../data/mockData';
import { useEffect } from 'react';
import type { HospitalApplication, BloodHotspot } from '../../types';
import {
  getHospitalApplications,
  approveHospitalApplication,
  rejectHospitalApplication
} from '../../utils/hospitalVerificationStore';

export const GovernmentDashboard = () => {
  const [hospitals, setHospitals] = useState<HospitalApplication[]>(getHospitalApplications);
  const [stats, setStats] = useState(MOCK_GOV_STATS);
  const [selectedHotspot, setSelectedHotspot] = useState<BloodHotspot>(MOCK_BLOOD_HOTSPOTS[0]);
  const [reviewingHosp, setReviewingHosp] = useState<HospitalApplication | null>(null);
  const [requestInfoModalHosp, setRequestInfoModalHosp] = useState<HospitalApplication | null>(null);
  const [requestInfoNote, setRequestInfoNote] = useState('');
  const [rejectModalHosp, setRejectModalHosp] = useState<HospitalApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch from store
    const apps = getHospitalApplications();
    setHospitals(apps);

    const handleAppsUpdated = () => {
      const updated = getHospitalApplications();
      setHospitals(updated);
      const pendingCount = updated.filter((h) => h.status === 'Pending').length;
      const verifiedCount = updated.filter((h) => h.status === 'Verified').length;
      setStats((prev) => ({
        ...prev,
        pendingVerification: pendingCount,
        verifiedHospitals: 116 + verifiedCount,
        registeredHospitals: 128 + updated.length - MOCK_HOSPITAL_APPLICATIONS.length,
      }));
    };

    window.addEventListener('hemovite_applications_updated', handleAppsUpdated);
    return () => {
      window.removeEventListener('hemovite_applications_updated', handleAppsUpdated);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleVerify = (id: string, name: string) => {
    approveHospitalApplication(id, 'Dr. Rajeshwar Sharma (NBTC / DGHS)');
    const updated = getHospitalApplications();
    setHospitals(updated);
    setStats((prev) => ({
      ...prev,
      pendingVerification: Math.max(0, prev.pendingVerification - 1),
      verifiedHospitals: prev.verifiedHospitals + 1,
    }));
    setReviewingHosp(null);
    triggerToast(`Hospital ${name} (${id}) has been officially verified and added to the National Health Grid!`);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalHosp || !rejectReason.trim()) return;

    rejectHospitalApplication(rejectModalHosp.id, rejectReason, 'Dr. Rajeshwar Sharma (NBTC)');
    const updated = getHospitalApplications();
    setHospitals(updated);

    triggerToast(`Application for ${rejectModalHosp.name} has been rejected.`);
    setRejectModalHosp(null);
    setReviewingHosp(null);
    setRejectReason('');
  };

  const handleConfirmRequestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestInfoModalHosp || !requestInfoNote.trim()) return;

    setHospitals((prev) =>
      prev.map((h) =>
        h.id === requestInfoModalHosp.id
          ? {
              ...h,
              status: 'Under Review' as const,
              requestedInfoNote: requestInfoNote,
              auditLog: [
                ...h.auditLog,
                {
                  action: 'Information Requested',
                  by: 'Dr. Rajeshwar Sharma (DGHS)',
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  note: requestInfoNote,
                },
              ],
            }
          : h
      )
    );

    triggerToast(`Formal information request dispatched to ${requestInfoModalHosp.name}.`);
    setRequestInfoModalHosp(null);
    setReviewingHosp(null);
    setRequestInfoNote('');
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
        {/* 1. DASHBOARD HEADER TITLE                                */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>National Oversight Command Grid</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Government Blood Network Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Monitor blood availability, hospital verification, urgent requirements, and regional donation activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                Live Data Synchronized (Demo Mode)
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CRITICAL ALERTS BANNER                                */}
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
                    Emergency Broadcast
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
                className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View Hotspots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/government/hospitals"
                className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-950 text-white border border-white/20 font-bold text-xs transition-all cursor-pointer"
              >
                <span>Verify Hospitals</span>
              </Link>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TOP SUMMARY CARDS (6 SUMMARY CARDS - SECTION 8)        */}
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
            <p className="text-[10px] text-amber-600 font-bold">12 Pending Verification</p>
          </div>

          {/* 2. Blood Banks */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Blood Banks</span>
              <Droplet className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.bloodBanks}
            </div>
            <p className="text-[10px] text-orange-600 font-bold">5 Requiring Attention</p>
          </div>

          {/* 3. Active Blood Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Requests</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.activeRequests}
            </div>
            <p className="text-[10px] text-red-600 font-bold">21 Emergency</p>
          </div>

          {/* 4. Blood Units Available */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Available Units</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {stats.unitsAvailable.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Across Verified Facilities</p>
          </div>

          {/* 5. Units Donated */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Units Donated</span>
              <HeartHandshake className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.unitsDonated.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">This Month</p>
          </div>

          {/* 6. Critical Shortage Areas */}
          <div className="bg-white rounded-2xl border border-red-200 p-4 shadow-sm space-y-1 bg-red-50/40">
            <div className="flex items-center justify-between text-red-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Shortage Areas</span>
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
              {stats.criticalShortageAreas}
            </div>
            <p className="text-[10px] text-red-700 font-bold">Requires Attention</p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. FEATURE 1: HOSPITAL VERIFICATION (SECTION 9 & 10)      */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Hospital Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Review hospitals applying to join the HemoVite network. Authorized government verification only.
                </p>
              </div>
            </div>

            <Link
              to="/government/hospitals"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              <span>View All Verification Requests ({hospitals.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Hospital Name & License No.</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Beds & Linked Hub</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {hospitals.slice(0, 6).map((hosp) => (
                  <tr key={hosp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{hosp.name}</div>
                      <span className="text-[11px] font-mono text-slate-500 font-normal">
                        {hosp.licenseNumber || hosp.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{hosp.city}, {hosp.state}</div>
                      <span className="text-[11px] text-slate-400 truncate block max-w-xs">{hosp.address}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {hosp.applicationDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-mono font-bold text-slate-800">{hosp.bedCapacity} Beds</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">{hosp.bloodBankLinked}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          hosp.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : hosp.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                            : hosp.status === 'Rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {hosp.status === 'Verified' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        <span>{hosp.status === 'Verified' ? 'Verified Node' : hosp.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={() => setReviewingHosp(hosp)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Inspect application documents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {hosp.status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(hosp.id, hosp.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                            title="Approve and activate as verified node"
                          >
                            Approve
                          </button>
                        )}

                        {hosp.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setRejectModalHosp(hosp);
                              setRejectReason('Deficiencies in uploaded accreditation or licensing documentation.');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors cursor-pointer"
                            title="Reject application"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. FEATURE 2: URGENT BLOOD REQUIREMENT HOTSPOTS (SECTION 11-13) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Urgent Blood Requirement Hotspots
                </h3>
                <p className="text-xs text-slate-500">
                  Geographic deficit telemetry showing high demand and critical shortage zones across states.
                </p>
              </div>
            </div>

            <Link
              to="/government/hotspots"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              <span>Full Interactive Map & Filters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT 7 COLS: HOTSPOT SELECTION MATRIX */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Select Hotspot to Inspect Telemetry
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_BLOOD_HOTSPOTS.slice(0, 6).map((hotspot) => {
                  const isSelected = selectedHotspot.id === hotspot.id;
                  const isCrit = hotspot.severity === 'Critical';

                  return (
                    <div
                      key={hotspot.id}
                      onClick={() => setSelectedHotspot(hotspot)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-500'
                          : 'border-slate-200/90 hover:border-red-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>{hotspot.city}</span>
                          <span className="text-xs text-slate-400 font-medium">({hotspot.state})</span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCrit ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {hotspot.severity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Group Deficit: <strong className="text-red-600 font-mono font-bold">{hotspot.bloodGroup}</strong></span>
                        <span className="font-mono text-slate-900 font-bold">Shortage: {hotspot.totalShortage}u</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 5 COLS: DETAILED HOTSPOT INSPECTOR (SECTION 12) */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">{selectedHotspot.city}</span>
                      <span className="text-xs text-slate-400">({selectedHotspot.state})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Last Updated: {selectedHotspot.lastUpdated}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                    {selectedHotspot.severity} Risk
                  </span>
                </div>

                {/* AI SHORTAGE RISK (SECTION 23) */}
                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">AI Shortage Risk Score:</span>
                    <span className="font-mono font-black text-red-400">{selectedHotspot.aiShortageRisk}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Calculated velocity of emergency surgical requirements vs hospital reserves.
                  </p>
                </div>

                {/* DETAILED STATS MATRIX */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase block">Units Required</span>
                    <span className="text-base font-mono font-black text-white">{selectedHotspot.unitsRequired} Units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase block">Units Available</span>
                    <span className="text-base font-mono font-black text-emerald-400">{selectedHotspot.unitsAvailable} Units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase block">Calculated Shortage</span>
                    <span className="text-base font-mono font-black text-red-400">{selectedHotspot.totalShortage} Units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase block">Emergency Requests</span>
                    <span className="text-base font-mono font-black text-amber-400">{selectedHotspot.emergencyRequests} Active</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
                  <span>Hospitals Affected: <strong className="text-white">{selectedHotspot.hospitalsAffected}</strong></span>
                  <span>Impacted Patients: <strong className="text-white">{selectedHotspot.patientsAffected}</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerToast(`Buffer dispatch protocol initiated for ${selectedHotspot.city}. Routing ${selectedHotspot.totalShortage} units.`);
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mobilize Buffer Dispatch Protocol</span>
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. FEATURE 3: BLOOD DONATIONS BY AREA (SECTION 14)        */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Blood Donations by Area
                </h3>
                <p className="text-xs text-slate-500">
                  Understand regional donation turnouts, units collected, and monthly trends across verified facilities.
                </p>
              </div>
            </div>

            <Link
              to="/government/donations"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              <span>Full Analytics Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Ranchi</span>
              <div className="text-2xl font-black text-slate-900 font-mono">2,480 Units</div>
              <p className="text-[10px] text-emerald-600 font-medium">6 Active Donation Camps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">New Delhi</span>
              <div className="text-2xl font-black text-slate-900 font-mono">3,120 Units</div>
              <p className="text-[10px] text-emerald-600 font-medium">14 Active Donation Camps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Jamshedpur</span>
              <div className="text-2xl font-black text-slate-900 font-mono">1,840 Units</div>
              <p className="text-[10px] text-emerald-600 font-medium">5 Active Donation Camps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Kolkata</span>
              <div className="text-2xl font-black text-slate-900 font-mono">4,210 Units</div>
              <p className="text-[10px] text-emerald-600 font-medium">9 Active Donation Camps</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* REVIEW MODAL (FEATURE 1 FULL AUDIT PANEL)                */}
        {/* ======================================================== */}
        {reviewingHosp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                  <Building2 className="w-5 h-5 text-red-600" />
                  <span>Hospital Verification Dossier: {reviewingHosp.name}</span>
                </div>
                <button
                  onClick={() => setReviewingHosp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* HOSPITAL INFO & REGISTRATION DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hospital ID & Name</span>
                  <div className="font-bold text-slate-900">{reviewingHosp.name} ({reviewingHosp.id})</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                  <div className="font-bold text-slate-900">{reviewingHosp.address}, {reviewingHosp.city}, {reviewingHosp.state}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Details</span>
                  <div className="font-mono text-slate-900">{reviewingHosp.contact} • {reviewingHosp.email}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bed & ICU Capacity</span>
                  <div className="font-bold text-slate-900">{reviewingHosp.bedCapacity} Inpatient Beds ({reviewingHosp.icuCapacity})</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Blood Bank Facility</span>
                  <div className="font-bold text-slate-900">{reviewingHosp.bloodBankLinked}</div>
                </div>
              </div>

              {/* ACCREDITATION DOCUMENTS */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Accreditation & Compliance Files ({reviewingHosp.documents.length}):
                </span>
                <div className="space-y-1.5">
                  {reviewingHosp.documents.map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS (VERIFY, REJECT, REQUEST INFO) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRequestInfoModalHosp(reviewingHosp);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Information</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModalHosp(reviewingHosp);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition-all cursor-pointer"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerify(reviewingHosp.id, reviewingHosp.name)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Verify Hospital
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* REJECT MODAL */}
        {rejectModalHosp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reject Hospital Registration</span>
                </div>
                <button
                  onClick={() => setRejectModalHosp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Specify the deficiency or compliance reason for rejecting <strong>{rejectModalHosp.name}</strong>:
              </p>

              <form onSubmit={handleConfirmReject} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Inadequate cold chain temperature logging calibration..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs text-slate-900 bg-slate-50/50"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalHosp(null)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REQUEST INFO MODAL */}
        {requestInfoModalHosp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <HelpCircle className="w-5 h-5" />
                  <span>Request Information</span>
                </div>
                <button
                  onClick={() => setRequestInfoModalHosp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Enter clarifications or missing accreditation documents required from <strong>{requestInfoModalHosp.name}</strong>:
              </p>

              <form onSubmit={handleConfirmRequestInfo} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={requestInfoNote}
                  onChange={(e) => setRequestInfoNote(e.target.value)}
                  placeholder="e.g. Please provide updated NABH renewal certificate and Blood Bank Linkage MoU..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 bg-slate-50/50"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestInfoModalHosp(null)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </GovernmentLayout>
  );
};
