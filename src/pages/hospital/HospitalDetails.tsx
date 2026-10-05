import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Bed, 
  Users, 
  Droplet, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';
import { getRegisteredHospitals } from '../../utils/hospitalVerificationStore';
import { HospitalDonorPledgeModal } from '../../components/modals/HospitalDonorPledgeModal';

export const HospitalDetails = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();

  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [selectedPledgeGroup, setSelectedPledgeGroup] = useState<string>('O-');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hospitals = getRegisteredHospitals();
  const hospital = hospitals.find((h) => h.id === hospitalId);

  // 21. ERROR HANDLING (404 Not Found)
  if (!hospital) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 text-brand-bright flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Hospital Not Found</h2>
            <p className="text-sm text-slate-300">
              The hospital identifier <strong className="text-red-400 font-mono">"{hospitalId}"</strong> does not match any registered hospital in the HemoVite network.
            </p>
            <p className="text-xs text-slate-400">
              Please select a registered hospital from the HemoVite network.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/hospitals"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hospitals</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Default fallback requirements if not explicitly provided
  const requirements = hospital.bloodRequirements ?? {
    'A+': { required: 10, available: hospital.stock['A+'] ?? 10, urgency: 'normal', patients: 2 },
    'A-': { required: 4, available: hospital.stock['A-'] ?? 2, urgency: 'emergency', patients: 1, requiredWithin: '3 Hours' },
    'B+': { required: 12, available: hospital.stock['B+'] ?? 15, urgency: 'normal', patients: 3 },
    'B-': { required: 5, available: hospital.stock['B-'] ?? 2, urgency: 'emergency', patients: 2, requiredWithin: '2 Hours' },
    'O+': { required: 20, available: hospital.stock['O+'] ?? 18, urgency: 'urgent', patients: 5, requiredWithin: '4 Hours' },
    'O-': { required: 6, available: hospital.stock['O-'] ?? 1, urgency: 'critical', patients: 2, requiredWithin: '1.5 Hours' },
    'AB+': { required: 6, available: hospital.stock['AB+'] ?? 8, urgency: 'normal', patients: 1 },
    'AB-': { required: 3, available: hospital.stock['AB-'] ?? 1, urgency: 'critical', patients: 1, requiredWithin: '2 Hours' },
  };

  // 6. Calculate summary metrics from blood requirement data
  const totalUnitsRequired = Object.values(requirements).reduce((acc, curr) => acc + curr.required, 0);
  const totalUnitsAvailable = Object.values(requirements).reduce((acc, curr) => acc + curr.available, 0);
  const totalShortage = Object.values(requirements).reduce(
    (acc, curr) => acc + Math.max(0, curr.required - curr.available),
    0
  );

  const requestStats = hospital.bloodRequests ?? {
    total: 18,
    pending: 6,
    emergency: 8,
    urgent: 6,
    fulfilled: 9,
    partiallyFulfilled: 2,
    cancelled: 1,
  };

  // 9. Emergency blood requirements (only emergency or critical)
  const emergencyRequirements = Object.entries(requirements).filter(([_, data]) => {
    return data.urgency === 'emergency' || data.urgency === 'critical';
  });

  // Bed details
  const bedStats = hospital.bedDetails ?? {
    total: hospital.beds,
    occupied: Math.round(hospital.beds * 0.85),
    available: Math.round(hospital.beds * 0.15),
  };

  // Patient statistics
  const patientStats = hospital.patientStats ?? {
    totalRequiringBlood: 24,
    emergency: 8,
    urgent: 10,
    normal: 6,
  };

  // Linked blood bank
  const linkedBloodBank = REGISTERED_BLOOD_BANKS.find(
    (b) => b.id === hospital.linkedBloodBankId || b.name === hospital.bloodBankLinked
  );

  // Helper for urgency badges
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>🔴 CRITICAL</span>
          </span>
        );
      case 'emergency':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>🔴 EMERGENCY</span>
          </span>
        );
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>🟠 URGENT</span>
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>🟡 NORMAL</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* 5. TOP HEADER BAR */}
      <header className="bg-[#0B1220] text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/hospitals"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hospitals</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-white">
              Hemo<span className="text-brand-bright">Vite</span>
            </span>
          </div>

          <button
            onClick={() => navigate(`/hospital/${hospital.id}/auth`)}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 transition-all"
            title="Authorized staff portal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Staff Access</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 5. HOSPITAL HERO / DETAILS BANNER */}
        <div className="bg-[#0B1220] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-xl shadow-brand-red/40 shrink-0">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {hospital.name}
                  </h1>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-red-950 border border-red-500/50 text-red-300">
                    Hospital ID: {hospital.id}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Hospital</span>
                  </span>

                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>{hospital.city}, {hospital.state}</span>
                  </span>

                  <span className="text-slate-400">({hospital.address})</span>
                </div>

                <div className="flex items-center gap-4 pt-1 flex-wrap text-xs">
                  <a
                    href={`tel:${hospital.phone}`}
                    className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-mono font-bold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-red" />
                    <span>📞 {hospital.phone}</span>
                  </a>

                  <a
                    href={`tel:${hospital.emergencyContact}`}
                    className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 font-mono font-bold bg-red-950/50 border border-red-500/40 px-3 py-1 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-brand-bright" />
                    <span>24/7 Trauma Emergency: {hospital.emergencyContact}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* QUICK LINKED HUB CARD */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0 lg:max-w-xs w-full backdrop-blur-md space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Primary Blood Bank Hub
              </span>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-brand-bright shrink-0" />
                <span className="truncate">{hospital.bloodBankLinked}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Grid Connected</span>
                </span>
                {hospital.linkedBloodBankId && (
                  <Link
                    to={`/blood-bank/${hospital.linkedBloodBankId}`}
                    className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-0.5 font-bold"
                  >
                    <span>View Hub</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 13. HOSPITAL OVERVIEW SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bed Capacity Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Hospital Bed Capacity</h3>
                  <p className="text-xs text-slate-400">{hospital.icuCapacity}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                Total: {bedStats.total}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Beds</span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">{bedStats.total}</span>
              </div>
              <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 text-center">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Occupied</span>
                <span className="text-xl font-black text-rose-800 font-mono mt-0.5 block">{bedStats.occupied}</span>
              </div>
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Available</span>
                <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">{bedStats.available}</span>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Occupancy Rate</span>
                <span>{Math.round((bedStats.occupied / bedStats.total) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-brand-red rounded-full" 
                  style={{ width: `${Math.round((bedStats.occupied / bedStats.total) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Patients Requiring Blood Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Patients Requiring Blood</h3>
                  <p className="text-xs text-slate-400">Clinical transfusion priority list</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-red-50 text-brand-red border border-red-200 px-2.5 py-1 rounded-lg">
                Total: {patientStats.totalRequiringBlood}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-red-50/80 p-3.5 rounded-2xl border border-red-200 text-center">
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Emergency</span>
                <span className="text-xl font-black text-red-700 font-mono mt-0.5 block">{patientStats.emergency}</span>
              </div>
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Urgent</span>
                <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">{patientStats.urgent}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Normal</span>
                <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{patientStats.normal}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-red shrink-0" />
                <span>Critical Surgery & Trauma OT Status:</span>
              </span>
              <span className="font-bold text-slate-900">Active Live Matching</span>
            </div>
          </div>
        </div>

        {/* 6. BLOOD REQUIREMENT OVERVIEW (6 METRIC CARDS) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Blood Requirement Overview
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated blood component balances, current shortages, and urgent demand metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {/* 1. Total Blood Units Required */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Units Required
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalUnitsRequired}
              </div>
              <p className="text-[10px] text-slate-400">Total clinical demand</p>
            </div>

            {/* 2. Total Blood Units Available */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Units Available
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                {totalUnitsAvailable}
              </div>
              <p className="text-[10px] text-slate-400">On-site reserve</p>
            </div>

            {/* 3. Total Shortage */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-brand-bright uppercase tracking-wider block">
                Units Shortage
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-bright font-mono">
                {totalShortage}
              </div>
              <p className="text-[10px] text-slate-400">Net deficit units</p>
            </div>

            {/* 4. Total Blood Requests */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                Total Requests
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
                {requestStats.total}
              </div>
              <p className="text-[10px] text-slate-400">Transfusion requisitions</p>
            </div>

            {/* 5. Emergency Requests */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                Emergency
              </span>
              <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
                {requestStats.emergency}
              </div>
              <p className="text-[10px] text-slate-400">Immediate action</p>
            </div>

            {/* 6. Urgent Requests */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card-soft space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                Urgent
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
                {requestStats.urgent}
              </div>
              <p className="text-[10px] text-slate-400">Within 24 hours</p>
            </div>
          </div>
        </div>

        {/* 9. EMERGENCY BLOOD REQUIREMENTS (DEDICATED SECTION) */}
        {emergencyRequirements.length > 0 && (
          <div className="bg-red-50/60 border border-red-200/90 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-red-950 flex items-center gap-2">
                    <span>🚨 Emergency Blood Requirements</span>
                  </h2>
                  <p className="text-xs text-red-700">
                    Priority blood groups under critical deficit requiring rapid donor dispatch or hub transfer.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <span className="text-xs font-mono font-bold bg-red-600 text-white px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto">
                  {emergencyRequirements.length} Critical Groups
                </span>

                <button
                  onClick={() => {
                    const firstEmergency = emergencyRequirements.length > 0 ? emergencyRequirements[0][0] : 'O-';
                    setSelectedPledgeGroup(firstEmergency);
                    setPledgeModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-black text-xs rounded-xl shadow-md hover:shadow-glow-red hover:-translate-y-0.5 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto shrink-0 group cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 fill-current text-white group-hover:scale-110 transition-transform" />
                  <span>I Can Donate Blood</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {emergencyRequirements.map(([group, item]) => {
                const shortage = Math.max(0, item.required - item.available);
                const isCritical = item.urgency === 'critical';

                return (
                  <div
                    key={group}
                    className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-black text-lg border border-red-200">
                          {group}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 text-sm block">{group} Blood</span>
                          <span className="text-[10px] text-slate-400">Whole Blood / PRBC</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.urgency.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Required:</span>
                        <span className="font-mono font-bold text-slate-900">{item.required} Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Available:</span>
                        <span className="font-mono font-bold text-slate-700">{item.available} Units</span>
                      </div>
                      <div className="flex justify-between text-brand-bright font-black">
                        <span>Shortage:</span>
                        <span className="font-mono">{shortage} Units</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Patients: <strong className="text-slate-900 font-mono">{item.patients ?? 1}</strong></span>
                      <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Within {item.requiredWithin ?? '2 Hours'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7 & 8. BLOOD GROUP REQUIREMENT TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Blood Groups Required</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Detailed clinical breakdown of all 8 blood groups with automatic shortage calculation.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Safe Reserve:</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                10 Units Minimum Standard
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Blood Group</th>
                  <th className="py-3 px-4">Required</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Shortage</th>
                  <th className="py-3 px-4 rounded-r-xl">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bloodGroups.map((group) => {
                  const item = requirements[group] ?? { required: 0, available: 0, urgency: 'normal' };
                  const shortage = Math.max(0, item.required - item.available);
                  const isCriticalOrEmergency = item.urgency === 'critical' || item.urgency === 'emergency';

                  return (
                    <tr 
                      key={group} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCriticalOrEmergency ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Blood Group */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-black text-base shadow-sm border border-red-100">
                            {group}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block">{group} Blood</span>
                            <span className="text-xs text-slate-400">Whole Blood / PRBC</span>
                          </div>
                        </div>
                      </td>

                      {/* Required */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {item.required} <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>

                      {/* Available */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {item.available} <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>

                      {/* Shortage (Auto-calculated: Required - Available, never negative) */}
                      <td className="py-4 px-4 font-mono font-black text-base">
                        {shortage > 0 ? (
                          <span className="text-brand-bright bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                            {shortage} Units
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>0 (Surplus)</span>
                          </span>
                        )}
                      </td>

                      {/* Urgency Badge */}
                      <td className="py-4 px-4">
                        {getUrgencyBadge(item.urgency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 10. BLOOD REQUEST STATUS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Blood Request Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Live lifecycle tracking of blood requisitions raised by {hospital.name}.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
              Total Requests: {requestStats.total}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
              <div className="text-2xl font-black text-slate-900 font-mono">{requestStats.total}</div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Pending</span>
              <div className="text-2xl font-black text-amber-800 font-mono">{requestStats.pending}</div>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-red-700 uppercase">Emergency</span>
              <div className="text-2xl font-black text-red-700 font-mono">{requestStats.emergency}</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-orange-700 uppercase">Urgent</span>
              <div className="text-2xl font-black text-orange-800 font-mono">{requestStats.urgent}</div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Fulfilled</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">{requestStats.fulfilled}</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Partial</span>
              <div className="text-2xl font-black text-blue-800 font-mono">{requestStats.partiallyFulfilled}</div>
            </div>

            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-center space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Cancelled</span>
              <div className="text-2xl font-black text-slate-600 font-mono">{requestStats.cancelled}</div>
            </div>
          </div>
        </div>

        {/* 12. CURRENT BLOOD AVAILABILITY */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Current Blood Availability
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Visual availability indicators for whole blood reserves currently stored in the clinical refrigerator.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Total On-Site: {totalUnitsAvailable} Units
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bloodGroups.map((grp) => {
              const units = requirements[grp]?.available ?? 0;
              const isCrit = units <= 2;
              const isLow = units > 2 && units <= 5;

              return (
                <div
                  key={grp}
                  className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-sm shadow-sm">
                        {grp}
                      </span>
                      <span className="font-bold text-xs text-slate-800">{grp} Reserve</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCrit
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : isLow
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isCrit ? '🔴 Critical' : isLow ? '🟡 Low' : '🟢 Healthy'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 font-medium">Available Units:</span>
                    <span className="text-xl font-black text-slate-900 font-mono">{units} <span className="text-xs font-normal text-slate-400">Units</span></span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (units / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. CURRENT BLOOD REQUESTS (PUBLIC / ANONYMIZED) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5 text-brand-red" />
                <span>Public Transparency Ledger</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Current Blood Requests
              </h2>
              <p className="text-xs text-slate-500">
                Anonymized active clinical requisitions processed through HemoVite's emergency grid.
              </p>
            </div>

            <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
              🔒 Patient privacy protected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Request ID</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Units Required</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Required By</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {(hospital.recentPublicRequests ?? [
                  { id: 'REQ-1024', bloodGroup: 'O-', unitsRequired: 3, urgency: 'critical', requiredBy: 'Within 2 Hours', status: 'Searching' },
                  { id: 'REQ-1025', bloodGroup: 'B+', unitsRequired: 2, urgency: 'urgent', requiredBy: 'Today', status: 'Partially Fulfilled' },
                  { id: 'REQ-1026', bloodGroup: 'AB-', unitsRequired: 2, urgency: 'critical', requiredBy: 'Within 1.5 Hours', status: 'Searching' },
                  { id: 'REQ-1027', bloodGroup: 'B-', unitsRequired: 2, urgency: 'emergency', requiredBy: 'Within 4 Hours', status: 'Pending' },
                ]).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {req.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-black px-2.5 py-0.5 rounded-md bg-red-50 text-brand-red border border-red-200 font-mono">
                        {req.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {req.unitsRequired} Units
                    </td>

                    <td className="py-3.5 px-4">
                      {getUrgencyBadge(req.urgency)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {req.requiredBy}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Searching'
                            ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                            : req.status === 'Partially Fulfilled'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : req.status === 'Dispatched'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span>{req.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 14. LINKED BLOOD BANK SECTION */}
        <div className="bg-gradient-to-r from-[#0B1220] to-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>Affiliated Transfusion Center</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Linked Blood Bank: {hospital.bloodBankLinked}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Connected directly to HemoVite's national component bank network.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>🟢 Operational 24/7</span>
              </span>

              {hospital.linkedBloodBankId && (
                <Link
                  to={`/blood-bank/${hospital.linkedBloodBankId}`}
                  className="px-4 py-2 bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
                >
                  <span>View Full Hub Inventory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Hub Blood Stock Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Live Stock Availability at Connected Hub
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
              {bloodGroups.map((grp) => {
                const units = linkedBloodBank?.inventory[grp] ?? hospital.stock[grp] ?? 10;
                return (
                  <div
                    key={grp}
                    className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1 hover:bg-white/10 transition-colors"
                  >
                    <span className="font-bold text-white text-xs block">{grp}</span>
                    <span className="font-mono text-sm font-black text-brand-bright block">{units}</span>
                    <span className="text-[10px] text-slate-400 block">Units</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM NAV / BACK CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Registered Hospitals</span>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to Top ↑
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • National Blood Availability & Shortage Prediction Network
      </footer>

      {/* DONOR PLEDGE MODAL */}
      <HospitalDonorPledgeModal
        isOpen={pledgeModalOpen}
        onClose={() => setPledgeModalOpen(false)}
        hospitalId={hospital.id}
        hospitalName={hospital.name}
        defaultGroup={selectedPledgeGroup}
        emergencyGroups={emergencyRequirements.map(([grp]) => grp)}
        onSuccess={(_donorName, _bloodGroup) => {
          setToastMessage(
            "Thank you for stepping up! Hospital coordinators have received your donation offer and will contact you shortly."
          );
          setTimeout(() => {
            setToastMessage(null);
          }, 6000);
        }}
      />

      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0B1220] border border-emerald-500/60 rounded-2xl p-4 shadow-2xl text-white flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Pledge Transmitted Successfully
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
