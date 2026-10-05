import React, { useState, useEffect } from 'react';
import { HeartHandshake, Users, Building2, Droplet, Sparkles } from 'lucide-react';

export const Statistics: React.FC = () => {
  const [counts, setCounts] = useState({
    requests: 0,
    donors: 0,
    hospitals: 0,
    banks: 0,
  });

  useEffect(() => {
    // Simple animated counter effect
    const duration = 1600;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        requests: Math.floor(10 * progress),
        donors: Math.floor(25 * progress),
        hospitals: Math.floor(150 * progress),
        banks: Math.floor(80 * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          requests: 10,
          donors: 25,
          hospitals: 150,
          banks: 80,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: 'Blood Requests Supported',
      value: `${counts.requests}K+`,
      sub: 'Emergency & scheduled clinical demands fulfilled',
      icon: HeartHandshake,
      color: 'text-brand-red',
      bg: 'bg-red-50',
    },
    {
      label: 'Verified Donors',
      value: `${counts.donors}K+`,
      sub: 'Active voluntary blood donors on standby',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Partner Hospitals',
      value: `${counts.hospitals}+`,
      sub: 'Connected EHR inventory nodes nationwide',
      icon: Building2,
      color: 'text-brand-blue',
      bg: 'bg-blue-50',
    },
    {
      label: 'Blood Banks',
      value: `${counts.banks}+`,
      sub: 'Regional transfusion & reserve facilities',
      icon: Droplet,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            Demonstrated Healthcare Network Impact
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Network Reach & Reliability
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Real-time telemetry indicators across connected healthcare partners. (Simulated Demo Metrics)
          </p>
        </div>

        {/* 4 STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card-soft hover:shadow-card-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                  {stat.value}
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-2">
                  {stat.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
