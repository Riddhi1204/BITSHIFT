import { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Zap,
  Sliders,
  Calendar,
  Compass,
  FileCheck
} from 'lucide-react';
import { BLOOD_GROUPS_DATA, SHAP_FACTORS } from '../data/mockData';

export const PredictionSection = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('O-');
  const [horizon, setHorizon] = useState<string>('7d');
  const [whatIfDemandSurge, setWhatIfDemandSurge] = useState<number>(0);
  const [whatIfDonationBoost, setWhatIfDonationBoost] = useState<number>(0);

  const baseData = BLOOD_GROUPS_DATA[selectedGroup] || BLOOD_GROUPS_DATA['O-'];
  
  // Calculate dynamic simulated risk score
  const dynamicRisk = Math.min(100, Math.max(5, Math.round(baseData.shortageRisk + (whatIfDemandSurge * 0.4) - (whatIfDonationBoost * 0.35))));
  const isCritical = dynamicRisk >= 75;
  const isModerate = dynamicRisk >= 50 && dynamicRisk < 75;

  const analysisFactors = [
    { title: 'Historical blood demand', icon: Calendar, desc: 'Rolling 30-day mean & seasonality' },
    { title: 'Blood-group availability', icon: Layers, desc: 'Real-time component breakdown' },
    { title: 'Emergency cases', icon: AlertCircle, desc: 'Trauma alerts & surgical schedules' },
    { title: 'Seasonal patterns', icon: TrendingUp, desc: 'Holidays & monsoon disease spikes' },
    { title: 'Donation trends', icon: Sparkles, desc: 'Active donor pool engagement rate' },
    { title: 'Hospital requirements', icon: Zap, desc: 'Inpatient clinical demand projections' },
    { title: 'Regional demand', icon: Compass, desc: 'Cross-district supply-chain balance' },
    { title: 'Current inventory', icon: FileCheck, desc: 'Opening, reserved & near-expiry units' },
  ];

  return (
    <section id="prediction" className="py-24 bg-gradient-to-b from-[#0B1220] via-[#0F172A] to-[#111827] text-white relative overflow-hidden">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Machine Learning Forecasting Layer
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI-Powered Blood Shortage Prediction
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            HemoVite leverages dual-layer Gradient Boosted models (XGBoost & LightGBM) with SHAP explainability to anticipate stock depletion and coordinate preemptive donor responses.
          </p>
        </div>

        {/* 8 FEATURE FACTORS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
          {analysisFactors.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">{factor.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{factor.desc}</p>
              </div>
            );
          })}
        </div>

        {/* MAIN INTERACTIVE PREDICTION DASHBOARD CONTAINER */}
        <div className="bg-[#111827]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
          
          {/* DASHBOARD TOP BAR CONTROLS */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            
            {/* BLOOD GROUP SELECTOR */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Blood Group</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(BLOOD_GROUPS_DATA).map((groupKey) => (
                  <button
                    key={groupKey}
                    onClick={() => setSelectedGroup(groupKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedGroup === groupKey
                        ? 'bg-brand-red text-white ring-2 ring-brand-red/50 shadow-md scale-105'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {BLOOD_GROUPS_DATA[groupKey].group}
                  </button>
                ))}
              </div>
            </div>

            {/* HORIZON SELECTOR */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Forecast Horizon</span>
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                {[
                  { label: '+1 Day', val: '1d' },
                  { label: '+3 Days', val: '3d' },
                  { label: '+7 Days', val: '7d' },
                  { label: '+14 Days', val: '14d' },
                  { label: '+30 Days', val: '30d' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setHorizon(item.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      horizon === item.val
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 4 CORE PREDICTION METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Risk Score */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Shortage Risk Score</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="text-4xl font-black text-white mt-2 flex items-baseline gap-2">
                <span>{dynamicRisk}%</span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                  isCritical ? 'bg-red-950 text-red-400 border border-red-800' : isModerate ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Low'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Confidence: <strong className="text-white">99.4%</strong> (Calibrated F1: 0.94)
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5">
              <div className="text-xs text-slate-400">Predicted Shortage</div>
              <div className="text-3xl font-black text-brand-bright mt-2">
                {baseData.group} Blood
              </div>
              <div className="text-[11px] text-slate-300 mt-2">
                Current Stock: <strong className="text-white">{baseData.currentUnits} Units</strong> (Req: {baseData.predictedDemand})
              </div>
            </div>

            {/* Expected Shortage */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5">
              <div className="text-xs text-slate-400">Expected Shortage Window</div>
              <div className="text-3xl font-black text-amber-400 mt-2">
                Within {baseData.expectedDays} Days
              </div>
              <div className="text-[11px] text-slate-300 mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> T-minus countdown active
              </div>
            </div>

            {/* Action State */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5">
              <div className="text-xs text-slate-400">Action Queue Status</div>
              <div className="text-xl font-bold text-white mt-2 flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-blue-400" /> Auto-Triage Ready
              </div>
              <div className="text-[11px] text-slate-300 mt-2">
                Awaiting authorized coordinator sign-off
              </div>
            </div>

          </div>

          {/* CHARTS + SHAP EXPLAINABILITY ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: DEMAND VS RESERVE CHART (BLUE & RED) */}
            <div className="lg:col-span-7 bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Demand vs. Stock Forecasting Curve</h4>
                  <p className="text-xs text-slate-400">Historical Actuals + 7-Day ML Prediction Horizon</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-300">Predicted Demand (AI)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-300">Reserve Stock</span>
                  </span>
                </div>
              </div>

              {/* SVG COMPREHENSIVE CHART */}
              <div className="h-56 w-full pt-4 relative">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[30, 70, 110, 150].map((y) => (
                    <line key={y} x1="30" y1={y} x2="490" y2={y} stroke="#1E293B" strokeDasharray="4,4" strokeWidth="1" />
                  ))}

                  {/* Critical Safety Zone Band */}
                  <rect x="30" y="125" width="460" height="40" fill="rgba(220, 38, 38, 0.12)" />
                  <line x1="30" y1="125" x2="490" y2="125" stroke="#EF4444" strokeDasharray="3,3" strokeWidth="1" />
                  <text x="35" y="137" fill="#F87171" fontSize="9" fontWeight="bold">EMERGENCY SAFETY THRESHOLD (20 Units)</text>

                  {/* Left Axis Labels */}
                  <text x="5" y="34" fill="#64748B" fontSize="9">80U</text>
                  <text x="5" y="74" fill="#64748B" fontSize="9">60U</text>
                  <text x="5" y="114" fill="#64748B" fontSize="9">40U</text>
                  <text x="5" y="154" fill="#64748B" fontSize="9">20U</text>

                  {/* Vertical Forecast Divider */}
                  <line x1="230" y1="20" x2="230" y2="165" stroke="#3B82F6" strokeDasharray="2,2" strokeWidth="1.5" />
                  <text x="170" y="176" fill="#94A3B8" fontSize="9">Historical</text>
                  <text x="240" y="176" fill="#60A5FA" fontSize="9" fontWeight="bold">AI Forecast →</text>

                  {/* Blue Demand Line (Blue for prediction data) */}
                  <path
                    d="M 30,120 L 80,110 L 130,115 L 180,95 L 230,80 L 290,65 L 350,50 L 410,38 L 480,28"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3"
                  />

                  {/* Red Reserve Stock Line (Red for risk indicators) */}
                  <path
                    d={isCritical 
                      ? "M 30,80 L 80,85 L 130,90 L 180,105 L 230,120 L 290,135 L 350,148 L 410,158 L 480,165"
                      : "M 30,60 L 80,62 L 130,65 L 180,70 L 230,75 L 290,80 L 350,85 L 410,90 L 480,95"
                    }
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="3"
                  />

                  {/* Highlight Intersect Risk Point */}
                  <circle cx="290" cy={isCritical ? "135" : "80"} r="6" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="290" cy="65" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>

              {/* WHAT-IF SIMULATOR SLIDERS */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" /> Interactive What-If Scenario Simulator
                  </span>
                  <span className="text-[11px] text-slate-400">Re-runs FastAPI inference instantly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Emergency Demand Surge Slider */}
                  <div className="bg-white/5 p-3 rounded-xl">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Simulate Trauma / Demand Surge:</span>
                      <strong className="text-red-400">+{whatIfDemandSurge}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={whatIfDemandSurge}
                      onChange={(e) => setWhatIfDemandSurge(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Donation Drive Boost Slider */}
                  <div className="bg-white/5 p-3 rounded-xl">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Simulate Emergency Donation Drive:</span>
                      <strong className="text-emerald-400">+{whatIfDonationBoost}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={whatIfDonationBoost}
                      onChange={(e) => setWhatIfDonationBoost(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: SHAP EXPLAINABILITY & RECOMMENDED ACTION */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* RECOMMENDED ACTION CARD */}
              <div className="bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-500/30 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                  <Zap className="w-4 h-4" /> Recommended Action
                </div>
                <p className="text-sm font-semibold text-white leading-snug">
                  {baseData.recommendation}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Model: risk-v3.2</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Rule Guardrail Verified
                  </span>
                </div>
              </div>

              {/* SHAP EXPLAINABILITY CARD */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    SHAP Factor Contributions
                  </h4>
                  <span className="text-[10px] text-blue-400 font-mono">Why risk changed</span>
                </div>

                <div className="space-y-2.5">
                  {SHAP_FACTORS.map((factor, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{factor.name}</span>
                        <span className={`font-mono font-bold ${
                          factor.direction === 'up' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {factor.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
