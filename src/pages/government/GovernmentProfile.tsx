import { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Building,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { DEFAULT_GOV_USER } from '../../data/mockData';
import type { GovernmentUser } from '../../types';

export const GovernmentProfile = () => {
  const [user, setUser] = useState<GovernmentUser>(DEFAULT_GOV_USER);

  useEffect(() => {
    const stored = localStorage.getItem('hemovite_gov_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(DEFAULT_GOV_USER);
      }
    }
  }, []);

  const isVerified = user.verificationStatus === 'Verified';

  return (
    <GovernmentLayout activeNav="profile">
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>Official Identity & Accreditation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Government Administrator Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Designated nodal officer credentials, jurisdictional authority, and NDHM cryptographic verification record.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 5 COLS: IDENTITY SUMMARY */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-red-900/30">
                  {user.name ? user.name.charAt(0) : 'G'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                  <p className="text-xs text-slate-500">{user.designation}</p>
                  <span className="font-mono text-[10px] text-slate-400 block mt-0.5">ID: {user.id}</span>
                </div>
              </div>

              {/* VERIFICATION BADGE */}
              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isVerified
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Government Verification</span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Authority</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Verification</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isVerified
                    ? 'This account has passed official Ministry credentialing and possesses full clearance for state hospital accreditation and buffer transfer mobilizations.'
                    : 'Account credentialing audit in progress. Verification status is managed exclusively by the Ministry of Health and Family Welfare.'}
                </p>
              </div>

              {/* JURISDICTION PILLS */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Assigned Jurisdiction:</span>
                  <span className="font-bold text-slate-900">{user.state}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">District Zone:</span>
                  <span className="font-bold text-slate-900">{user.district}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Authority ID:</span>
                  <span className="font-mono font-bold text-red-700">{user.authorityId || 'AUTH-SBTC-9021'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Verification status cannot be altered directly. Managed by DGHS node.</span>
            </div>
          </div>

          {/* RIGHT 7 COLS: DETAILED CREDENTIALS & PRIVILEGES */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Official Department & Contact Record
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Official Email</span>
                </div>
                <div className="font-bold text-slate-900 text-sm font-mono">{user.email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Secure Phone</span>
                </div>
                <div className="font-bold text-slate-900 text-sm font-mono">{user.phone}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                  <Building className="w-3.5 h-3.5" />
                  <span>Government Department / Agency</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{user.department}</div>
              </div>
            </div>

            {/* ROLE-BASED ACCESS CLEARANCE */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Authorized Platform Clearances
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hospital Verification & Audit</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buffer Mobilization Command</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>State Blood Deficit Telemetry</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>National Statutory Reporting</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
};
