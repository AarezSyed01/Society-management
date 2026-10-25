export type UserRole = 'admin' | 'resident';

export interface Society {
  society_id: number;
  name: string;
  address: string;
  contact_no: string;
  registration_no?: string;
  created_at: string;
}

export interface Flat {
  flat_id: number;
  flat_no: string;
  floor: number;
  block: string;
  type: string; // '1 BHK' | '2 BHK' | '3 BHK' | 'Penthouse'
  society_id: number;
  created_at: string;
}

export interface Member {
  member_id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  flat_id?: number | null;
  society_id: number;
  status: 'Active' | 'Inactive' | 'Pending';
  created_at: string;
}

export interface User {
  user_id: number;
  name: string;
  role: UserRole;
  email: string;
  password_hash: string;
  society_id: number;
  member_id?: number | null;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  created_at: string;
}

export interface Maintenance {
  maintenance_id: number;
  member_id: number;
  flat_id?: number | null;
  amount: number;
  due_date: string;
  status: 'Pending' | 'Paid' | 'Partially Paid';
  payment_date?: string | null;
  description: string;
  billing_month: string;
  created_at: string;
}

export interface Complaint {
  complaint_id: number;
  member_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  resolution_notes?: string | null;
  created_date: string;
  updated_at?: string;
}

export interface Bill {
  bill_id: number;
  flat_id: number;
  amount: number;
  due_date: string;
  status: 'Pending' | 'Paid';
  month_year: string;
  bill_type: string;
  payment_date?: string | null;
  created_at: string;
}

export interface Notice {
  notice_id: number;
  title: string;
  description: string;
  created_by?: number;
  society_id: number;
  publication_status: 'Published' | 'Draft';
  created_at: string;
}

export interface Visitor {
  visitor_id: number;
  visitor_name: string;
  phone?: string;
  purpose: string;
  flat_id: number;
  society_id: number;
  entry_time: string;
  exit_time?: string | null;
}

export interface Payment {
  payment_id: number;
  maintenance_id?: number | null;
  bill_id?: number | null;
  amount_paid: number;
  payment_date: string;
  payment_method: 'UPI' | 'Cash' | 'Cheque' | 'Net Banking';
  transaction_ref?: string;
  recorded_by?: number;
  created_at: string;
}

export interface TestScenarioResult {
  id: number;
  title: string;
  status: 'pending' | 'passed' | 'failed';
  message: string;
}
