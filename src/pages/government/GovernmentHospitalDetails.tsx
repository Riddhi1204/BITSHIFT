import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Clock,
  Bed,
  Droplet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  History,
  AlertCircle,
  X
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { MOCK_HOSPITAL_APPLICATIONS } from '../../data/mockData';
import type { HospitalApplication } from '../../types';

export const GovernmentHospitalDetails = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();

  const [hospitals, setHospitals] = useState<HospitalApplication[]>(MOCK_HOSPITAL_APPLICATIONS);
  const hospital = hospitals.find((h) => h.id === hospitalId);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!hospital) {
    return (
      <GovernmentLayout activeNav="hospitals">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Application Not Found</h2>
          <p className="text-xs text-slate-500">
            No hospital registration matching identifier <code className="font-mono text-red-600">{hospitalId}</code>.
          </p>
          <Link
            to="/government/hospitals"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hospital Registry</span>
          </Link>
        </div>
      </GovernmentLayout>
    );
  }

  const handleApprove = () => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospital.id
          ? {
              ...h,
              status: 'Verified' as const,
              auditLog: [
                ...h.auditLog,
                {
                  action: 'Approved & Formally Verified',
                  by: 'Dr. Rajeshwar Sharma (NBTC)',
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  note: 'Institutional compliance verified against NDHM criteria.',
                },
              ],
            }
          : h
      )
    );
    triggerToast(`Hospital ${hospital.name} has been certified and verified!`);
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;

    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospital.id
          ? {
              ...h,
              status: 'Rejected' as const,
              rejectionReason: rejectReason,
              auditLog: [
                ...h.auditLog,
                {
                  action: 'Application Rejected',
                  by: 'Dr. Rajeshwar Sharma (NBTC)',
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  note: rejectReason,
                },
              ],
            }
          : h
      )
    );
    setRejectModalOpen(false);
    triggerToast(`Application rejected with recorded compliance remarks.`);
  };

  const bloodStock = hospital.stock || { 'A+': 18, 'A-': 4, 'B+': 22, 'B-': 3, 'AB+': 8, 'AB-': 2, 'O+': 14, 'O-': 3 };

  return (
    <GovernmentLayout activeNav="hospitals">
      <div className="space-y-6">
        
        {/* TOAST ALERT */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* BREADCRUMB & BACK NAV */}
        <div className="flex items-center justify-between">
          <Link
            to="/government/hospitals"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hospital Verification Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Node ID: {hospital.id}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. DOSSIER HERO BANNER                                   */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-lg shadow-red-900/20 shrink-0">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {hospital.name}
                  </h1>
                  
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      hospital.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : hospital.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : hospital.status === 'Rejected'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {hospital.status === 'Verified' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    {hospital.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {hospital.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                    <span>{hospital.status}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{hospital.address}</span>
                  </span>

                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hospital.contact}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hospital.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {hospital.status !== 'Verified' && (
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve Hospital</span>
                </button>
              )}

              {hospital.status !== 'Rejected' && (
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs sm:text-sm transition-all"
                >
                  <span>Reject Application</span>
                </button>
              )}
            </div>

          </div>

          {/* REJECTION REASON CALLOUT (IF REJECTED) */}
          {hospital.status === 'Rejected' && hospital.rejectionReason && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Application Rejection Notice & Remediation Requirements:</span>
              </div>
              <p className="leading-relaxed">{hospital.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. CORE DETAILS: CAPACITY & BLOOD HUB LINKAGE             */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Facility Capacity Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Clinical Bed Capacity</h3>
                <p className="text-xs text-slate-500">Inpatient & ICU transfusion infrastructure</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Beds</span>
                <div className="text-2xl font-black text-slate-900 font-mono">{hospital.bedCapacity}</div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                <span className="text-[11px] font-bold text-purple-600 uppercase">Critical Care</span>
                <div className="text-xl font-black text-purple-900 font-mono">{hospital.icuCapacity}</div>
              </div>
            </div>
          </div>

          {/* Linked Blood Bank Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Linked Component Blood Bank</h3>
                <p className="text-xs text-slate-500">Primary supply pipeline affiliation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>{hospital.bloodBankLinked}</span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Authorized under National Blood Transfusion Council cold-chain logistics standard.
              </p>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. CURRENT BLOOD INVENTORY & REQUISITIONS                */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Current Blood Stock on Premises</h3>
            <p className="text-xs text-slate-500">Real-time inventory reported by hospital node</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(bloodStock).map(([grp, units]) => {
              const isLow = units <= 4;
              return (
                <div
                  key={grp}
                  className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                    isLow ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="text-xs font-black block">{grp}</span>
                  <div className="text-xl font-black font-mono">{units}</div>
                  <span className="text-[10px] text-slate-400 block">Units</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. SUBMITTED COMPLIANCE DOCUMENTS & AUDIT TRAIL           */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Registration Documents */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-base text-slate-900">Accreditation Documents</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">{hospital.documents.length} Files</span>
            </div>

            <div className="space-y-2.5">
              {hospital.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {doc.type}
                    </span>
                    <span className="font-bold text-slate-800">{doc.name}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit History Log */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-base text-slate-900">Verification History Log</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">{hospital.auditLog.length} Events</span>
            </div>

            <div className="space-y-3">
              {hospital.auditLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">Officer: {log.by}</div>
                  {log.note && <div className="text-[11px] text-slate-500 italic">"{log.note}"</div>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* REJECTION REASON MODAL                                   */}
        {/* ======================================================== */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reject Hospital Application</span>
                </div>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Official Rejection Reason *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="State reason for non-compliance..."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                  >
                    Confirm Rejection
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
