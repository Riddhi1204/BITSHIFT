import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Droplet, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CitizenForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col justify-center items-center p-4 selection:bg-brand-red selection:text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-brand-deep/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111827] border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-red to-brand-deep rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/30">
            <Droplet className="w-8 h-8 text-white fill-white/20" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">Reset your password</h2>
        
        {!isSubmitted ? (
          <>
            <p className="text-slate-400 text-center text-sm mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-white/10 focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 rounded-xl text-sm text-white transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 transition-all active:scale-[0.98]"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-slate-300 mb-8 leading-relaxed">
              If an account exists for <strong className="text-white">{email}</strong>, a password reset link has been sent.
            </p>
            <Link
              to="/citizen/auth"
              className="w-full inline-block py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
            >
              Back to Login
            </Link>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-8 text-center">
            <Link to="/citizen/auth" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
