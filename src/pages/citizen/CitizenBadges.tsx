import { useState, useEffect } from 'react';
import { Award, Lock, Trophy, Heart, Shield, Star } from 'lucide-react';
import { citizenApi } from '../../services/citizenApi';

export const CitizenBadges = () => {
  const [donationsCount, setDonationsCount] = useState(6);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    citizenApi.getDashboard()
      .then((res: any) => {
        if (!isMounted) return;
        if (res?.stats?.donated !== undefined) {
          setDonationsCount(res.stats.donated);
        } else if (res?.totalDonations !== undefined) {
          setDonationsCount(res.totalDonations);
        }
      })
      .catch((err) => {
        console.error('Failed to load citizen badge telemetry:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const badges = [
    {
      id: 'b1',
      name: 'First Drop',
      description: 'Completed 1 donation',
      required: 1,
      icon: Heart,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    {
      id: 'b2',
      name: 'Bronze Donor',
      description: 'Completed 5 donations',
      required: 5,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-900/20',
      border: 'border-amber-700/30'
    },
    {
      id: 'b3',
      name: 'Silver Donor',
      description: 'Completed 10 donations',
      required: 10,
      icon: Shield,
      color: 'text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30'
    },
    {
      id: 'b4',
      name: 'Gold Donor',
      description: 'Completed 25 donations',
      required: 25,
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30'
    },
    {
      id: 'b5',
      name: 'Life Saver',
      description: 'Completed 50 donations',
      required: 50,
      icon: Trophy,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-10 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Your Achievements</h2>
          <p className="text-sm text-slate-400 mt-2">
            Earn badges by consistently donating blood. You currently have {donationsCount} verified donation(s) in PostgreSQL records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(badge => {
            const isUnlocked = donationsCount >= badge.required;
            const Icon = badge.icon;
            
            let progress = 100;
            if (!isUnlocked) {
              progress = (donationsCount / badge.required) * 100;
            }

            return (
              <div 
                key={badge.id} 
                className={`relative overflow-hidden rounded-3xl border p-6 transition-all ${
                  isUnlocked 
                    ? `bg-slate-900/50 ${badge.border} shadow-lg` 
                    : 'bg-[#0B1220] border-white/5 opacity-70 grayscale'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 text-slate-600">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isUnlocked ? badge.bg : 'bg-slate-800'}`}>
                  <Icon className={`w-7 h-7 ${isUnlocked ? badge.color : 'text-slate-500'}`} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-1">{badge.name}</h3>
                <p className="text-xs font-medium text-slate-400 mb-6">{badge.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className={isUnlocked ? 'text-emerald-400' : 'text-slate-500'}>
                      {isUnlocked ? 'Unlocked' : 'In Progress'}
                    </span>
                    <span className="text-slate-400">
                      {Math.min(donationsCount, badge.required)} / {badge.required}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-brand-red'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
