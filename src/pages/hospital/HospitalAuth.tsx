import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { hospitalApi } from '../../services/hospitalApi';
import type { Hospital } from '../../types';

export const HospitalAuth = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('Admin@2026');

  // Register form state
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (!hospitalId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setFetchError(null);

    hospitalApi.getById(hospitalId)
      .then((res: any) => {
        if (!isMounted) return;
        if (res && res.id) {
          setHospital(res);
          setLoginEmail(res.email || '');
        } else {
          const mock = REGISTERED_HOSPITALS.find((h) => h.id === hospitalId);
          if (mock) {
            setHospital(mock);
            setLoginEmail(mock.email || '');
          } else {
            setFetchError('Hospital facility not found');
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const mock = REGISTERED_HOSPITALS.find((h) => h.id === hospitalId);
        if (mock) {
          setHospital(mock);
          setLoginEmail(mock.email || '');
        } else {
          setFetchError(err.message || 'Failed to connect to backend service');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hospitalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Loading Hospital Portal...</h2>
          <p className="text-xs text-slate-400">Verifying hospital credentials with central registry...</p>
        </div>
      </div>
    );
  }

  // INVALID HOSPITAL ID ERROR STATE
  if (fetchError || !hospital) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 text-brand-bright flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Hospital Not Found</h2>
            <p className="text-sm text-slate-400">
              The hospital identifier <strong className="text-red-400 font-mono">"{hospitalId}"</strong> does not match any registered facility in the HemoVite network.
            </p>
            <p className="text-xs text-slate-500">
              Please return to the registered hospitals list and select a valid hospital.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/hospitals"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Registered Hospitals</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staffSession = {
      id: `hosp_admin_${Date.now()}`,
      name: hospital.name + ' Administrator',
      email: loginEmail,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
    };
    localStorage.setItem('hemovite_hospital_staff', JSON.stringify(staffSession));
    localStorage.setItem('hemovite_role', 'hospital_staff');
    window.dispatchEvent(new Event('hemovite_auth_changed'));

    triggerToast(`Authenticated as Administrator for ${hospital.name}!`);
    setTimeout(() => {
      navigate(`/hospital/${hospital.id}/dashboard`);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }
    setRegError(null);

    const staffSession = {
      id: `hosp_admin_${Date.now()}`,
      name: adminName || hospital.name + ' Administrator',
      email: adminEmail,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
    };
    localStorage.setItem('hemovite_hospital_staff', JSON.stringify(staffSession));
    localStorage.setItem('hemovite_role', 'hospital_staff');
    window.dispatchEvent(new Event('hemovite_auth_changed'));

    triggerToast(`Registration submitted for ${hospital.name}! Redirecting to dashboard...`);
    setTimeout(() => {
      navigate(`/hospital/${hospital.id}/dashboard`);
    }, 800);
  };

  const fillDemoCredentials = () => {
    setLoginEmail(hospital.email || 'admin@hospital.org');
    setLoginPassword('HemoVite@2026');
    triggerToast('Demo administrator credentials filled in!');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative overflow-x-hidden">
      
      {/* BACKGROUND AMBIENT ACCENTS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10">
        <Link
          to="/hospitals"
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Switch Hospital</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-red flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Hemo<span className="text-brand-bright">Vite</span>
          </span>
        </div>
      </header>

      {/* MAIN AUTH CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="w-full max-w-xl bg-[#111827]/95 border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* HOSPITAL IDENTITY BANNER */}
          <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-lg shadow-brand-red/30 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {hospital.name}
                  </h2>
                  <p className="text-xs text-red-300 font-medium">
                    Hospital Administrator Portal
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-red-600/30 border border-red-500/40 text-red-200">
                {hospital.id}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>📍 {hospital.city}, {hospital.state}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Node
              </span>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Administrator Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Admin
            </button>
          </div>

          {/* LOGIN TAB CONTENT */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-200">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Hospital Administrator Email</span>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-normal flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Fill Demo Admin
                  </button>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@hospital.org"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Administrator Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-brand-red focus:ring-brand-red h-4 w-4"
                  />
                  <span>Remember my session</span>
                </label>

                <button
                  type="button"
                  onClick={() => triggerToast(`Password reset link dispatched to ${loginEmail || hospital.email}`)}
                  className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/50 hover:shadow-brand-red/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Login to {hospital.name} Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          )}

          {/* REGISTER TAB CONTENT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-200">
              
              {regError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* PRE-FILLED & LOCKED HOSPITAL NAME & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" /> Hospital Name (Locked)
                  </span>
                  <input
                    type="text"
                    disabled
                    value={hospital.name}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-slate-200 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" /> Hospital ID (Locked)
                  </span>
                  <input
                    type="text"
                    disabled
                    value={hospital.id}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono font-bold text-red-300 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Administrator Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Administrator Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Dr. S. K. Sinha"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Administrator Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@rajhospital.org"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Official Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 94311 00000"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Create Password *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Confirm Password *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/50 hover:shadow-brand-red/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Register Administrator Account</span>
              </button>

            </form>
          )}

          {/* GOOGLE AUTH DIVIDER & BUTTON */}
          <div className="pt-2 space-y-4">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Or Staff Single Sign-On
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <GoogleSignInButton
              role="hospital_staff"
              facilityId={hospital.id}
              returnUrl={`/hospital/${hospital.id}/dashboard`}
              label="Continue with Google (Hospital Staff)"
              variant="light"
            />
          </div>

        </div>
      </main>

    </div>
  );
};
