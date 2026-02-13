export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: number;
  is_admin: number;
  created_at?: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  requester_id: number;
  assignee_id: number | null;
  created_at: string;
  updated_at: string;
  review_date: string | null;
  requester: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
  };
  assignee: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
  } | null;
}

export interface TicketCreate {
  subject: string;
  description?: string;
  priority?: TicketPriority;
}

export interface TicketUpdate {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee_id?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}
