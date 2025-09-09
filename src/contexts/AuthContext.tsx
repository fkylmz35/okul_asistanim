import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUser: User = {
  id: '1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet@ogrenci.edu',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  sinif: '10. Sınıf',
  surname: 'Yılmaz',
  school: 'Atatürk Anadolu Lisesi',
  age: 16,
  learningStyle: 'visual',
  personalNotes: 'Matematik ve fen bilimlerinde güçlü olmak istiyorum. Sofia ile düzenli çalışarak hedeflerime ulaşmaya çalışıyorum.',
  subscription: {
    type: 'free',
    startDate: '2024-01-15',
    features: ['Günde 10 Sofia sohbeti', 'Temel ders desteği', '3 döküman oluşturma/ay']
  },
  dersler: ['Matematik', 'Fen Bilimleri', 'Türkçe'],
  katilimTarihi: '2024-01-15',
  lastLogin: '2024-01-25',
  totalStudyHours: 48,
  weeklyActivity: [2, 3, 1, 4, 2, 1, 3],
  monthlyActivity: [15, 18, 22, 25],
  favoriteSubjects: ['Matematik', 'Fen Bilimleri']
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    navigate('/dashboard');
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ ...mockUser, name, email });
    navigate('/dashboard');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};