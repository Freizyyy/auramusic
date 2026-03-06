import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on load for fake persistence
    const storedUser = localStorage.getItem('fake_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ uid: parsed.uid, email: parsed.email });
        setProfile(parsed);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, name?: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const fakeUid = 'user_' + Math.random().toString(36).substr(2, 9);
    const username = name || email.split('@')[0];
    const fakeProfile = {
      uid: fakeUid,
      email,
      username,
      photoURL: null
    };
    
    setUser({ uid: fakeUid, email });
    setProfile(fakeProfile);
    localStorage.setItem('fake_user', JSON.stringify(fakeProfile));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('fake_user');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
