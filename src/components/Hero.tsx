import { 
  ArrowRight, 
  Activity, 
  Sparkles, 
  CheckCircle2,
  BellRing
} from 'lucide-react';
import type { UserRole } from '../types';

interface HeroProps {
  onSelectRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
}

export const Hero = ({ onSelectRole: _onSelectRole, onOpenEmergency }: HeroProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-[#0B1220] via-[#0D1829] to-[#111827] text-white overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOWS & GRID */}
      <div className="absolute inset-0 bg-hero-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[600px] h-64 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* TOP HEALTHCARE BADGE */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-medium text-slate-200 shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-bright"></span>
            </span>
            <span className="font-semibold text-white">HemoVite</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Predict. Prevent. Save Lives.</span>
          </div>
        </div>

        {/* TODO: Add Announcement Banner Here */}
        <div className="w-full max-w-2xl mb-5">
          {/* Future Announcement Banner Slot */}
        </div>

        {/* HERO MAIN CONTENT */}
        <div className="space-y-6 max-w-4xl mx-auto">
          
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-bright inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-500/20">
              <Sparkles className="w-4 h-4 text-brand-bright" />
              Next-Generation Healthcare AI
            </p>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
              Smarter Blood Management. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                Faster Emergency Response.
              </span>
            </h1>
          </div>

          {/* CTAS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('access')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-semibold text-base shadow-xl shadow-red-950/50 hover:shadow-brand-red/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('prediction')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-base backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Explore Platform</span>
            </button>

            <button
              onClick={onOpenEmergency}
              className="px-4 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <BellRing className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Urgent Blood Need?</span>
            </button>
          </div>

          {/* QUICK TRUST BADGES */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-300 font-medium">99.4% Forecast Precision</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Verified Network</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Instant Triage</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
