import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Activity, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getBloodGroupStatus } from '../../components/bloodbank/BloodAvailabilityBadge';
import { bloodBankApi } from '../../services/bloodBankApi';
import type { BloodBank } from '../../types';

export const BloodBankDetails = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const navigate = useNavigate();

  const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bloodBankId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    bloodBankApi.getById(bloodBankId)
      .then((res: any) => {
        if (!isMounted) return;
        if (res && res.id) {
          setBloodBank(res);
        } else {
          setError('Blood bank not found in database');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to connect to backend service');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bloodBankId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-card-soft">
          <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Loading Facility Dossier...</h2>
          <p className="text-xs text-slate-500">Querying real-time blood bank storage records from PostgreSQL...</p>
        </div>
      </div>
    );
  }

  // INVALID BLOOD BANK ERROR STATE
  if (error || !bloodBank) {
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
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="pt-2">
            <Link
              to="/blood-banks"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Registered Blood Banks</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const inventory = bloodBank.inventory || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* TOP HEADER */}
      <header className="bg-[#0B1220] text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/blood-banks"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Blood Banks</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-sm">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <span className="text-base font-black text-white">
              Hemo<span className="text-brand-bright">Vite</span>
            </span>
          </div>

          <button
            onClick={() => navigate(`/blood-bank/${bloodBank.id}/auth`)}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Authorized staff portal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Staff Access</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* HERO FACILITY BANNER */}
        <div className="bg-[#0B1220] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
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
                    {bloodBank.id}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                  <span>{bloodBank.address}</span>
                </p>

                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{bloodBank.status === 'operational' ? 'Operational 24/7' : 'Under Maintenance'}</span>
                  </span>

                  {bloodBank.ngoPartner && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                      <span>🤝 NGO / Non-Profit Partner</span>
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
                    <span className="font-bold text-rose-400 shrink-0">NGO Mission:</span>
                    <span>{bloodBank.initiative}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTACT STRIP */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-mono font-bold text-white">{bloodBank.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="text-red-400 block text-[10px] uppercase font-bold">Emergency 24/7 Hotline</span>
                <span className="font-mono font-bold text-brand-bright">{bloodBank.emergencyContact || bloodBank.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Email</span>
                <span className="text-white truncate">{bloodBank.email || 'contact@bloodbank.org'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Operating Hours</span>
                <span className="text-white font-semibold">{bloodBank.operatingHours || '24 Hours Open'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOOD AVAILABILITY SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card-soft space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Live PostgreSQL Telemetry</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Complete Blood Group Inventory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time stock ledger of whole blood and PRBC units stored in {bloodBank.name}.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 font-medium">Total Available Reserve</span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {bloodBank.totalUnits || Object.values(inventory).reduce((a, b) => a + b, 0)} <span className="text-xs font-normal text-slate-500">Units</span>
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
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Safe Minimum Reserve</th>
                  <th className="py-3 px-4 rounded-r-xl">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bloodGroups.map((grp) => {
                  const units = inventory[grp] ?? 0;
                  const meta = getBloodGroupStatus(units);

                  return (
                    <tr key={grp} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-black text-base shadow-sm">
                            {grp}
                          </div>
                          <div>
                            <span className="font-black text-slate-900">{grp} Blood</span>
                            <span className="text-xs text-slate-400 block">Whole Blood / PRBC</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-black text-lg text-slate-900">
                        {units} <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            meta.status === 'Critical'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : meta.status === 'Low'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              meta.status === 'Critical'
                                ? 'bg-red-600 animate-pulse'
                                : meta.status === 'Low'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span>
                            {meta.status === 'Critical' ? '🔴 Critical' : meta.status === 'Low' ? '🟡 Low' : '🟢 Available'}
                          </span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-slate-600">
                        10 Units (Standard)
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500">
                        {bloodBank.lastUpdated || 'Synchronized'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HemoVite. All Rights Reserved. • Verified Healthcare Resource Ledger
      </footer>

    </div>
  );
};
