import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { z } from 'zod';

// Input validation schemas
export const signUpSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  phoneNumber: z.string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\-\s]+$/, 'Phone number can only contain digits, +, -, and spaces'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
});

export const signInSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

interface User {
  id: string;
  username: string;
  phoneNumber: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (username: string, phoneNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (guestName: string) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch profile data
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('auth_user_id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                username: profile.username,
                phoneNumber: profile.phone_number,
                isGuest: false,
              });
            }
          }, 0);
        } else {
          // Check for guest user
          const storedUser = localStorage.getItem('fitBoxUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.isGuest) {
              setUser(parsedUser);
            } else {
              localStorage.removeItem('fitBoxUser');
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              phoneNumber: profile.phone_number,
              isGuest: false,
            });
          }
          setLoading(false);
        }, 0);
      } else {
        const storedUser = localStorage.getItem('fitBoxUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isGuest) {
            setUser(parsedUser);
          }
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, phoneNumber: string, password: string) => {
    try {
      // Validate inputs
      const validation = signUpSchema.safeParse({ username, phoneNumber, password });
      if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
      }

      const normalizedUsername = username.trim().toLowerCase();
      const normalizedPhone = phoneNumber.trim();

      // Create email from username for Supabase Auth
      const email = `${normalizedUsername}@fitbox.app`;
      const redirectUrl = `${window.location.origin}/`;

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: normalizedUsername,
            phone_number: normalizedPhone
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          return { success: false, error: 'Username already taken' };
        }
        throw authError;
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create account' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      // Validate inputs
      const validation = signInSchema.safeParse({ username, password });
      if (!validation.success) {
        return { success: false, error: validation.error.errors[0].message };
      }

      const normalizedUsername = username.trim().toLowerCase();
      const email = `${normalizedUsername}@fitbox.app`;

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid username or password' };
        }
        throw error;
      }

      if (!data.session) {
        return { success: false, error: 'Failed to sign in' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  };

  const continueAsGuest = (guestName: string) => {
    const guestUser: User = {
      id: 'guest',
      username: guestName,
      phoneNumber: '',
      isGuest: true,
    };

    setUser(guestUser);
    localStorage.setItem('fitBoxUser', JSON.stringify(guestUser));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.removeItem('fitBoxUser');
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, continueAsGuest, signOut, loading }}>
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