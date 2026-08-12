import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  scrap_balance: number;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'arena_demo_user';
const DEMO_PROFILE_STORAGE_KEY = 'arena_demo_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check whether real Supabase credentials exist
  const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const rawKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    '';
  const isSupabaseConfigured = Boolean(
    rawUrl &&
    rawUrl !== 'https://placeholder.supabase.co' &&
    !rawUrl.includes('your-supabase-project') &&
    rawKey &&
    rawKey !== 'placeholder-key' &&
    rawKey !== 'placeholder-anon-key' &&
    !rawKey.includes('your-anon-key') &&
    !rawKey.includes('your-supabase-publishable-key')
  );

  const fetchProfile = async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured) {
      const storedProfile = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      const defaultDemoProfile: UserProfile = {
        id: userId,
        full_name: userEmail.split('@')[0] || 'CyberGamer',
        email: userEmail,
        scrap_balance: 1000,
        role: 'user',
      };
      setProfile(defaultDemoProfile);
      localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(defaultDemoProfile));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error.message);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback or create default profile if missing
        const newProfile: UserProfile = {
          id: userId,
          full_name: userEmail.split('@')[0] || 'Gamer',
          email: userEmail,
          scrap_balance: 1000,
          role: 'user',
        };
        const { data: created, error: createErr } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (!createErr && created) {
          setProfile(created as UserProfile);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        const storedUserStr = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (storedUserStr) {
          try {
            const parsedUser = JSON.parse(storedUserStr);
            setUser(parsedUser);
            setSession({ user: parsedUser } as Session);
            fetchProfile(parsedUser.id, parsedUser.email);
          } catch {
            localStorage.removeItem(DEMO_USER_STORAGE_KEY);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id, currentSession.user.email || '');
          }
        }
      } catch (err) {
        console.error('Session get error:', err);
      } finally {
        if (mounted) setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            await fetchProfile(newSession.user.id, newSession.user.email || '');
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email || '');
    }
  };

  const signIn = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: { full_name: email.split('@')[0] },
      } as unknown as User;

      const demoProfile: UserProfile = {
        id: mockUser.id,
        full_name: email.split('@')[0],
        email,
        scrap_balance: 1000,
        role: 'user',
      };

      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setProfile(demoProfile);

      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(demoProfile));

      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error };
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: { full_name: fullName },
      } as unknown as User;

      const demoProfile: UserProfile = {
        id: mockUser.id,
        full_name: fullName,
        email,
        scrap_balance: 1000,
        role: 'user',
      };

      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      setProfile(demoProfile);

      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(demoProfile));

      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error && data.user) {
      // Create profile record with initial 1000 SCRAP
      const newProfile: UserProfile = {
        id: data.user.id,
        full_name: fullName,
        email,
        scrap_balance: 1000,
        role: 'user',
      };

      await supabase.from('profiles').insert([newProfile]);
      setProfile(newProfile);
    }

    return { error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
