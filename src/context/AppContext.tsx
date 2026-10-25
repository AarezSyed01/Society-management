import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Society,
  Flat,
  Member,
  User,
  Maintenance,
  Complaint,
  Bill,
  Notice,
  Visitor,
  Payment,
  UserRole,
} from '../types';
import {
  INITIAL_SOCIETY,
  INITIAL_FLATS,
  INITIAL_MEMBERS,
  INITIAL_USERS,
  INITIAL_MAINTENANCE,
  INITIAL_BILLS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_VISITORS,
  INITIAL_PAYMENTS,
} from '../mockData';

interface AppContextType {
  society: Society;
  flats: Flat[];
  members: Member[];
  users: User[];
  maintenance: Maintenance[];
  bills: Bill[];
  complaints: Complaint[];
  notices: Notice[];
  visitors: Visitor[];
  payments: Payment[];
  currentUser: User | null;
  currentMember: Member | null;
  currentFlat: Flat | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth operations
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    flat_id: number;
    address?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: number) => void;
  // Members CRUD
  addMember: (data: Omit<Member, 'member_id' | 'created_at'>) => { success: boolean; error?: string };
  updateMember: (id: number, data: Partial<Member>) => { success: boolean; error?: string };
  deleteMember: (id: number) => { success: boolean; error?: string };
  // Flats CRUD
  addFlat: (data: Omit<Flat, 'flat_id' | 'created_at'>) => { success: boolean; error?: string };
  updateFlat: (id: number, data: Partial<Flat>) => { success: boolean; error?: string };
  deleteFlat: (id: number) => { success: boolean; error?: string };
  // Maintenance & Payments
  addMaintenance: (data: Omit<Maintenance, 'maintenance_id' | 'created_at'>) => { success: boolean; error?: string };
  recordMaintenancePayment: (data: {
    maintenance_id: number;
    amount: number;
    payment_method: 'UPI' | 'Cash' | 'Cheque' | 'Net Banking';
    transaction_ref?: string;
  }) => { success: boolean; error?: string };
  // Bills
  addBill: (data: Omit<Bill, 'bill_id' | 'created_at'>) => { success: boolean; error?: string };
  recordBillPayment: (data: {
    bill_id: number;
    amount: number;
    payment_method: 'UPI' | 'Cash' | 'Cheque' | 'Net Banking';
    transaction_ref?: string;
  }) => { success: boolean; error?: string };
  // Complaints
  addComplaint: (title: string, description: string) => { success: boolean; error?: string };
  updateComplaintStatus: (id: number, status: 'Pending' | 'In Progress' | 'Resolved', notes?: string) => void;
  // Notices
  addNotice: (title: string, description: string, status?: 'Published' | 'Draft') => { success: boolean };
  updateNotice: (id: number, title: string, description: string, status?: 'Published' | 'Draft') => void;
  deleteNotice: (id: number) => void;
  // Visitors
  addVisitor: (data: { visitor_name: string; phone?: string; purpose: string; flat_id: number }) => { success: boolean; error?: string };
  markVisitorExit: (visitor_id: number) => void;
  // Society Settings
  updateSociety: (data: Partial<Society>) => void;
  // Reset
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or initial mock data
  const [society, setSociety] = useState<Society>(() => {
    const saved = localStorage.getItem('sms_society');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.includes('Shree Ganesh')) {
          parsed.name = 'Gokuldham Co-operative Housing Society';
          parsed.address = 'Plot 42, Sector 19, Powder Gali, Goregaon East, Mumbai - 400063';
          localStorage.setItem('sms_society', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return INITIAL_SOCIETY;
      }
    }
    return INITIAL_SOCIETY;
  });

  const [flats, setFlats] = useState<Flat[]>(() => {
    const saved = localStorage.getItem('sms_flats');
    return saved ? JSON.parse(saved) : INITIAL_FLATS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('sms_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [maintenance, setMaintenance] = useState<Maintenance[]>(() => {
    const saved = localStorage.getItem('sms_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('sms_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('sms_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('sms_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('sms_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('sms_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Current logged in user (defaults to admin for first load, or from session)
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('sms_current_user_id');
    return saved ? JSON.parse(saved) : 1; // Default to admin Rajesh Sharma
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('sms_society', JSON.stringify(society)); }, [society]);
  useEffect(() => { localStorage.setItem('sms_flats', JSON.stringify(flats)); }, [flats]);
  useEffect(() => { localStorage.setItem('sms_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('sms_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('sms_maintenance', JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { localStorage.setItem('sms_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('sms_complaints', JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem('sms_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('sms_visitors', JSON.stringify(visitors)); }, [visitors]);
  useEffect(() => { localStorage.setItem('sms_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('sms_current_user_id', JSON.stringify(currentUserId)); }, [currentUserId]);

  const currentUser = users.find((u) => u.user_id === currentUserId) || null;
  const currentMember = currentUser?.member_id ? members.find((m) => m.member_id === currentUser.member_id) || null : null;
  const currentFlat = currentMember?.flat_id ? flats.find((f) => f.flat_id === currentMember.flat_id) || null : null;

  // ---------------- Authentication ----------------
  const login = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'User with this email does not exist.' };
    }
    if (user.password_hash !== password) {
      return { success: false, error: 'Invalid password. Please check credentials.' };
    }
    if (user.status === 'Pending Approval') {
      return { success: false, error: 'Your registration is currently pending committee verification.' };
    }
    setCurrentUserId(user.user_id);
    setActiveTab('dashboard');
    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    flat_id: number;
    address?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address is already registered.' };
    }

    const newMemberId = members.length > 0 ? Math.max(...members.map((m) => m.member_id)) + 1 : 1;
    const selectedFlat = flats.find((f) => f.flat_id === data.flat_id);
    const flatDescription = selectedFlat ? `Flat ${selectedFlat.block}-${selectedFlat.flat_no}, ${society.name}` : data.address || '';

    const newMember: Member = {
      member_id: newMemberId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: flatDescription,
      flat_id: data.flat_id,
      society_id: society.society_id,
      status: 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.user_id)) + 1 : 1;
    const newUser: User = {
      user_id: newUserId,
      name: data.name,
      role: 'resident',
      email: data.email,
      password_hash: data.password,
      society_id: society.society_id,
      member_id: newMemberId,
      status: 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setMembers((prev) => [...prev, newMember]);
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUserId);
    setActiveTab('dashboard');
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    setActiveTab('login');
  };

  const switchUser = (userId: number) => {
    setCurrentUserId(userId);
    setActiveTab('dashboard');
  };

  // ---------------- Member Management ----------------
  const addMember = (data: Omit<Member, 'member_id' | 'created_at'>) => {
    if (members.some((m) => m.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'A member with this email address already exists.' };
    }
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.member_id)) + 1 : 1;
    const newMember: Member = {
      ...data,
      member_id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setMembers((prev) => [...prev, newMember]);
    return { success: true };
  };

  const updateMember = (id: number, data: Partial<Member>) => {
    if (data.email && members.some((m) => m.member_id !== id && m.email.toLowerCase() === data.email!.toLowerCase())) {
      return { success: false, error: 'Email already used by another member.' };
    }
    setMembers((prev) => prev.map((m) => (m.member_id === id ? { ...m, ...data } : m)));
    // Also update associated user name if changed
    if (data.name || data.email) {
      setUsers((prev) =>
        prev.map((u) =>
          u.member_id === id
            ? { ...u, name: data.name || u.name, email: data.email || u.email }
            : u
        )
      );
    }
    return { success: true };
  };

  const deleteMember = (id: number) => {
    // Foreign key constraint check (Maintenance and Complaints)
    const hasMaintenance = maintenance.some((m) => m.member_id === id);
    const hasComplaints = complaints.some((c) => c.member_id === id);
    if (hasMaintenance || hasComplaints) {
      return {
        success: false,
        error: `Cannot delete member: Referential integrity violation. Member has linked ${
          hasMaintenance ? 'maintenance dues/records' : ''
        } ${hasComplaints ? 'and complaints' : ''}. Resolve or reassign related records first.`,
      };
    }
    setMembers((prev) => prev.filter((m) => m.member_id !== id));
    setUsers((prev) => prev.filter((u) => u.member_id !== id));
    return { success: true };
  };

  // ---------------- Flat Management ----------------
  const addFlat = (data: Omit<Flat, 'flat_id' | 'created_at'>) => {
    const isDuplicate = flats.some(
      (f) =>
        f.society_id === data.society_id &&
        f.block.toUpperCase() === data.block.toUpperCase() &&
        f.flat_no.trim() === data.flat_no.trim()
    );
    if (isDuplicate) {
      return { success: false, error: `Flat ${data.block}-${data.flat_no} already exists in this society.` };
    }
    const newId = flats.length > 0 ? Math.max(...flats.map((f) => f.flat_id)) + 1 : 1;
    const newFlat: Flat = {
      ...data,
      flat_id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setFlats((prev) => [...prev, newFlat]);
    return { success: true };
  };

  const updateFlat = (id: number, data: Partial<Flat>) => {
    setFlats((prev) => prev.map((f) => (f.flat_id === id ? { ...f, ...data } : f)));
    return { success: true };
  };

  const deleteFlat = (id: number) => {
    const hasMembers = members.some((m) => m.flat_id === id);
    const hasBills = bills.some((b) => b.flat_id === id);
    if (hasMembers || hasBills) {
      return {
        success: false,
        error: `Cannot delete flat: Associated ${hasMembers ? 'member is currently assigned' : ''} ${
          hasBills ? 'or utility bills exist' : ''
        }.`,
      };
    }
    setFlats((prev) => prev.filter((f) => f.flat_id !== id));
    return { success: true };
  };

  // ---------------- Maintenance & Payments ----------------
  const addMaintenance = (data: Omit<Maintenance, 'maintenance_id' | 'created_at'>) => {
    const newId = maintenance.length > 0 ? Math.max(...maintenance.map((m) => m.maintenance_id)) + 1 : 1;
    const newMaint: Maintenance = {
      ...data,
      maintenance_id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setMaintenance((prev) => [newMaint, ...prev]);
    return { success: true };
  };

  const recordMaintenancePayment = (data: {
    maintenance_id: number;
    amount: number;
    payment_method: 'UPI' | 'Cash' | 'Cheque' | 'Net Banking';
    transaction_ref?: string;
  }) => {
    const maint = maintenance.find((m) => m.maintenance_id === data.maintenance_id);
    if (!maint) return { success: false, error: 'Maintenance record not found.' };

    const paymentDate = new Date().toISOString().substring(0, 10);
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.payment_id)) + 1 : 1;

    const newPayment: Payment = {
      payment_id: newPaymentId,
      maintenance_id: data.maintenance_id,
      bill_id: null,
      amount_paid: data.amount,
      payment_date: paymentDate,
      payment_method: data.payment_method,
      transaction_ref: data.transaction_ref || `TXN-${Date.now().toString().slice(-6)}`,
      recorded_by: currentUser?.user_id,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setMaintenance((prev) =>
      prev.map((m) =>
        m.maintenance_id === data.maintenance_id
          ? { ...m, status: 'Paid', payment_date: paymentDate }
          : m
      )
    );
    return { success: true };
  };

  // ---------------- Bills Management ----------------
  const addBill = (data: Omit<Bill, 'bill_id' | 'created_at'>) => {
    const newId = bills.length > 0 ? Math.max(...bills.map((b) => b.bill_id)) + 1 : 1;
    const newBill: Bill = {
      ...data,
      bill_id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setBills((prev) => [newBill, ...prev]);
    return { success: true };
  };

  const recordBillPayment = (data: {
    bill_id: number;
    amount: number;
    payment_method: 'UPI' | 'Cash' | 'Cheque' | 'Net Banking';
    transaction_ref?: string;
  }) => {
    const bill = bills.find((b) => b.bill_id === data.bill_id);
    if (!bill) return { success: false, error: 'Bill record not found.' };

    const paymentDate = new Date().toISOString().substring(0, 10);
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.payment_id)) + 1 : 1;

    const newPayment: Payment = {
      payment_id: newPaymentId,
      maintenance_id: null,
      bill_id: data.bill_id,
      amount_paid: data.amount,
      payment_date: paymentDate,
      payment_method: data.payment_method,
      transaction_ref: data.transaction_ref || `BILL-TXN-${Date.now().toString().slice(-6)}`,
      recorded_by: currentUser?.user_id,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setBills((prev) =>
      prev.map((b) =>
        b.bill_id === data.bill_id
          ? { ...b, status: 'Paid', payment_date: paymentDate }
          : b
      )
    );
    return { success: true };
  };

  // ---------------- Complaints ----------------
  const addComplaint = (title: string, description: string) => {
    if (!currentMember) {
      return { success: false, error: 'You must be an associated society member to file a complaint.' };
    }
    const newId = complaints.length > 0 ? Math.max(...complaints.map((c) => c.complaint_id)) + 1 : 1;
    const newComplaint: Complaint = {
      complaint_id: newId,
      member_id: currentMember.member_id,
      title: title.trim(),
      description: description.trim(),
      status: 'Pending',
      resolution_notes: null,
      created_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return { success: true };
  };

  const updateComplaintStatus = (id: number, status: 'Pending' | 'In Progress' | 'Resolved', notes?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.complaint_id === id
          ? {
              ...c,
              status,
              resolution_notes: notes !== undefined ? notes : c.resolution_notes,
              updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );
  };

  // ---------------- Notices ----------------
  const addNotice = (title: string, description: string, status: 'Published' | 'Draft' = 'Published') => {
    const newId = notices.length > 0 ? Math.max(...notices.map((n) => n.notice_id)) + 1 : 1;
    const newNotice: Notice = {
      notice_id: newId,
      title: title.trim(),
      description: description.trim(),
      created_by: currentUser?.user_id || 1,
      society_id: society.society_id,
      publication_status: status,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotices((prev) => [newNotice, ...prev]);
    return { success: true };
  };

  const updateNotice = (id: number, title: string, description: string, status: 'Published' | 'Draft' = 'Published') => {
    setNotices((prev) =>
      prev.map((n) =>
        n.notice_id === id
          ? { ...n, title: title.trim(), description: description.trim(), publication_status: status }
          : n
      )
    );
  };

  const deleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.notice_id !== id));
  };

  // ---------------- Visitors ----------------
  const addVisitor = (data: { visitor_name: string; phone?: string; purpose: string; flat_id: number }) => {
    const newId = visitors.length > 0 ? Math.max(...visitors.map((v) => v.visitor_id)) + 1 : 1;
    const newVisitor: Visitor = {
      visitor_id: newId,
      visitor_name: data.visitor_name.trim(),
      phone: data.phone?.trim() || '',
      purpose: data.purpose.trim(),
      flat_id: data.flat_id,
      society_id: society.society_id,
      entry_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      exit_time: null,
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    return { success: true };
  };

  const markVisitorExit = (visitor_id: number) => {
    const exitTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setVisitors((prev) =>
      prev.map((v) => (v.visitor_id === visitor_id ? { ...v, exit_time: exitTime } : v))
    );
  };

  // ---------------- Settings ----------------
  const updateSociety = (data: Partial<Society>) => {
    setSociety((prev) => ({ ...prev, ...data }));
  };

  // ---------------- Reset ----------------
  const resetDatabase = () => {
    localStorage.removeItem('sms_society');
    localStorage.removeItem('sms_flats');
    localStorage.removeItem('sms_members');
    localStorage.removeItem('sms_users');
    localStorage.removeItem('sms_maintenance');
    localStorage.removeItem('sms_bills');
    localStorage.removeItem('sms_complaints');
    localStorage.removeItem('sms_notices');
    localStorage.removeItem('sms_visitors');
    localStorage.removeItem('sms_payments');
    localStorage.removeItem('sms_current_user_id');

    setSociety(INITIAL_SOCIETY);
    setFlats(INITIAL_FLATS);
    setMembers(INITIAL_MEMBERS);
    setUsers(INITIAL_USERS);
    setMaintenance(INITIAL_MAINTENANCE);
    setBills(INITIAL_BILLS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotices(INITIAL_NOTICES);
    setVisitors(INITIAL_VISITORS);
    setPayments(INITIAL_PAYMENTS);
    setCurrentUserId(1);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        society,
        flats,
        members,
        users,
        maintenance,
        bills,
        complaints,
        notices,
        visitors,
        payments,
        currentUser,
        currentMember,
        currentFlat,
        activeTab,
        setActiveTab,
        login,
        register,
        logout,
        switchUser,
        addMember,
        updateMember,
        deleteMember,
        addFlat,
        updateFlat,
        deleteFlat,
        addMaintenance,
        recordMaintenancePayment,
        addBill,
        recordBillPayment,
        addComplaint,
        updateComplaintStatus,
        addNotice,
        updateNotice,
        deleteNotice,
        addVisitor,
        markVisitorExit,
        updateSociety,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
