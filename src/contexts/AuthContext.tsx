import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  phoneNumber: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  signUp: (username: string, phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (username: string, phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (guestName: string) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('fitBoxUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (username: string, phoneNumber: string) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        return { success: false, error: 'Username already taken' };
      }

      // Check if phone number already exists
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (existingPhone) {
        return { success: false, error: 'Phone number already registered' };
      }

      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ username, phone_number: phoneNumber }])
        .select()
        .single();

      if (error) throw error;

      const newUser: User = {
        id: data.id,
        username: data.username,
        phoneNumber: data.phone_number,
        isGuest: false,
      };

      setUser(newUser);
      localStorage.setItem('fitBoxUser', JSON.stringify(newUser));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  };

  const signIn = async (username: string, phoneNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { success: false, error: 'Invalid username or phone number' };
      }

      const existingUser: User = {
        id: data.id,
        username: data.username,
        phoneNumber: data.phone_number,
        isGuest: false,
      };

      setUser(existingUser);
      localStorage.setItem('fitBoxUser', JSON.stringify(existingUser));

      return { success: true };
    } catch (error: any) {
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

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('fitBoxUser');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, continueAsGuest, signOut, loading }}>
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