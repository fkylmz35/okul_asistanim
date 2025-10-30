import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

// Mock user for development mode
const mockUser: User = {
  id: 'dev-user-1',
  name: 'Test Kullanıcı',
  email: 'test@okul.edu',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  sinif: '10. Sınıf',
  surname: 'Demo',
  school: 'Geliştirme Lisesi',
  age: 16,
  learningStyle: 'visual',
  personalNotes: 'Development mode - Bu mock bir kullanıcı.',
  subscription: {
    type: 'free',
    startDate: new Date().toISOString(),
    features: ['Günde 10 Sofia sohbeti', 'Temel ders desteği', '3 döküman oluşturma/ay']
  },
  dersler: ['Matematik', 'Fen Bilimleri', 'Türkçe'],
  katilimTarihi: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  totalStudyHours: 24,
  weeklyActivity: [2, 3, 1, 4, 2, 1, 3],
  monthlyActivity: [15, 18, 22, 25],
  favoriteSubjects: ['Matematik', 'Fen Bilimleri']
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from database
  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            type,
            start_date,
            end_date,
            features,
            price,
            billing_cycle,
            next_payment
          )
        `)
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      if (profile) {
        const subscription = profile.subscriptions?.[0];

        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          sinif: profile.sinif,
          surname: profile.surname,
          school: profile.school,
          age: profile.age,
          learningStyle: profile.learning_style,
          personalNotes: profile.personal_notes,
          subscription: subscription ? {
            type: subscription.type,
            startDate: subscription.start_date,
            endDate: subscription.end_date,
            features: subscription.features || [],
            price: subscription.price,
            billingCycle: subscription.billing_cycle,
            nextPayment: subscription.next_payment
          } : undefined,
          dersler: profile.dersler || [],
          katilimTarihi: profile.katilim_tarihi,
          lastLogin: profile.last_login,
          totalStudyHours: profile.total_study_hours,
          weeklyActivity: profile.weekly_activity,
          monthlyActivity: profile.monthly_activity,
          favoriteSubjects: profile.favorite_subjects
        };

        setUser(userData);
      } else {
        throw new Error('Profil bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Re-throw the error so calling functions can handle it properly
      throw error;
    }
  };

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Development mode - use mock user
      if (!isSupabaseConfigured) {
        // Check if user was "logged in" in localStorage
        const devLoggedIn = localStorage.getItem('dev_logged_in');
        if (devLoggedIn === 'true') {
          setUser(mockUser);
        }
        setIsLoading(false);
        return;
      }

      // Production mode - use Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Only set up Supabase auth listener in production
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Development mode - simulate login
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        localStorage.setItem('dev_logged_in', 'true');
        setUser(mockUser);
        navigate('/dashboard');
        setIsLoading(false);
        return;
      }

      // Production mode - use Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user);

        // Update last login
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Development mode - simulate registration
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        localStorage.setItem('dev_logged_in', 'true');
        const newUser = { ...mockUser, name, email };
        setUser(newUser);
        navigate('/dashboard');
        setIsLoading(false);
        return;
      }

      // Production mode - use Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        await fetchUserProfile(data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Development mode - clear mock session
      if (!isSupabaseConfigured) {
        localStorage.removeItem('dev_logged_in');
        setUser(null);
        navigate('/');
        return;
      }

      // Production mode - use Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      // Development mode - just reload mock user
      if (!isSupabaseConfigured) {
        setUser({ ...mockUser });
        return;
      }

      // Production mode - fetch fresh user data from Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};