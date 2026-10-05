import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ShieldCheck,
  AlertTriangle,
  X,
  MapPin,
  Bed,
  FileCheck
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { MOCK_HOSPITAL_APPLICATIONS } from '../../data/mockData';
import type { HospitalApplication } from '../../types';

export const GovernmentHospitals = () => {
  const [hospitals, setHospitals] = useState<HospitalApplication[]>(MOCK_HOSPITAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Verified' | 'Under Review' | 'Rejected'>('All');
  const [stateFilter, setStateFilter] = useState('All');
  
  // Rejection modal state
  const [rejectingHosp, setRejectingHosp] = useState<HospitalApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const states = useMemo(() => {
    const list = Array.from(new Set(MOCK_HOSPITAL_APPLICATIONS.map((h) => h.state)));
    return ['All', ...list.sort()];
  }, []);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.bloodBankLinked.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || h.status === statusFilter;
      const matchState = stateFilter === 'All' || h.state === stateFilter;

      return matchSearch && matchStatus && matchState;
    });
  }, [hospitals, searchQuery, statusFilter, stateFilter]);

  const handleApprove = (hosp: HospitalApplication) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hosp.id
          ? {
              ...h,
              status: 'Verified',
              auditLog: [
                ...h.auditLog,
                {
                  action: 'Approved & Verified',
                  by: 'Dr. Rajeshwar Sharma (NBTC / DGHS)',
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  note: 'Clinical establishment license & storage validated.',
                },
              ],
            }
          : h
      )
    );
    triggerToast(`Hospital ${hosp.name} (${hosp.id}) approved and verified successfully!`);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingHosp || !rejectReason.trim()) return;

    setHospitals((prev) =>
      prev.map((h) =>
        h.id === rejectingHosp.id
          ? {
              ...h,
              status: 'Rejected',
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

    triggerToast(`Application for ${rejectingHosp.name} has been rejected.`);
    setRejectingHosp(null);
    setRejectReason('');
  };

  const stats = {
    total: hospitals.length,
    pending: hospitals.filter((h) => h.status === 'Pending').length,
    verified: hospitals.filter((h) => h.status === 'Verified').length,
    underReview: hospitals.filter((h) => h.status === 'Under Review').length,
    rejected: hospitals.filter((h) => h.status === 'Rejected').length,
  };

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

        {/* HEADER & STATS SUMMARY */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5" />
                <span>State Accreditation & Licensing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hospital Verification & Registry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Review clinical applications, NABH credentials, blood bank linkages, and verify authorized healthcare centers.
              </p>
            </div>

            {/* QUICK STATS PILLS */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700">
                Total: {stats.total}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold">
                Pending: {stats.pending}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                Review: {stats.underReview}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                Verified: {stats.verified}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 font-bold">
                Rejected: {stats.rejected}
              </span>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, ID, city, state, or linked bank..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                <option value="All">All Verification Statuses</option>
                <option value="Pending">Pending Audit ({stats.pending})</option>
                <option value="Under Review">Under Review ({stats.underReview})</option>
                <option value="Verified">Verified ({stats.verified})</option>
                <option value="Rejected">Rejected ({stats.rejected})</option>
              </select>
            </div>

            {/* State Filter */}
            <div className="sm:col-span-3">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All States' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HOSPITALS TABLE & DIRECTORY                              */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Hospital Name & ID</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Contact & Beds</th>
                  <th className="py-3.5 px-4">Linked Blood Bank</th>
                  <th className="py-3.5 px-4">Application Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hosp) => (
                    <tr key={hosp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & ID */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <Link
                            to={`/government/hospitals/${hosp.id}`}
                            className="font-bold text-slate-900 hover:text-red-600 transition-colors"
                          >
                            {hosp.name}
                          </Link>
                          <div className="text-[11px] font-mono text-slate-400">ID: {hosp.id}</div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{hosp.city}, {hosp.state}</span>
                        </div>
                      </td>

                      {/* Contact & Beds */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 text-xs text-slate-600">
                          <div className="font-mono">{hosp.contact}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Bed className="w-3 h-3 text-slate-500" />
                            <span>{hosp.bedCapacity} Beds ({hosp.icuCapacity})</span>
                          </div>
                        </div>
                      </td>

                      {/* Linked Blood Bank */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 text-xs">
                          {hosp.bloodBankLinked}
                        </span>
                      </td>

                      {/* Application Date */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-500">
                        {hosp.applicationDate}
                      </td>

                      {/* Verification Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
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
                          {hosp.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {hosp.status === 'Rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                          <span>{hosp.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/government/hospitals/${hosp.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>

                          {hosp.status !== 'Verified' && (
                            <button
                              onClick={() => handleApprove(hosp)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              Verify
                            </button>
                          )}

                          {hosp.status !== 'Rejected' && (
                            <button
                              onClick={() => {
                                setRejectingHosp(hosp);
                                setRejectReason('');
                              }}
                              className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                      <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-sm">No hospital applications matching your filters</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setStateFilter('All');
                        }}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================== */}
        {/* REJECTION REASON CONFIRMATION MODAL                      */}
        {/* ======================================================== */}
        {rejectingHosp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reject Hospital Application</span>
                </div>
                <button
                  onClick={() => setRejectingHosp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p>
                  You are about to reject the registration application for{' '}
                  <strong className="text-slate-900">{rejectingHosp.name}</strong> ({rejectingHosp.id}).
                </p>
                <p className="text-slate-500">
                  Please provide the compliance reason or missing documentation details for formal notification.
                </p>
              </div>

              <form onSubmit={handleConfirmReject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Rejection Reason / Compliance Deficit *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Inadequate cold chain temperature logging calibration. State clinical license expired."
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingHosp(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
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
