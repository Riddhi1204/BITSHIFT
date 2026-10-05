import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, Droplet, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginCitizen } = useAuth();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      const error = searchParams.get('error');
      if (error) {
        setStatus('error');
        setErrorMessage(decodeURIComponent(error));
        return;
      }

      let token = searchParams.get('token');
      let role = searchParams.get('role') || 'citizen';
      let name = searchParams.get('name') || 'Google User';
      let email = searchParams.get('email') || '';
      let avatar = searchParams.get('avatar') || '';
      let userId = searchParams.get('userId') || '';
      let facilityId = searchParams.get('facilityId');
      let facilityName = searchParams.get('facilityName');
      let facilityType = searchParams.get('facilityType');
      let returnUrl = searchParams.get('returnUrl');
      let isNewUser = searchParams.get('isNewUser') === 'true';

      const code = searchParams.get('code');
      const stateStr = searchParams.get('state');

      // If we received an authorization code directly on frontend callback
      if (!token && code) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/google/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              state: stateStr,
              redirectUri: window.location.origin + '/auth/callback',
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success || !data.data?.token) {
            throw new Error(data.message || 'Failed to exchange authorization code with backend');
          }

          token = data.data.token;
          const user = data.data.user;
          const facility = data.data.facility;
          const decodedState = data.data.state || {};

          userId = user.id;
          role = user.role || decodedState.role || 'citizen';
          name = user.fullName || 'Google User';
          email = user.email || '';
          avatar = user.avatarUrl || '';
          facilityId = facility?.id || decodedState.facilityId || null;
          facilityName = facility?.name || null;
          facilityType = facility?.type || null;
          returnUrl = decodedState.returnUrl || null;
          if (data.data.isNewUser || !user.bloodGroup) {
            isNewUser = true;
          }
        } catch (exchangeErr: any) {
          console.error('Code exchange failed:', exchangeErr);
          setStatus('error');
          setErrorMessage(exchangeErr.message || 'Failed to complete Google authentication');
          return;
        }
      }

      if (!token) {
        setStatus('error');
        setErrorMessage('No authentication token received from Google OAuth.');
        return;
      }

      try {
        // 1. Store JWT token & basic User metadata in LocalStorage
        localStorage.setItem('hemovite_token', token);
        localStorage.setItem('hemovite_role', role);

        // Fetch authoritative profile & facility resolution from backend /api/auth/me
        let resolvedFacility: any = null;
        try {
          const meData = await authApi.getMe();
          if (meData?.user) {
            userId = meData.user.id;
            name = meData.user.fullName;
            email = meData.user.email;
            role = meData.user.role;
            avatar = meData.user.avatarUrl || avatar;
            if (meData.facility) {
              resolvedFacility = meData.facility;
              facilityId = resolvedFacility.id;
              facilityName = resolvedFacility.name;
              facilityType = resolvedFacility.type;
            }
          }
        } catch (meErr) {
          console.warn('Could not resolve /me immediately, using token payload:', meErr);
        }

        const userObj = {
          id: userId,
          name,
          email,
          role,
          avatarUrl: avatar,
          facilityId: facilityId || null,
          facilityName: facilityName || null,
          facilityType: facilityType || null,
        };
        localStorage.setItem('hemovite_user', JSON.stringify(userObj));

        // 2. Role specific session handling
        if (role === 'citizen') {
          loginCitizen({
            name,
            email,
          });
        } else if (role === 'government') {
          const govUser = {
            id: userId || 'GOV-IND-001',
            name,
            email,
            phone: '+91 98351 00000',
            department: 'State Blood Transfusion Council (SBTC)',
            state: 'Jharkhand',
            district: 'Ranchi',
            designation: 'National Health Officer',
            authorityId: 'AUTH-GOV-GOOGLE',
            role: 'state_admin',
            verificationStatus: 'Verified',
          };
          localStorage.setItem('hemovite_gov_user', JSON.stringify(govUser));
        } else if (role === 'hospital_staff' || role === 'hospital') {
          const hospStaff = {
            id: userId,
            name,
            email,
            hospitalId: facilityId || resolvedFacility?.id,
            hospitalName: facilityName || resolvedFacility?.name,
          };
          localStorage.setItem('hemovite_hospital_staff', JSON.stringify(hospStaff));
        } else if (role === 'blood_bank_staff' || role === 'blood_bank') {
          const bbStaff = {
            id: userId,
            name,
            email,
            bloodBankId: facilityId || resolvedFacility?.id,
            bloodBankName: facilityName || resolvedFacility?.name,
          };
          localStorage.setItem('hemovite_bloodbank_staff', JSON.stringify(bbStaff));
        }

        window.dispatchEvent(new Event('hemovite_auth_changed'));
        setStatus('success');

        // 3. Determine redirect destination
        let destination = '/';
        const finalFacilityId = resolvedFacility?.id || facilityId;

        if (role === 'citizen' && isNewUser) {
          destination = '/citizen/onboarding';
        } else if (returnUrl && returnUrl.startsWith('/') && !returnUrl.includes('/auth') && !returnUrl.includes('/onboarding')) {
          destination = returnUrl;
        } else if (role === 'government') {
          destination = '/government/dashboard';
        } else if (role === 'hospital_staff' || role === 'hospital') {
          destination = finalFacilityId ? `/hospital/${finalFacilityId}/dashboard` : '/hospitals';
        } else if (role === 'blood_bank_staff' || role === 'blood_bank') {
          destination = finalFacilityId ? `/blood-bank/${finalFacilityId}/dashboard` : '/blood-banks';
        } else {
          destination = '/citizen/dashboard';
        }

        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1000);

      } catch (err: any) {
        console.error('Error completing OAuth callback:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Failed to complete authentication session.');
      }
    };

    handleAuth();
  }, [searchParams, navigate, loginCitizen]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-4 selection:bg-brand-red selection:text-white">
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center shadow-lg shadow-brand-red/30">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white">
            Hemo<span className="text-brand-bright">Vite</span>
          </span>
        </div>

        {status === 'processing' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-brand-red">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Verifying Account &amp; Facility</h2>
              <p className="text-sm text-slate-400 mt-1">Securing your session token and resolving network permissions...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Authentication Verified!</h2>
              <p className="text-sm text-slate-400 mt-1">Welcome back. Redirecting you to your dashboard now...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-950/40">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Authentication Failed</h2>
              <p className="text-sm text-red-300/90 font-mono bg-red-950/50 border border-red-900/50 p-3 rounded-xl text-xs break-words">
                {errorMessage || 'Unable to sign in'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="w-full py-3 px-6 rounded-xl bg-brand-red hover:bg-red-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthCallback;
