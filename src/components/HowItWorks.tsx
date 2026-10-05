import React from 'react';
import { Database, Cpu, BellRing, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect Data',
      desc: 'Real-time telemetry ingestion from hospital EHRs, blood banks, and verified donor registry pools.',
      icon: Database,
      badge: 'Continuous Sync',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      num: '02',
      title: 'AI Predicts Demand',
      desc: 'Gradient boosted models forecast 7–30 day shortage trajectories accounting for seasonal dips and trauma trends.',
      icon: Cpu,
      badge: 'ML Engine',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      num: '03',
      title: 'Generate Early Warning',
      desc: 'Multi-tiered risk classification flags impending deficits 4–5 days before inventories hit emergency thresholds.',
      icon: BellRing,
      badge: 'Zero False-Alarms',
      color: 'text-brand-red',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      num: '04',
      title: 'Coordinate Blood Resources',
      desc: 'Automates inter-hospital transfers and triggers targeted FCM push alerts to verified nearby eligible donors.',
      icon: HeartHandshake,
      badge: 'Rapid Response',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            End-to-End Coordination
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How BloodGuard AI Works
          </h2>
          <p className="text-base text-slate-600">
            A continuous four-stage lifecycle from raw clinical telemetry to life-saving rapid coordination.
          </p>
        </div>

        {/* 4 STEPS CONNECTED WITH FLOW LINE */}
        <div className="relative">
          
          {/* DESKTOP CONNECTING HORIZONTAL LINE */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 and via-red-200 to-emerald-200 -translate-y-8 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card-soft hover:shadow-card-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* NUMBER & ICON ROW */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black font-mono text-slate-300">
                        {step.num}
                      </span>
                      <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.border} border flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {step.badge}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM STEP PROGRESS */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Phase {idx + 1} of 4</span>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
