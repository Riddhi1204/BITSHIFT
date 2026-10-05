import { fetchApi } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface GoogleAuthOptions {
  role?: 'citizen' | 'hospital_staff' | 'blood_bank_staff' | 'government' | string;
  facilityId?: string;
  returnUrl?: string;
}

export interface ResolvedFacility {
  id: string;
  registrationNumber?: string;
  name: string;
  type: 'hospital' | 'blood_bank';
  city?: string;
  state?: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface MeResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    bloodGroup?: string;
    city?: string;
    state?: string;
    phone?: string;
    gender?: string;
    isVerified?: boolean;
  };
  facility: ResolvedFacility | null;
  citizenProfile?: any;
  governmentProfile?: any;
}

export const authApi = {
  /**
   * Get the direct backend Google OAuth URL
   */
  getGoogleAuthUrl(options: GoogleAuthOptions = {}): string {
    const params = new URLSearchParams();
    if (options.role) params.append('role', options.role);
    if (options.facilityId) params.append('facilityId', options.facilityId);
    if (options.returnUrl) params.append('returnUrl', options.returnUrl);

    return `${API_BASE_URL}/auth/google?${params.toString()}`;
  },

  /**
   * Initiate Google OAuth flow by redirecting to backend auth handler
   */
  initiateGoogleAuth(options: GoogleAuthOptions = {}): void {
    const url = this.getGoogleAuthUrl(options);
    window.location.href = url;
  },

  /**
   * Register with email & password
   */
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    bloodGroup?: string;
    city?: string;
    state?: string;
    address?: string;
    gender?: string;
    age?: number;
  }): Promise<{ token: string; user: any; citizenProfile?: any; facility?: ResolvedFacility | null }> {
    const res: any = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      localStorage.setItem('hemovite_token', res.token);
      localStorage.setItem('hemovite_user', JSON.stringify(res.user));
      localStorage.setItem('hemovite_role', res.user.role || 'citizen');
      if (res.user.role === 'citizen') {
        const initials = res.user.fullName
          ? res.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          : 'CU';
        localStorage.setItem('citizen_session', JSON.stringify({
          id: res.user.id,
          name: res.user.fullName,
          email: res.user.email,
          bloodGroup: res.user.bloodGroup,
          phone: res.user.phone,
          city: res.user.city,
          state: res.user.state,
          avatarInitials: initials,
          avatarUrl: res.user.avatarUrl,
        }));
      }
      window.dispatchEvent(new Event('hemovite_auth_changed'));
    }
    return res;
  },

  /**
   * Login with email & password
   */
  async login(data: { email: string; password: string }): Promise<{ token: string; user: any; citizenProfile?: any; facility?: ResolvedFacility | null }> {
    const res: any = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      localStorage.setItem('hemovite_token', res.token);
      localStorage.setItem('hemovite_user', JSON.stringify(res.user));
      localStorage.setItem('hemovite_role', res.user.role || 'citizen');
      if (res.user.role === 'citizen') {
        const initials = res.user.fullName
          ? res.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          : 'CU';
        localStorage.setItem('citizen_session', JSON.stringify({
          id: res.user.id,
          name: res.user.fullName,
          email: res.user.email,
          bloodGroup: res.user.bloodGroup,
          phone: res.user.phone,
          city: res.user.city,
          state: res.user.state,
          avatarInitials: initials,
          avatarUrl: res.user.avatarUrl,
        }));
      }
      window.dispatchEvent(new Event('hemovite_auth_changed'));
    }
    return res;
  },

  /**
   * Get current authenticated profile and resolved facility
   */
  async getMe(): Promise<MeResponse> {
    return await fetchApi('/auth/me');
  },

  /**
   * Link the authenticated user to a registered facility
   */
  async linkFacility(facilityType: 'hospital' | 'blood_bank', facilityId: string): Promise<ResolvedFacility> {
    return await fetchApi('/auth/link-facility', {
      method: 'POST',
      body: JSON.stringify({ facilityType, facilityId }),
    });
  },

  /**
   * Verify Google ID token directly with backend (for client-side popup or one-tap)
   */
  async verifyGoogleIdToken(idToken: string, options: GoogleAuthOptions = {}): Promise<{
    token: string;
    user: any;
    facility?: ResolvedFacility | null;
  }> {
    return await fetchApi('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ idToken, role: options.role, facilityId: options.facilityId }),
    });
  },

  /**
   * Log out and clean all session artifacts
   */
  logout(): void {
    localStorage.removeItem('hemovite_token');
    localStorage.removeItem('hemovite_user');
    localStorage.removeItem('hemovite_role');
    localStorage.removeItem('citizen_session');
    localStorage.removeItem('hemovite_gov_user');
    localStorage.removeItem('hemovite_hospital_staff');
    localStorage.removeItem('hemovite_bloodbank_staff');
    window.dispatchEvent(new Event('hemovite_auth_changed'));
  },
};

export default authApi;
