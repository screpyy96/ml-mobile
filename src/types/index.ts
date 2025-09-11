// Tipuri pentru aplicația MeseriasLocal

// Import tipuri pentru imagini
import './images';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;
  userType: 'client' | 'meserias' | 'admin';
  role?: 'client' | 'worker'; // Pentru compatibilitate cu tabela profiles
  isVerified: boolean;
  createdAt: string;
}

export interface MeseriasProfile extends User {
  userType: 'meserias';
  plan: 'basic' | 'pro' | 'enterprise';
  services: string[];
  city: string;
  rating: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
  certificates: Certificate[];
  workRadius: number;
  isOnline: boolean;
  contactCredits: number;
  bio: string;
}

export interface ClientProfile extends User {
  userType: 'client';
  savedJobs: string[];
  requestHistory: JobRequest[];
}

export interface JobRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  address: string;
  tradeType: string;
  budget?: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  created_at: string; // Legacy field
  deadline?: string;
  offers: JobOffer[];
  images?: string[];
  worker?: MeseriasProfile;
}

export interface JobOffer {
  id: string;
  meseriasId: string;
  jobId: string;
  price: number;
  description: string;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  meserias: MeseriasProfile;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  completedAt: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface Review {
  id: string;
  clientId: string;
  meseriasId: string;
  jobId: string;
  rating: number;
  comment: string;
  createdAt: string;
  created_at: string; // Legacy field
  client: ClientProfile;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_offer' | 'job_update' | 'review' | 'system';
  isRead: boolean;
  is_read: boolean; // Legacy field
  createdAt: string;
  created_at: string; // Database field
  data?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  message: string;
  type: 'text' | 'image' | 'system';
  createdAt: string;
  isRead: boolean;
}