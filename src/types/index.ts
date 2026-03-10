export interface Business {
  id: string;
  name: string;
  timezone: string;
  settings: BusinessSettings;
  createdAt: Date;
}

export interface BusinessSettings {
  calendarConnected: boolean;
  phoneConnected: boolean;
  workingHours: WorkingHours;
  autoResponse: boolean;
  leadQualification: boolean;
}

export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  source: 'chat' | 'voice' | 'email';
  tags: string[];
  notes: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  businessId: string;
  customerId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  sourceInquiry: string;
  interestLevel: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  businessId: string;
  customerId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  channel: 'chat' | 'voice' | 'email';
  notes: string;
  googleEventId?: string;
  createdAt: Date;
}

export interface Interaction {
  id: string;
  businessId: string;
  customerId: string;
  appointmentId?: string;
  channel: 'chat' | 'voice' | 'email';
  type: 'inbound' | 'outbound';
  direction: 'incoming' | 'outgoing';
  transcript: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  duration?: number; // seconds, for voice
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  customerId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  businessId: string;
  customerId?: string;
  status: 'active' | 'closed';
  startedAt: Date;
  endedAt?: Date;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

export interface TimeSlot as CalendarSlot {
  start: Date;
  end: Date;
  available: boolean;
}
