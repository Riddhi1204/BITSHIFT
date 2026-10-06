import { useState, useEffect } from 'react';
import { 
  X, 
  Droplet, 
  Heart, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import { authApi } from '../../services/authApi';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const CitizenAuthModal = ({ isOpen, onClose, defaultTab = 'login' }: CitizenAuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { loginCitizen } = useAuth();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, defaultTab]);

  // Handle ESC key and block body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      setSuccessMessage('Welcome back! Logging you in...');
      loginCitizen({
        id: res.user.id,
        name: res.user.fullName || loginEmail.split('@')[0],
        email: res.user.email || loginEmail,
        bloodGroup: res.user.bloodGroup,
        phone: res.user.phone,
        city: res.user.city,
        state: res.user.state,
        avatarUrl: res.user.avatarUrl,
        role: res.user.role || 'citizen',
      });

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authApi.register({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim(),
        bloodGroup: regBloodGroup,
        city: regCity.trim(),
        state: regState.trim(),
        role: 'citizen',
      });

      setSuccessMessage('Account created successfully! Welcome to HemoVite.');
      loginCitizen({
        id: res.user.id,
        name: res.user.fullName || regFullName.trim(),
        email: res.user.email || regEmail.trim(),
        bloodGroup: res.user.bloodGroup || regBloodGroup,
        phone: res.user.phone || regPhone.trim(),
        city: res.user.city || regCity.trim(),
        state: res.user.state || regState.trim(),
        role: 'citizen',
      });

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create citizen account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* BACKDROP BLUR OVERLAY */}
      <div 
        className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL CARD */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SIDE - BRANDING BANNER (DESKTOP) */}
        <div className="hidden md:flex md:w-5/12 bg-[#0B1220] flex-col p-8 justify-between relative overflow-hidden border-r border-white/5">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-56 h-56 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* LOGO */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-brand-deep rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/30">
              <Droplet className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Hemo<span className="text-brand-bright">Vite</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-brand-blue/20 text-blue-400 border border-blue-500/30 rounded-full">
                AI
              </span>
            </div>
          </div>

          {/* VALUE PROP */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Heart className="w-6 h-6 text-brand-red animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              Predict &bull; Connect &bull; Save Lives
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Join the intelligent voluntary blood donor network. Request emergency units in seconds or track your life-saving donations.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Emergency Blood Requisitions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI-Matched Nearby Available Donors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Donor Milestones & Verified Badges</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="relative z-10 text-[11px] text-slate-500">
            Encrypted & HIPAA Compliant Healthcare Protocol
          </div>
        </div>

        {/* RIGHT SIDE - FORM CONTAINER */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col relative overflow-y-auto max-h-[90vh]">
          
          {/* HEADER */}
          <div className="mb-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-brand-bright border border-red-500/20 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Citizen Portal Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Welcome to HemoVite
            </h2>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Access the Citizen & Voluntary Donor Portal
            </p>
          </div>

          {/* TABS (LOGIN / REGISTER) */}
          <div className="flex bg-[#0B1220] p-1.5 rounded-2xl border border-white/10 mb-6 shrink-0">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'login' 
                  ? 'bg-gradient-to-r from-brand-deep to-brand-red text-white shadow-lg shadow-red-900/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'register' 
                  ? 'bg-gradient-to-r from-brand-deep to-brand-red text-white shadow-lg shadow-red-900/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* ALERTS */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* GOOGLE SIGN IN */}
              <div>
                <GoogleSignInButton
                  role="citizen"
                  label="Continue with Google"
                  variant="dark"
                  fullWidth={true}
                  className="!py-3 !rounded-xl !bg-[#1E293B] hover:!bg-[#334155] !border-white/10"
                />
              </div>

              {/* DIVIDER */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-white/10" />
                <span className="px-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold">Or with email</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <Link
                    to="/citizen/forgot-password"
                    onClick={onClose}
                    className="text-xs text-brand-bright hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-deep to-brand-red hover:from-brand-red hover:to-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Citizen Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-brand-bright font-bold hover:underline ml-1"
                >
                  Create one now
                </button>
              </div>

            </form>
          )}

          {/* 2. REGISTER TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* GOOGLE SIGN IN */}
              <div>
                <GoogleSignInButton
                  role="citizen"
                  label="Continue with Google"
                  variant="dark"
                  fullWidth={true}
                  className="!py-3 !rounded-xl !bg-[#1E293B] hover:!bg-[#334155] !border-white/10"
                />
              </div>

              {/* DIVIDER */}
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-white/10" />
                <span className="px-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold">Or register with email</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Vishal Sharma"
                  className="w-full px-4 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>

              {/* EMAIL & PHONE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>

              {/* BLOOD GROUP & LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-red-400" />
                    <span>Blood Group</span>
                  </label>
                  <select
                    value={regBloodGroup}
                    onChange={(e) => setRegBloodGroup(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg} className="bg-[#111827] text-white">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="e.g. Ranchi"
                    className="w-full px-3 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    <span>State</span>
                  </label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    placeholder="e.g. Jharkhand"
                    className="w-full px-3 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD & CONFIRM PASSWORD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-deep to-brand-red hover:from-brand-red hover:to-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Citizen Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-brand-bright font-bold hover:underline ml-1"
                >
                  Login here
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default CitizenAuthModal;
