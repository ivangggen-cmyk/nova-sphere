import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { authApi, db } from "@/lib/api";

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
  profile: any | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ data?: any; error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  profile: null,
  signOut: async () => {},
  signIn: async () => ({}),
  signUp: async () => ({}),
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  const loadUserData = useCallback(async (u: User) => {
    const [profileRes, roleRes] = await Promise.all([
      db.getProfile(u.id),
      db.getUserRole(u.id, "admin"),
    ]);
    setProfile(profileRes.data);
    setIsAdmin(!!roleRes.data);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as User;
        setUser(u);
        setSession({ user: u });
        loadUserData(u).finally(() => setLoading(false));
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [loadUserData]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authApi.signInWithPassword(email, password);
    if (error) return { error };
    if (data) {
      const u: User = (data as any).user || { id: (data as any).id, email };
      localStorage.setItem("auth_user", JSON.stringify(u));
      setUser(u);
      setSession({ user: u });
      await loadUserData(u);
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    const { data, error } = await authApi.signUp(email, password, metadata);
    if (error) return { error };
    if (data) {
      const u: User = (data as any).user || { id: (data as any).id, email };
      localStorage.setItem("auth_user", JSON.stringify(u));
      setUser(u);
      setSession({ user: u });
      await loadUserData(u);
      return { data: { user: u } };
    }
    return { data: null };
  };

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const refreshProfile = async () => {
    if (user) await loadUserData(user);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, profile, signOut, signIn, signUp, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
