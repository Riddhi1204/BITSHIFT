import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { DownloadAppCard } from './DownloadApp';

export const AboutSection = () => {
  const [selectedGroup, setSelectedGroup] = useState<'O-' | 'B+' | 'AB-'>('O-');

  const groupData = {
    'O-': {
      stock: 18,
      demand: 42,
      risk: 82,
      status: 'Critical',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      strokeColor: '#DC2626',
      days: '4 Days',
      action: 'Initiate buffer transfer from Apex Medical Center and send target FCM alerts to 48 verified O− donors.',
    },
    'B+': {
      stock: 95,
      demand: 80,
      risk: 19,
      status: 'Normal',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      strokeColor: '#16A34A',
      days: '14+ Days',
      action: 'Inventory healthy. Safe for cross-facility reserve redistribution.',
    },
    'AB-': {
      stock: 8,
      demand: 19,
      risk: 79,
      status: 'Critical',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      strokeColor: '#DC2626',
      days: '3 Days',
      action: 'Contact rare blood donor registry; reserve upcoming whole-blood collection units.',
    },
  };

  const current = groupData[selectedGroup];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      
      {/* BACKGROUND ACCENTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation Healthcare AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Smarter Blood Management. <br />
            <span className="text-brand-red">Faster Emergency Response.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            HemoVite is an intelligent blood resource coordination platform designed to predict blood shortages before they become critical. By analyzing historical demand, blood-group availability, emergency patterns, seasonal variations, donation trends, and regional requirements, the platform provides early warnings and helps healthcare organizations take proactive action.
          </p>
        </div>

        {/* 2-COLUMN MAIN CONTENT + DOWNLOAD APP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CORE CAPABILITIES & WORKFLOW */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* WORKFLOW PILL STRIP */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Core Architectural Workflow
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Step 1</div>
                  <div className="font-extrabold text-xs text-slate-900 mt-1">PREDICT</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">ML Demand</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-red-600 uppercase">Step 2</div>
                  <div className="font-extrabold text-xs text-slate-900 mt-1">ALERT</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Early Warning</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-amber-600 uppercase">Step 3</div>
                  <div className="font-extrabold text-xs text-slate-900 mt-1">CONNECT</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Hospitals/Donors</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Step 4</div>
                  <div className="font-extrabold text-xs text-slate-900 mt-1">SAVE LIVES</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Timely Supply</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Deterministic Clinical Guardrails</h4>
                    <p className="text-xs text-slate-500">Every automated transfer suggestion requires authorized clinical coordinator approval.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Multi-Facility Inventory Synchronization</h4>
                    <p className="text-xs text-slate-500">Hospitals, blood banks, and government oversight centers operate on one live telemetry pipeline.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DOWNLOAD APP COMPONENT EMBEDDED */}
            <DownloadAppCard />

          </div>

          {/* RIGHT COLUMN: INTERACTIVE AI PREDICTION CARD */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-elevated p-6 space-y-6">
              
              {/* CARD HEADER & BLOOD GROUP TOGGLE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live AI Telemetry Engine</span>
                  <h3 className="text-lg font-black text-slate-900">Hospital Shortage Risk Monitor</h3>
                </div>

                {/* BLOOD GROUP SELECTOR */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['O-', 'B+', 'AB-'] as const).map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedGroup === group
                          ? 'bg-brand-red text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {group === 'O-' ? 'O−' : group === 'AB-' ? 'AB−' : group}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS MATRIX */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* 1. Blood Group */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500 font-medium">Blood Group</div>
                  <div className="text-xl font-black text-brand-red mt-0.5">{selectedGroup === 'O-' ? 'O−' : selectedGroup === 'AB-' ? 'AB−' : selectedGroup}</div>
                </div>

                {/* 2. Current Stock */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500 font-medium">Current Stock</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{current.stock} <span className="text-xs font-normal text-slate-400">Units</span></div>
                </div>

                {/* 3. Predicted Demand */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500 font-medium">Predicted Demand</div>
                  <div className="text-xl font-black text-blue-600 mt-0.5">{current.demand} <span className="text-xs font-normal text-slate-400">Units</span></div>
                </div>

                {/* 4. Shortage Risk */}
                <div className={`rounded-xl p-3 border ${
                  current.status === 'Critical' ? 'bg-red-50 border-red-200 text-brand-red' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  <div className="text-[11px] font-semibold opacity-80">Shortage Risk</div>
                  <div className="text-xl font-black mt-0.5">{current.risk}%</div>
                </div>

              </div>

              {/* RISK STATUS BANNER */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${current.status === 'Critical' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span className="text-xs font-bold">Risk Assessment: <span className={current.status === 'Critical' ? 'text-red-400' : 'text-emerald-400'}>{current.status}</span></span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Expected Depletion: <strong className="text-white">{current.days}</strong></span>
              </div>

              {/* PREDICTION GRAPH */}
              <div className="bg-slate-900 rounded-xl p-4 text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Predicted Demand Surge vs Depletion</span>
                  <span className="text-blue-400 flex items-center gap-1 text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5" /> XGBoost Model v3.2
                  </span>
                </div>

                {/* VISUAL SVG GRAPH */}
                <div className="h-32 w-full relative pt-2">
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
                    
                    {/* Red Stock Curve (Depleting) */}
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
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: current.strokeColor }} />
                      <span>Available Stock</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Projected Demand</span>
                    </span>
                  </div>
                  <span>Day 1 → Day 7</span>
                </div>
              </div>

              {/* RECOMMENDED ACTION */}
              <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Recommended AI Action
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
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
