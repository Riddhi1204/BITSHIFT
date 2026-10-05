import { useState, useEffect } from 'react';
import { X, Droplet, Heart, Mail, Lock, User, MapPin, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenAuthModal = ({ isOpen, onClose }: CitizenAuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const { loginCitizen } = useAuth();
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    age: '',
    location: '',
    phone: '',
  });

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      // Mock login - in a real app, verify with backend
      loginCitizen({
        name: loginEmail.split('@')[0], // fake name
        email: loginEmail
      });
      onClose();
      // Optional: navigate('/citizen/dashboard');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    loginCitizen({
      name: regData.name || 'Citizen User',
      email: regData.email
    });
    onClose();
  };

  const handleGoogleAuth = () => {
    loginCitizen({
      name: 'Google User',
      email: 'user@google.com'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* OVERLAY */}
      <div 
        className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-4xl max-h-full flex flex-col md:flex-row bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SIDE - BRANDING */}
        <div className="hidden md:flex md:w-5/12 bg-[#0B1220] flex-col p-8 justify-between relative overflow-hidden border-r border-white/5">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-brand-deep/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-brand-deep rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/30">
              <Droplet className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">HemoVite</span>
          </div>

          <div className="relative z-10 my-12 space-y-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
              <Heart className="w-6 h-6 text-brand-red animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Predict &bull; Connect &bull; Save Lives
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Access your blood donation and emergency assistance dashboard.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col relative overflow-y-auto max-h-[85vh] custom-scrollbar">
          
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">Welcome to HemoVite</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Login or create your citizen account
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-[#0B1220] p-1 rounded-xl border border-white/5 mb-6 shrink-0">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'login' 
                  ? 'bg-brand-red text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'register' 
                  ? 'bg-brand-red text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* FORMS */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 rounded-xl text-sm text-white transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 rounded-xl text-sm text-white transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    <div className="w-4 h-4 rounded-full border border-current opacity-70" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/citizen/forgot-password');
                  }} 
                  className="text-xs font-semibold text-brand-red hover:text-red-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98]"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Blood Group</label>
                  <select
                    required
                    value={regData.bloodGroup}
                    onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <input
                      type="number"
                      required
                      min={18}
                      max={65}
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      className="w-full pl-8 pr-2 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="18+"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-300 ml-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full pl-8 pr-2 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="Number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Location / City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="relative flex items-center py-4 shrink-0">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase">Or</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

        </div>

      </div>
    </div>
  );
};
