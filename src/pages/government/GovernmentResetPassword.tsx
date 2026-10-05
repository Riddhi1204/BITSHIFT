import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Lock, ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const GovernmentResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const passStrength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-red selection:text-white font-sans">
      
      {/* HEADER */}
      <header className="bg-[#0B1120] border-b border-slate-800 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-white">HemoVite</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-950/80 text-red-300 border border-red-700/50">
                Government Portal
              </span>
            </div>
          </Link>

          <button
            onClick={() => navigate('/government/auth')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Set New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Create a strong, encrypted password for your official government administrator credentials.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {submitted ? (
              <div className="space-y-5 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm">
                    Password updated successfully!
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your government credentials have been updated securely. You can now login with your new password.
                  </p>
                </div>

                <Link
                  to="/government/auth"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Proceed to Official Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Strength:</span>
                      <span className="font-bold">{passStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    to="/government/auth"
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};
