import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Landmark,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  MapPin,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BadgeAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  FileBadge
} from 'lucide-react';
import { DEFAULT_GOV_USER } from '../../data/mockData';
import type { GovernmentUser } from '../../types';

export const GovernmentAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterInitial = location.pathname === '/government/register';

  const [tab, setTab] = useState<'login' | 'register'>(isRegisterInitial ? 'register' : 'login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('dr.sharma@health.gov.in');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('State Blood Transfusion Council (SBTC)');
  const [regDesignation, setRegDesignation] = useState('District Health Coordinator');
  const [regState, setRegState] = useState('Jharkhand');
  const [regDistrict, setRegDistrict] = useState('Ranchi');
  const [regAuthorityId, setRegAuthorityId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleAuthNotice, setGoogleAuthNotice] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi (NCT)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Helper for password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-700' };
    if (score === 2 || score === 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500 text-amber-700' };
    return { score: 3, label: 'Strong (Government Standard)', color: 'bg-emerald-500 text-emerald-700' };
  };

  const passStrength = getPasswordStrength(regPassword);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both your official government email and password.');
      return;
    }

    if (!loginEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Create authenticated government session
      const userToStore: GovernmentUser = {
        ...DEFAULT_GOV_USER,
        email: loginEmail,
      };

      localStorage.setItem('hemovite_gov_user', JSON.stringify(userToStore));
      setLoading(false);
      navigate('/government/dashboard');
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Required Field Validations
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regDept.trim() || !regDesignation.trim() || !regDistrict.trim() || !regPassword) {
      setErrorMsg('Please fill in all required official registration fields.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMsg('Please provide a valid official government or department email address.');
      return;
    }

    if (regPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile contact number.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long and meet official security guidelines.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password entry.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // New registered user has verification status "Pending Verification"
      const newUser: GovernmentUser = {
        id: `GOV-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        name: regName,
        email: regEmail,
        phone: regPhone,
        department: regDept,
        state: regState,
        district: regDistrict,
        designation: regDesignation,
        authorityId: regAuthorityId.trim() || `AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
        role: 'state_admin',
        verificationStatus: 'Pending Verification',
      };

      localStorage.setItem('hemovite_gov_user', JSON.stringify(newUser));
      setLoading(false);
      setSuccessMsg('Official registration submitted! Redirecting to your Government Command Grid...');
      
      setTimeout(() => {
        navigate('/government/dashboard');
      }, 1200);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setGoogleAuthNotice(true);
    setTimeout(() => {
      // Simulate Google OAuth completion
      localStorage.setItem('hemovite_gov_user', JSON.stringify(DEFAULT_GOV_USER));
      navigate('/government/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-red selection:text-white font-sans">
      
      {/* ======================================================== */}
      {/* 1. PROFESSIONAL DARK NAVY GOVERNMENT HEADER              */}
      {/* ======================================================== */}
      <header className="bg-[#0B1120] border-b border-slate-800 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO & TITLE */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">
                  HemoVite
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-950/80 text-red-300 border border-red-700/50">
                  Government Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                National Blood Supply & Healthcare Intelligence Platform
              </p>
            </div>
          </Link>

          {/* BACK TO ACCESS SELECTION */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Select Access</span>
          </button>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. AUTHENTICATION WORKSPACE & MAIN CARD                  */}
      {/* ======================================================== */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md sm:max-w-xl w-full space-y-5">
          
          {/* QUICK DEMO CREDENTIALS BANNER */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>Demo Government Administrator Access</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">Pre-Filled</span>
              </div>
              <p className="text-slate-600 mt-1">
                Official Email: <code className="font-mono font-bold text-red-700">dr.sharma@health.gov.in</code> | Password: <code className="font-mono font-bold text-red-700">Admin@123</code>
              </p>
            </div>
          </div>

          {/* MAIN AUTHENTICATION CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* CARD HEADER */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-[#0F172A] text-white text-center space-y-2 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Government / Authority Access
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Access verified blood network insights, hospital verification, shortage hotspots, and regional donation analytics.
              </p>

              {/* TWO TABS: [ LOGIN ] [ REGISTER ] */}
              <div className="pt-4 flex items-center justify-center">
                <div className="p-1 bg-slate-800/90 rounded-2xl border border-slate-700 flex w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tab === 'login'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tab === 'register'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            {/* ERROR ALERT */}
            {errorMsg && (
              <div className="mx-6 sm:mx-8 mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SUCCESS ALERT */}
            {successMsg && (
              <div className="mx-6 sm:mx-8 mt-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* GOOGLE OAUTH POPUP SIMULATION */}
            {googleAuthNotice && (
              <div className="mx-6 sm:mx-8 mt-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span>Connecting with Government Google Single Sign-On (SSO)...</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Email / Government ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. dr.sharma@health.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 bg-slate-50/50 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/government/forgot-password"
                      className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-slate-900 bg-slate-50/50 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Officer...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* DIVIDER */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Continue With
                  </span>
                </div>

                {/* GOOGLE SIGN IN BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
                
                {/* OFFICIAL NOTICE CALLOUT */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Official Government Account Registration. New accounts will be assigned <strong>"Pending Verification"</strong> status until formal administrative audit.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Riddhi Kumari"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Official Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="officer@health.gov.in"
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98101 23456"
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Government Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        placeholder="e.g. Health Department"
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="e.g. District Health Coordinator"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                    />
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        placeholder="e.g. Ranchi"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Government Authority ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Government ID / Authority ID
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Optional</span>
                  </div>
                  <div className="relative">
                    <FileBadge className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regAuthorityId}
                      onChange={(e) => setRegAuthorityId(e.target.value)}
                      placeholder="e.g. GOV-JH-2026-991"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-mono"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Password strength indicator */}
                {regPassword && (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Password Security Rating:</span>
                      <span className="font-bold">{passStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering Authority Account...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Government Registration</span>
                    </>
                  )}
                </button>

                {/* GOOGLE SIGN IN BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

          </div>

          <p className="text-center text-xs text-slate-500">
            Authorized government personnel only. All access is logged under the National Digital Health Mission framework.
          </p>

        </div>
      </div>

    </div>
  );
};
