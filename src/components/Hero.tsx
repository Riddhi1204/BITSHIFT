import { useState } from 'react';
import { 
  ArrowRight, 
  Activity, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  CheckCircle2,
  BellRing,
  AlertTriangle
} from 'lucide-react';
import type { UserRole } from '../types';

interface HeroProps {
  onSelectRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
}

export const Hero = ({ onSelectRole: _onSelectRole, onOpenEmergency }: HeroProps) => {
  const [selectedGroup, setSelectedGroup] = useState<'O-' | 'B+' | 'AB-'>('O-');

  const groupData = {
    'O-': {
      stock: 18,
      demand: 42,
      risk: 82,
      status: 'Critical',
      badgeClass: 'bg-red-950 text-red-400 border-red-800',
      strokeColor: '#DC2626',
      days: '4 Days',
      action: 'Initiate buffer transfer from Apex Medical Center and send target FCM alerts to 48 verified O− donors.',
    },
    'B+': {
      stock: 95,
      demand: 80,
      risk: 19,
      status: 'Normal',
      badgeClass: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      strokeColor: '#16A34A',
      days: '14+ Days',
      action: 'Inventory healthy. Safe for cross-facility reserve redistribution.',
    },
    'AB-': {
      stock: 8,
      demand: 19,
      risk: 79,
      status: 'Critical',
      badgeClass: 'bg-red-950 text-red-400 border-red-800',
      strokeColor: '#DC2626',
      days: '3 Days',
      action: 'Contact rare blood donor registry; reserve upcoming whole-blood collection units.',
    },
  };

  const current = groupData[selectedGroup];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-16 md:pt-10 md:pb-24 bg-gradient-to-b from-[#0D1829] via-[#0E1B2E] to-[#111827] text-white overflow-hidden">
      
      {/* BACKGROUND AMBIENT GLOWS & GRID */}
      <div className="absolute inset-0 bg-hero-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[600px] h-64 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP HEALTHCARE BADGE */}
        <div className="flex items-center gap-2 mb-6">
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

        {/* 2-COLUMN HERO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN (approx 55% width on desktop): HEADLINE + DESCRIPTION + CTAS */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-bright flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-bright" />
                Next-Generation Healthcare AI
              </p>
              
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.14]">
                Smarter Blood Management. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
                  Faster Emergency Response.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              HemoVite is an intelligent blood resource coordination platform designed to predict blood shortages before they become critical. By analyzing historical demand, blood-group availability, emergency patterns, seasonal variations, donation trends, and regional requirements, the platform provides early warnings and helps healthcare organizations take proactive action.
            </p>

            {/* CTAS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
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
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">99.4% Forecast Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Verified Network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Instant Triage</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (approx 45% width on desktop): HOSPITAL SHORTAGE RISK MONITOR CARD */}
          <div className="lg:col-span-5 relative">
            
            {/* AMBIENT GLOW BEHIND DASHBOARD */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/30 to-brand-blue/20 rounded-3xl blur-2xl transform rotate-1 scale-95" />

            {/* MAIN DASHBOARD CARD */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111827]/95 to-[#0B1220]/95 border border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
              
              {/* CARD HEADER & BLOOD GROUP TOGGLE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live AI Telemetry Engine</span>
                  <h3 className="text-base sm:text-lg font-black text-white">Hospital Shortage Risk Monitor</h3>
                </div>

                {/* BLOOD GROUP SELECTOR */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                  {(['O-', 'B+', 'AB-'] as const).map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedGroup === group
                          ? 'bg-brand-red text-white shadow-sm ring-1 ring-brand-red/50'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {group === 'O-' ? 'O−' : group === 'AB-' ? 'AB−' : group}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS MATRIX */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. Blood Group */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">Blood Group</div>
                  <div className="text-lg font-black text-brand-bright mt-0.5">{selectedGroup === 'O-' ? 'O−' : selectedGroup === 'AB-' ? 'AB−' : selectedGroup}</div>
                </div>

                {/* 2. Current Stock */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">Current Stock</div>
                  <div className="text-lg font-black text-white mt-0.5">{current.stock} <span className="text-[10px] font-normal text-slate-400">Units</span></div>
                </div>

                {/* 3. Predicted Demand */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">Predicted Demand</div>
                  <div className="text-lg font-black text-blue-400 mt-0.5">{current.demand} <span className="text-[10px] font-normal text-slate-400">Units</span></div>
                </div>

                {/* 4. Shortage Risk */}
                <div className={`rounded-xl p-2.5 border ${
                  current.status === 'Critical' ? 'bg-red-950/80 border-red-600/50 text-red-400' : 'bg-emerald-950/80 border-emerald-600/50 text-emerald-400'
                }`}>
                  <div className="text-[10px] font-semibold opacity-80">Shortage Risk</div>
                  <div className="text-lg font-black mt-0.5">{current.risk}%</div>
                </div>

              </div>

              {/* RISK STATUS BANNER */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${current.status === 'Critical' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span className="font-bold">Risk: <span className={current.status === 'Critical' ? 'text-red-400' : 'text-emerald-400'}>{current.status}</span></span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Depletion: <strong className="text-white">{current.days}</strong></span>
              </div>

              {/* PREDICTION GRAPH */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">Predicted Demand Surge vs Depletion</span>
                  <span className="text-blue-400 flex items-center gap-1 text-[10px]">
                    <TrendingUp className="w-3 h-3" /> XGBoost Model v3.2
                  </span>
                </div>

                {/* VISUAL SVG GRAPH */}
                <div className="h-28 w-full relative pt-1">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />
                    
                    {/* Critical safety boundary */}
                    <rect x="0" y="65" width="300" height="35" fill="rgba(220, 38, 38, 0.15)" />
                    <text x="5" y="75" fill="#EF4444" fontSize="8" fontWeight="bold">CRITICAL DEFICIT ZONE (&lt; 20 Units)</text>

                    {/* Blue Demand Curve (Surging) */}
                    <path
                      d="M 0,65 C 60,60 120,40 180,25 S 250,15 300,10"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                    />
                    
                    {/* Red/Green Stock Curve (Depleting) */}
                    <path
                      d={selectedGroup === 'B+' 
                        ? "M 0,25 C 60,26 120,28 180,32 S 250,35 300,38" 
                        : "M 0,35 C 60,45 120,62 180,78 S 250,88 300,92"
                      }
                      fill="none"
                      stroke={current.strokeColor}
                      strokeWidth="3"
                    />

                    {/* Nodes on points */}
                    <circle cx="180" cy={selectedGroup === 'B+' ? "32" : "78"} r="4" fill={current.strokeColor} stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="180" cy="25" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* GRAPH LEGEND */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.strokeColor }} />
                      <span>Available Stock</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Projected Demand</span>
                    </span>
                  </div>
                  <span>Day 1 → Day 7</span>
                </div>
              </div>

              {/* RECOMMENDED ACTION */}
              <div className="bg-red-950/40 border border-red-600/30 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-bright flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Recommended AI Action
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {current.action}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
