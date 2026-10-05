import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Mail, ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const GovernmentForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dr.sharma@health.gov.in');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-white">HemoVite</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-950/80 text-red-300 border border-red-700/50">
                Government Portal
              </span>
            </div>
          </div>

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
                Reset Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your registered government email address to receive an official recovery link.
              </p>
            </div>

            {submitted ? (
              <div className="space-y-5 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm">
                    Password reset link sent successfully.
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    We have dispatched an encrypted verification link to <span className="font-semibold">{email}</span>. Please verify within 15 minutes.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    to="/government/reset-password"
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Proceed to Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/government/auth"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Government Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. officer@health.gov.in"
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
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
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
