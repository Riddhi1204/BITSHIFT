import { useState } from 'react';
import {
  Settings,
  CheckCircle2,
  Save
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { DEFAULT_GOV_USER } from '../../data/mockData';

export const GovernmentSettings = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [name, setName] = useState(DEFAULT_GOV_USER.name);
  const [email, setEmail] = useState(DEFAULT_GOV_USER.email);
  const [phone, setPhone] = useState(DEFAULT_GOV_USER.phone);
  const [criticalSmsAlerts, setCriticalSmsAlerts] = useState(true);
  const [dailyBriefingEmail, setDailyBriefingEmail] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Government administrator preferences saved successfully.');
  };

  return (
    <GovernmentLayout activeNav="settings">
      <div className="space-y-6">
        
        {/* TOAST ALERT */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" />
            <span>Administrative Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Settings & Emergency Dispatch Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure nodal officer profiles, notification triggers, and NDHM integration keys.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            
            {/* PROFILE DETAILS */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                Nodal Administrator Profile
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Government Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* NOTIFICATION PREFERENCES */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                Emergency Alert Broadcasts
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 block">Critical Deficit SMS Alerts</span>
                    <span className="text-[11px] text-slate-500">Receive instant SMS alerts when any region drops below 24h buffer</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalSmsAlerts}
                    onChange={(e) => setCriticalSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 block">Daily Intelligence Briefing</span>
                    <span className="text-[11px] text-slate-500">Daily morning summary email of blood supplies across all states</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyBriefingEmail}
                    onChange={(e) => setDailyBriefingEmail(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Administrative Preferences</span>
            </button>
          </form>
        </div>

      </div>
    </GovernmentLayout>
  );
};
