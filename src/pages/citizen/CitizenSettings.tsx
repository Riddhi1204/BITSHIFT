import { Settings, Bell, Shield, Droplet, Save } from 'lucide-react';

export const CitizenSettings = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">

      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-slate-400" />
          Settings
        </h2>

        <div className="space-y-8">
          {/* NOTIFICATIONS */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Emergency blood requests near me', desc: 'Get notified about critical requests in your area' },
                { label: 'Donation eligibility reminder', desc: 'Remind me when I can donate again' },
                { label: 'Blood availability updates', desc: 'Updates on blood stock at nearby hospitals' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    className="relative w-11 h-6 bg-brand-red rounded-full transition-colors shrink-0"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BLOOD & DONATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Droplet className="w-3.5 h-3.5" /> Blood & Donation
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Available as emergency donor', desc: 'Allow hospitals to contact me in emergencies', on: true },
                { label: 'Show my profile in donor search', desc: 'Appear in blood seeker search results', on: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.on ? 'bg-brand-red' : 'bg-slate-700'}`}
                    role="switch"
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.on ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PRIVACY */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Privacy
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Share location for better matching', desc: 'Helps find blood and donors faster', on: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.on ? 'bg-brand-red' : 'bg-slate-700'}`}
                    role="switch"
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.on ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button className="px-6 py-3 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-red/20">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

    </div>
  );
};
