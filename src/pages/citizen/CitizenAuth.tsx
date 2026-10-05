import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, Mail, Lock, Eye, EyeOff, User, MapPin, Phone, Calendar, Heart } from 'lucide-react';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';

export const CitizenAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login logic
    if (loginEmail && loginPassword) {
      navigate('/citizen/dashboard');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy register logic
    if (regData.password === regData.confirmPassword) {
      alert("Account created successfully. Welcome to HemoVite!");
      navigate('/citizen/dashboard');
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col md:flex-row selection:bg-brand-red selection:text-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-[#111827] border-r border-white/10 flex-col p-10 justify-between relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-brand-deep/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-brand-deep rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/30">
            <Droplet className="w-7 h-7 text-white fill-white/20" />
          </div>
          <span className="text-2xl font-black tracking-tight">HemoVite</span>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-md">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8">
            <Heart className="w-8 h-8 text-brand-red animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">
            Predict &bull; Connect &bull; Save Lives
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Access your blood donation and emergency assistance dashboard. Connect with verified hospitals and donors in real-time.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} HemoVite</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          <Link to="/" className="hover:text-white transition-colors">Return Home</Link>
        </div>
      </div>

      {/* RIGHT SIDE - AUTH FORM */}
      <div className="w-full md:w-1/2 lg:w-7/12 p-6 sm:p-10 flex items-center justify-center relative">
        <div className="w-full max-w-[440px] space-y-8">
          
          {/* Mobile Logo (hidden on desktop) */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-brand-deep rounded-xl flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black">HemoVite</span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">Welcome to HemoVite</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Login or create your Citizen account
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-[#111827] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'login' 
                  ? 'bg-brand-red text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
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
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-white/10 focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 rounded-xl text-sm text-white transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-[#111827] border border-white/10 focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 rounded-xl text-sm text-white transition-all outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/citizen/forgot-password" className="text-xs font-semibold text-brand-red hover:text-red-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98]"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Blood Group</label>
                  <select
                    required
                    value={regData.bloodGroup}
                    onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none appearance-none"
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="number"
                      required
                      min={18}
                      max={65}
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="18+"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                      placeholder="Number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">Location / City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#111827] border border-white/10 focus:border-brand-red/50 rounded-xl text-sm text-white outline-none"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <GoogleSignInButton
            role="citizen"
            returnUrl="/citizen/dashboard"
            label="Continue with Google"
            variant="light"
          />
          
          <div className="text-center text-sm text-slate-400">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setActiveTab('register')} className="text-brand-red font-bold hover:underline">
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setActiveTab('login')} className="text-brand-red font-bold hover:underline">
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
