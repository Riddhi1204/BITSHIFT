import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  CheckCheck
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { MOCK_GOV_ALERTS } from '../../data/mockData';
import type { GovernmentAlert } from '../../types';

export const GovernmentNotifications = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<GovernmentAlert[]>(MOCK_GOV_ALERTS);
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Information'>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (priorityFilter === 'All') return true;
    return alert.priority === priorityFilter;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    triggerToast('Notification marked as acknowledged.');
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })));
    triggerToast('All notifications marked as acknowledged.');
  };

  return (
    <GovernmentLayout activeNav="notifications">
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
                <Bell className="w-3.5 h-3.5" />
                <span>Emergency Broadcast Log</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Government Emergency Notifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Official network alerts, critical shortage detections, audit triggers, and hospital registration notices.
              </p>
            </div>

            <button
              onClick={handleAcknowledgeAll}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Acknowledged</span>
            </button>
          </div>

          {/* PRIORITY FILTER CHIPS */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['All', 'Critical', 'High', 'Medium', 'Information'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const isCrit = alert.priority === 'Critical';
              const isHigh = alert.priority === 'High';
              const isMed = alert.priority === 'Medium';

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    alert.resolved
                      ? 'bg-slate-50/60 border-slate-200 opacity-70'
                      : isCrit
                      ? 'bg-red-50/70 border-red-200'
                      : isHigh
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isCrit
                          ? 'bg-red-600 text-white animate-pulse'
                          : isHigh
                          ? 'bg-amber-500 text-white'
                          : isMed
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {isCrit ? (
                        <AlertOctagon className="w-5 h-5" />
                      ) : isHigh ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{alert.title}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isCrit
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : isMed
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {alert.priority || 'Info'}
                        </span>
                        {alert.resolved && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                            Acknowledged
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-medium">
                        <span>📍 {alert.region}</span>
                        <span>•</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alert.hotspotId && (
                      <button
                        onClick={() => navigate('/government/hotspots')}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <span>View Hotspot</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {alert.hospitalId && (
                      <button
                        onClick={() => navigate('/government/hospitals')}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <span>Review Hospital</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!alert.resolved && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
                        title="Mark Acknowledged"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </GovernmentLayout>
  );
};
