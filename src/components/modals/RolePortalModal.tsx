import { useState } from 'react';
import { 
  X, 
  Building2, 
  Droplet, 
  Landmark, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Plus 
} from 'lucide-react';
import type { UserRole } from '../../types';

interface RolePortalModalProps {
  role: UserRole | null;
  onClose: () => void;
}

export const RolePortalModal = ({ role, onClose }: RolePortalModalProps) => {
  if (!role) return null;

  const [activeRole, setActiveRole] = useState<UserRole>(role);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'demo_dashboard'>('demo_dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Hospital simulated states
  const [hospBloodGroup, setHospBloodGroup] = useState('O-');
  const [hospUnits, setHospUnits] = useState('4');

  // Citizen simulated donor state
  const [donorRegistered, setDonorRegistered] = useState(false);

  const roleMeta = {
    hospital: {
      title: 'Hospital Clinical Portal',
      subtitle: 'Manage ward blood requirements, EHR sync, and inter-facility transfers.',
      icon: Building2,
      color: 'text-brand-red',
      badge: 'Hospital / Trauma Center',
      bgGradient: 'from-red-950/40 via-slate-900 to-slate-900',
    },
    blood_bank: {
      title: 'Blood Bank Command System',
      subtitle: 'Monitor live unit stock, cold-chain temperature, expiry alerts, and camp drives.',
      icon: Droplet,
      color: 'text-brand-bright',
      badge: 'Regional Transfusion Hub',
      bgGradient: 'from-red-950/40 via-slate-900 to-slate-900',
    },
    government: {
      title: 'Government Health Administration',
      subtitle: 'State & district level surveillance, shortage forecasts, and reserve allocations.',
      icon: Landmark,
      color: 'text-brand-blue',
      badge: 'Ministry / State Authority',
      bgGradient: 'from-blue-950/40 via-slate-900 to-slate-900',
    },
    citizen: {
      title: 'Citizen & Voluntary Donor Hub',
      subtitle: 'Request emergency units, check donor eligibility, and receive localized emergency alerts.',
      icon: User,
      color: 'text-emerald-500',
      badge: 'Citizen Access',
      bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
    },
  };

  const currentMeta = roleMeta[activeRole];
  const Icon = currentMeta.icon;

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0B1220] border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-white relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOAST ALERT */}
        {successToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* MODAL HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${currentMeta.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-none">{currentMeta.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {currentMeta.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentMeta.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ROLE SWITCHER TABS */}
        <div className="px-6 pt-4 flex items-center justify-between gap-2 border-b border-white/10 bg-black/30 overflow-x-auto">
          <div className="flex items-center gap-2">
            {(['hospital', 'blood_bank', 'government', 'citizen'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
                  activeRole === r
                    ? 'bg-[#111827] text-white border-white/20 -mb-px'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                {r === 'hospital' ? 'Hospital' : r === 'blood_bank' ? 'Blood Bank' : r === 'government' ? 'Government' : 'Citizen / Donor'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pb-2">
            <button
              onClick={() => setAuthMode('demo_dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                authMode === 'demo_dashboard' ? 'bg-brand-red text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Live Demo Mode
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-brand-blue text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Account Login
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* DEMO DASHBOARD VIEW */}
          {authMode === 'demo_dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* 1. HOSPITAL VIEW */}
              {activeRole === 'hospital' && (
                <div className="space-y-6">
                  {/* Quick stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <div className="text-[11px] text-slate-400">Emergency Units in ICU Reserve</div>
                      <div className="text-2xl font-black text-white mt-1">24 Units</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">3 Units incoming via transfer</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <div className="text-[11px] text-slate-400">Active Shortage Warning</div>
                      <div className="text-2xl font-black text-red-400 mt-1">O− Critical (4 Days)</div>
                      <div className="text-[10px] text-red-300 mt-0.5">Auto-transfer recommendation ready</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <div className="text-[11px] text-slate-400">EHR Feed Status</div>
                      <div className="text-2xl font-black text-blue-400 mt-1">Synced (HL7)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Last payload 42 seconds ago</div>
                    </div>
                  </div>

                  {/* Place Fast Order Form */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-brand-red" />
                      Create Direct Emergency Requisition / Inter-Facility Request
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Blood Group</label>
                        <select
                          value={hospBloodGroup}
                          onChange={(e) => setHospBloodGroup(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                        >
                          {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Required Units</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={hospUnits}
                          onChange={(e) => setHospUnits(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => triggerToast(`Emergency requisition of ${hospUnits} units of ${hospBloodGroup} broadcasted to nearby blood banks.`)}
                          className="w-full py-2 bg-gradient-to-r from-brand-red to-brand-deep text-white font-bold text-xs rounded-xl shadow hover:brightness-110 transition-all"
                        >
                          Broadcast Requisition
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. BLOOD BANK VIEW */}
              {activeRole === 'blood_bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">Total Whole Blood</div>
                      <div className="text-xl font-bold text-white">412 Units</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">Platelet Concentrates</div>
                      <div className="text-xl font-bold text-white">88 Units</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">Expiring &lt; 48h</div>
                      <div className="text-xl font-bold text-amber-400">6 Units</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">Cold Chain Temp</div>
                      <div className="text-xl font-bold text-emerald-400">+3.8°C (Optimal)</div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Proactive Redistribution Queue</span>
                      <span className="text-blue-400">AI Suggested</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Transfer 4 Units O−</span>
                          <p className="text-[11px] text-slate-400">From Red Cross Central → Safdarjung Hospital (High Risk Zone)</p>
                        </div>
                        <button
                          onClick={() => triggerToast('Transfer dispatch approved! Driver dispatched via cold-chain carrier.')}
                          className="px-3 py-1.5 bg-brand-red text-white font-semibold rounded-lg text-xs hover:bg-red-600"
                        >
                          Approve Transfer
                        </button>
                      </div>

                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Schedule Mobile Donation Van</span>
                          <p className="text-[11px] text-slate-400">Target Area: Cyber Hub Tech Park (Est. 45 Donors)</p>
                        </div>
                        <button
                          onClick={() => triggerToast('Mobile Van Camp Notification scheduled and registered on citizen app!')}
                          className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-500"
                        >
                          Launch Camp Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. GOVERNMENT ADMINISTRATOR VIEW */}
              {activeRole === 'government' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">State Reserve Buffer</div>
                      <div className="text-2xl font-black text-white mt-0.5">84.6% Safe</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">High Risk Districts</div>
                      <div className="text-2xl font-black text-amber-400 mt-0.5">2 of 11 Districts</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[11px] text-slate-400">Compliance Audit</div>
                      <div className="text-2xl font-black text-emerald-400 mt-0.5">100% Verified</div>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Regional District Heatmap Surveillance</span>
                      <span className="text-emerald-400">Real-time Telemetry Grid</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl flex justify-between items-center">
                        <div>
                          <strong className="text-red-300">Central District</strong>
                          <p className="text-[10px] text-slate-400">O− Shortage Prob: 82%</p>
                        </div>
                        <button
                          onClick={() => triggerToast('Central District emergency reallocation triggered.')}
                          className="px-2.5 py-1 bg-red-700 text-white rounded text-[11px] font-bold"
                        >
                          Intervene
                        </button>
                      </div>

                      <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex justify-between items-center">
                        <div>
                          <strong className="text-emerald-300">South-West District</strong>
                          <p className="text-[10px] text-slate-400">Stable Surplus (108% Target)</p>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold">Optimal</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. CITIZEN / DONOR VIEW */}
              {activeRole === 'citizen' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-white text-sm">Citizen Voluntary Donor Card</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        {donorRegistered ? 'Active Verified Donor' : 'Eligibility: Ready'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Join the emergency volunteer response pool. You will only be alerted via push notification when a verified hospital in your vicinity experiences a severe shortage of your matching blood group.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {donorRegistered ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Registered as O+ Donor • Alert Radius 10 km Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDonorRegistered(true);
                            triggerToast('Thank you! You are now enrolled in the BloodGuard AI Emergency Volunteer Network.');
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>1-Tap Enroll as Volunteer Donor</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* AUTH LOGIN / REGISTER VIEW */}
          {authMode !== 'demo_dashboard' && (
            <div className="max-w-md mx-auto space-y-4 py-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-white">
                  {authMode === 'login' ? `Login to ${currentMeta.title}` : `Register ${currentMeta.title}`}
                </h4>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' ? 'Enter your authorized institutional credentials.' : 'Apply for institutional verification.'}
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Authentication successful for ${currentMeta.title}!`);
                setAuthMode('demo_dashboard');
              }} className="space-y-3">
                
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Institutional Email / Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@institution.health.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Security Key / Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brand-red to-brand-deep text-white font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
                >
                  {authMode === 'login' ? 'Sign In & Access Live Node' : 'Submit Registration for Verification'}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  {authMode === 'login' ? "Don't have an institutional account? Register" : "Already registered? Sign In"}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
