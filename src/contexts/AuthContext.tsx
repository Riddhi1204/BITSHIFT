import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthContextType {
  citizenUser: CitizenUser | null;
  loginCitizen: (user: Omit<CitizenUser, 'id' | 'avatarInitials'>) => void;
  logoutCitizen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(null);

  useEffect(() => {
    // Load session from local storage
    const stored = localStorage.getItem('citizen_session');
    if (stored) {
      try {
        setCitizenUser(JSON.parse(stored));
      } catch (e) {
        // Handle error
      }
    }
  }, []);

  const loginCitizen = (userData: Omit<CitizenUser, 'id' | 'avatarInitials'>) => {
    const names = userData.name.split(' ');
    const initials = names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : userData.name.substring(0, 2).toUpperCase();

    const user: CitizenUser = {
      ...userData,
      id: 'cit_' + Math.random().toString(36).substr(2, 9),
      avatarInitials: initials
    };
    
    setCitizenUser(user);
    localStorage.setItem('citizen_session', JSON.stringify(user));
  };

  const logoutCitizen = () => {
    setCitizenUser(null);
    localStorage.removeItem('citizen_session');
  };

  return (
    <AuthContext.Provider value={{ citizenUser, loginCitizen, logoutCitizen }}>
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
