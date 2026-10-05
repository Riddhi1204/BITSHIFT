import React from 'react';
import { Cpu, Activity, AlertOctagon, HeartHandshake } from 'lucide-react';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Prediction',
      desc: 'Forecasts 7–30 day shortages with 99.4% accuracy',
      color: 'text-brand-blue',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      icon: Activity,
      title: 'Real-Time Availability',
      desc: 'Live stock telemetry across 230+ network facilities',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      icon: AlertOctagon,
      title: 'Emergency Blood Requests',
      desc: 'Priority routing & hospital-verified fast escalation',
      color: 'text-brand-bright',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    {
      icon: HeartHandshake,
      title: 'Smart Donor Connection',
      desc: 'Targeted FCM broadcasts based on proximity & type',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
  ];

  return (
    <div className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-4 ${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
