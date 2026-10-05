import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { authApi } from '../../services/authApi';

interface GoogleSignInButtonProps {
  role?: 'citizen' | 'hospital_staff' | 'blood_bank_staff' | 'government' | string;
  facilityId?: string;
  returnUrl?: string;
  label?: string;
  variant?: 'light' | 'dark' | 'outline' | 'gov';
  className?: string;
  fullWidth?: boolean;
  onBeforeRedirect?: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  role = 'citizen',
  facilityId,
  returnUrl,
  label = 'Continue with Google',
  variant = 'light',
  className = '',
  fullWidth = true,
  onBeforeRedirect,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    if (onBeforeRedirect) {
      onBeforeRedirect();
    }

    // Small timeout to allow UI transition before redirect
    setTimeout(() => {
      authApi.initiateGoogleAuth({
        role,
        facilityId,
        returnUrl: returnUrl || window.location.pathname,
      });
    }, 150);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-[#1E293B] hover:bg-[#334155] text-white border border-slate-700 shadow-md hover:border-slate-600';
      case 'outline':
        return 'bg-transparent hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 shadow-xs';
      case 'gov':
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs hover:border-slate-400 hover:shadow-sm';
      case 'light':
      default:
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs hover:border-slate-400 hover:shadow-sm';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`relative flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span className="font-semibold tracking-tight">{loading ? 'Connecting with Google...' : label}</span>
    </button>
  );
};

export default GoogleSignInButton;
