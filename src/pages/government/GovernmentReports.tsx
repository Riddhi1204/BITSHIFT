import { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';

export const GovernmentReports = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const reports = [
    {
      id: 'REP-2026-Q1',
      title: 'National Blood Supply & Reserve Health Audit (Q1 2026)',
      type: 'Quarterly Executive Dossier',
      date: 'March 01, 2026',
      size: '4.8 MB',
      status: 'Finalized',
    },
    {
      id: 'REP-HOTSPOT-02',
      title: 'State Hotspots & Inter-District Dispatch Efficiency Report',
      type: 'Emergency Telemetry Analysis',
      date: 'February 28, 2026',
      size: '2.4 MB',
      status: 'Generated',
    },
    {
      id: 'REP-HOSP-NABH',
      title: 'Hospital Clinical Accreditation & Compliance Status Ledger',
      type: 'Regulatory Audit',
      date: 'February 15, 2026',
      size: '3.1 MB',
      status: 'Finalized',
    },
    {
      id: 'REP-DONOR-26',
      title: 'Voluntary Camp Turnout & Apheresis Platelet Collections',
      type: 'Monthly Metrics',
      date: 'February 01, 2026',
      size: '1.9 MB',
      status: 'Generated',
    },
  ];

  return (
    <GovernmentLayout activeNav="reports">
      <div className="space-y-6">
        
        {/* TOAST ALERT */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Executive Transfusion Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                National Healthcare Intelligence Reports
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Official statutory audits, supply forecasting summaries, and inter-state logistics records.
              </p>
            </div>

            <button
              onClick={() => triggerToast('Compiling comprehensive nationwide supply report...')}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate New Custom Audit</span>
            </button>
          </div>
        </div>

        {/* REPORTS LIST */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{rep.title}</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {rep.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {rep.type} • Published: {rep.date} • File Size: {rep.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => triggerToast(`Downloading ${rep.title}...`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </GovernmentLayout>
  );
};
