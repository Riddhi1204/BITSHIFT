import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/authApi';

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarUrl?: string;
  bloodGroup?: string;
  phone?: string;
  city?: string;
  state?: string;
  address?: string;
  role?: string;
}

interface AuthContextType {
  citizenUser: CitizenUser | null;
  loading: boolean;
  loginCitizen: (userData: Partial<CitizenUser> & { name: string; email: string }) => void;
  logoutCitizen: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserFromStorage = useCallback(() => {
    const stored = localStorage.getItem('citizen_session');
    const token = localStorage.getItem('hemovite_token');
    const userStr = localStorage.getItem('hemovite_user');

    if (stored) {
      try {
        setCitizenUser(JSON.parse(stored));
      } catch (e) {
        setCitizenUser(null);
      }
    } else if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && (u.role === 'citizen' || !u.role)) {
          const names = (u.fullName || u.name || 'Citizen User').split(' ');
          const initials = names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : (u.fullName || u.name || 'CU').substring(0, 2).toUpperCase();

          const citizen: CitizenUser = {
            id: u.id,
            name: u.fullName || u.name || 'Citizen User',
            email: u.email,
            avatarInitials: initials,
            avatarUrl: u.avatarUrl,
            bloodGroup: u.bloodGroup,
            phone: u.phone,
            city: u.city,
            state: u.state,
            role: u.role || 'citizen',
          };
          setCitizenUser(citizen);
        } else {
          setCitizenUser(null);
        }
      } catch {
        setCitizenUser(null);
      }
    } else {
      setCitizenUser(null);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem('hemovite_token');
    if (!token) {
      syncUserFromStorage();
      setLoading(false);
      return;
    }

    try {
      const me = await authApi.getMe();
      if (me?.user) {
        const u = me.user;
        const names = (u.fullName || 'Citizen User').split(' ');
        const initials = names.length > 1
          ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
          : (u.fullName || 'CU').substring(0, 2).toUpperCase();

        const citizen: CitizenUser = {
          id: u.id,
          name: u.fullName,
          email: u.email,
          avatarInitials: initials,
          avatarUrl: u.avatarUrl,
          bloodGroup: u.bloodGroup,
          phone: u.phone,
          city: u.city,
          state: u.state,
          address: me.citizenProfile?.address || (u.city ? `${u.city}, ${u.state || 'India'}` : undefined),
          role: u.role,
        };

        setCitizenUser(citizen);
        localStorage.setItem('citizen_session', JSON.stringify(citizen));
        localStorage.setItem('hemovite_user', JSON.stringify(u));
        localStorage.setItem('hemovite_role', u.role);
      }
    } catch {
      syncUserFromStorage();
    } finally {
      setLoading(false);
    }
  }, [syncUserFromStorage]);

  useEffect(() => {
    refreshAuth();

    const handleAuthChange = () => {
      syncUserFromStorage();
      refreshAuth();
    };

    window.addEventListener('hemovite_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('hemovite_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [refreshAuth, syncUserFromStorage]);

  const loginCitizen = (userData: Partial<CitizenUser> & { name: string; email: string }) => {
    const names = userData.name.split(' ');
    const initials = names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : userData.name.substring(0, 2).toUpperCase();

    const user: CitizenUser = {
      id: userData.id || 'cit_' + Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email,
      avatarInitials: userData.avatarInitials || initials,
      avatarUrl: userData.avatarUrl,
      bloodGroup: userData.bloodGroup,
      phone: userData.phone,
      city: userData.city,
      state: userData.state,
      address: userData.address,
      role: userData.role || 'citizen',
    };

    setCitizenUser(user);
    localStorage.setItem('citizen_session', JSON.stringify(user));
    window.dispatchEvent(new Event('hemovite_auth_changed'));
  };

  const logoutCitizen = () => {
    authApi.logout();
    setCitizenUser(null);
  };

  return (
    <AuthContext.Provider value={{ citizenUser, loading, loginCitizen, logoutCitizen, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
