import { AlertCircle, Search, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface EmergencySectionProps {
  onOpenEmergency: () => void;
  onOpenFinder: () => void;
}

export const EmergencySection = ({ onOpenEmergency, onOpenFinder }: EmergencySectionProps) => {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      
      {/* CONTROLLED WINE-RED ACCENT GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/80 via-brand-red/70 to-slate-900/95 opacity-90" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-red/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT TEXT & TRUST BADGES */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>24/7 Rapid Emergency Response Network</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Need Blood Urgently?
              </h2>

              <p className="text-base sm:text-lg text-red-50 max-w-2xl font-normal leading-relaxed">
                Find available blood resources and connect with verified donors or blood banks near you.
              </p>

              {/* LIVE NETWORK SPECS */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-300" /> Average Match Time: &lt; 9 Mins
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Doctor/Hospital Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-300" /> Geofenced Radius Routing
                </span>
              </div>

            </div>

            {/* RIGHT BUTTONS */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              
              <button
                onClick={onOpenEmergency}
                className="w-full px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-brand-deep font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                <AlertCircle className="w-5 h-5 text-brand-red group-hover:scale-110 transition-transform" />
                <span>Request Blood</span>
              </button>

              <button
                onClick={onOpenFinder}
                className="w-full px-6 py-4 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/30 font-bold text-base backdrop-blur-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5 text-blue-400" />
                <span>Find Blood</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-[11px] text-red-100/80">
                  National Blood Helpline: <strong className="text-white">+91 1800-BLOOD-911</strong> (Toll Free)
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
