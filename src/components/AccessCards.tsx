import { Building2, Droplet, Landmark, User, ArrowRight, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../types';

interface AccessCardsProps {
  onSelectRole: (role: UserRole) => void;
}

export const AccessCards = ({ onSelectRole }: AccessCardsProps) => {
  const roles = [
    {
      id: 'hospital' as UserRole,
      title: 'Hospital',
      desc: 'Manage blood requirements, inventory and emergency requests.',
      icon: Building2,
      tag: 'Clinical Command',
      iconColor: 'text-brand-red',
      iconBg: 'bg-red-50',
    },
    {
      id: 'blood_bank' as UserRole,
      title: 'Blood Bank',
      desc: 'Monitor inventory, donations and blood availability.',
      icon: Droplet,
      tag: 'Reserve Hub',
      iconColor: 'text-brand-bright',
      iconBg: 'bg-red-50',
    },
    {
      id: 'government' as UserRole,
      title: 'Government',
      desc: 'Monitor regional blood supply and shortage risks.',
      icon: Landmark,
      tag: 'State Oversight',
      iconColor: 'text-brand-blue',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'citizen' as UserRole,
      title: 'Citizen',
      desc: 'Find blood, request blood or become a donor.',
      icon: User,
      tag: 'Public Network',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
  ];

  return (
    <section id="access" className="py-20 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-brand-red text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role-Based Portals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Select your Access
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Choose your role to access the BloodGuard AI platform.
          </p>
        </div>

        {/* 2-COLUMN GRID OF ROLE-BASED PORTALS (FULL WIDTH, BALANCED & CENTERED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className="access-tile-card group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-card-soft hover:shadow-glow-wine flex flex-col justify-between relative overflow-hidden transition-all duration-300"
              >
                {/* SUBTLE TOP ACCENT LINE */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-white/30 transition-colors" />

                <div className="space-y-4">
                  {/* ICON & BADGE ROW */}
                  <div className="flex items-center justify-between">
                    <div className={`tile-icon-bg w-14 h-14 rounded-2xl ${role.iconBg} flex items-center justify-center transition-all duration-300 shadow-sm`}>
                      <Icon className={`tile-icon-wrap w-7 h-7 ${role.iconColor} transition-colors duration-300`} />
                    </div>

                    <span className="tile-desc text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-100 transition-colors bg-slate-50 px-2.5 py-1 rounded-full group-hover:bg-white/10">
                      {role.tag}
                    </span>
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="tile-title text-xl font-black text-slate-900 transition-colors duration-300">
                      {role.title}
                    </h3>
                    <p className="tile-desc text-sm text-slate-600 leading-relaxed transition-colors duration-300">
                      {role.desc}
                    </p>
                  </div>
                </div>

                {/* BOTTOM ACTION ROW */}
                <div className="pt-6 mt-6 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between transition-colors">
                  <span className="tile-desc text-xs font-bold text-slate-700 group-hover:text-white transition-colors">
                    Access Portal
                  </span>
                  
                  <div className="tile-arrow-bg w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                    <ArrowRight className="tile-arrow w-4 h-4 text-slate-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
