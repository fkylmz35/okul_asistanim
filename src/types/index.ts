export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  sinif?: string;
  surname?: string;
  school?: string;
  age?: number;
  learningStyle?: 'visual' | 'auditory' | 'practical';
  personalNotes?: string;
  subscription?: SubscriptionPlan;
  surname?: string;
  school?: string;
  age?: number;
  learningStyle?: 'visual' | 'auditory' | 'practical';
  personalNotes?: string;
  subscription?: SubscriptionPlan;
  dersler: string[];
  katilimTarihi: string;
  lastLogin?: string;
  totalStudyHours?: number;
  weeklyActivity?: number[];
  monthlyActivity?: number[];
  favoriteSubjects?: string[];
  lastLogin?: string;
  totalStudyHours?: number;
  weeklyActivity?: number[];
  monthlyActivity?: number[];
  favoriteSubjects?: string[];
}

export interface SubscriptionPlan {
  type: 'free' | 'premium' | 'pro';
  startDate: string;
  endDate?: string;
  features: string[];
  price?: number;
  billingCycle?: 'monthly' | 'yearly';
  nextPayment?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
  description: string;
  icon: string;
  category: string;
}

export interface DocumentRequest {
  type: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
  topic: string;
  subject: string;
  gradeLevel: string;
  length: 'short' | 'medium' | 'long';
  complexity: 'basic' | 'intermediate' | 'advanced';
  template: string;
}

export interface SubscriptionPlan {
  type: 'free' | 'premium' | 'pro';
  startDate: string;
  endDate?: string;
  features: string[];
  price?: number;
  billingCycle?: 'monthly' | 'yearly';
  nextPayment?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
  description: string;
  icon: string;
  category: string;
}

export interface DocumentRequest {
  type: 'pdf' | 'docx' | 'pptx' | 'study-sheet';
  topic: string;
  subject: string;
  gradeLevel: string;
  length: 'short' | 'medium' | 'long';
  complexity: 'basic' | 'intermediate' | 'advanced';
  template: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  ders?: string;
}

export interface Conversation {
  id: string;
  title: string;
  ders: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}