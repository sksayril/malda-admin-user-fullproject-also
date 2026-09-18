'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  UserSession,
  Customer,
  LoanApplication,
  Agent,
  Branch,
  DepositAccount,
  CollectionRecord,
  WhiteLabelPartner,
  SystemUser,
  SocietyInfo,
  LoanStatus,
} from '@/types';
import {
  INITIAL_SOCIETY,
  INITIAL_BRANCHES,
  INITIAL_AGENTS,
  INITIAL_CUSTOMERS,
  INITIAL_LOANS,
  INITIAL_DEPOSITS,
  INITIAL_COLLECTIONS,
  INITIAL_PARTNERS,
  INITIAL_USERS,
} from '@/data/mockData';

interface AdminContextType {
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;
  logout: () => void;
  society: SocietyInfo;
  setSociety: React.Dispatch<React.SetStateAction<SocietyInfo>>;
  branches: Branch[];
  addBranch: (branch: Branch) => Promise<void>;
  toggleBranchStatus: (id: string) => void;
  agents: Agent[];
  addAgent: (agent: Agent) => Promise<void>;
  toggleAgentStatus: (id: string) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => Promise<void>;
  toggleCustomerStatus: (id: string) => void;
  loans: LoanApplication[];
  addLoan: (loan: LoanApplication) => Promise<void>;
  updateLoanStatus: (id: string, status: LoanStatus, step: LoanApplication['step']) => void;
  deposits: DepositAccount[];
  addDeposit: (deposit: DepositAccount) => Promise<void>;
  collections: CollectionRecord[];
  addCollection: (record: CollectionRecord) => Promise<void>;
  partners: WhiteLabelPartner[];
  addPartner: (partner: WhiteLabelPartner) => Promise<void>;
  togglePartnerStatus: (id: string) => void;
  users: SystemUser[];
  addUser: (user: SystemUser) => Promise<void>;
  toggleUserStatus: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain State synced with MongoDB
  const [society, setSociety] = useState<SocietyInfo>(INITIAL_SOCIETY);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [loans, setLoans] = useState<LoanApplication[]>(INITIAL_LOANS);
  const [deposits, setDeposits] = useState<DepositAccount[]>(INITIAL_DEPOSITS);
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [partners, setPartners] = useState<WhiteLabelPartner[]>(INITIAL_PARTNERS);
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);

  // Initialize session & DB data
  useEffect(() => {
    const saved = localStorage.getItem('mc360_admin_session');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error('Session error:', e);
      }
    } else {
      // Default initial session for ease of navigation
      const defaultUser: UserSession = {
        id: 'usr_superadmin_01',
        name: 'Super Admin',
        email: 'superadmin@multicredit.com',
        role: 'Super Admin',
        tenantId: 'TNT001',
        mobile: '+91 98765 43210',
      };
      setCurrentUser(defaultUser);
      localStorage.setItem('mc360_admin_session', JSON.stringify(defaultUser));
    }

    // Auto seed MongoDB
    fetch('/api/seed', { method: 'POST' }).catch(() => {});

    // Fetch live collections from MongoDB
    const fetchDb = async () => {
      try {
        const [cRes, lRes, bRes, aRes, dRes, colRes, pRes, uRes] = await Promise.allSettled([
          fetch('/api/customers').then((r) => r.json()),
          fetch('/api/loans').then((r) => r.json()),
          fetch('/api/branches').then((r) => r.json()),
          fetch('/api/agents').then((r) => r.json()),
          fetch('/api/deposits').then((r) => r.json()),
          fetch('/api/collections').then((r) => r.json()),
          fetch('/api/partners').then((r) => r.json()),
          fetch('/api/users').then((r) => r.json()),
        ]);

        if (cRes.status === 'fulfilled' && cRes.value?.data?.length > 0) setCustomers(cRes.value.data);
        if (lRes.status === 'fulfilled' && lRes.value?.data?.length > 0) setLoans(lRes.value.data);
        if (bRes.status === 'fulfilled' && bRes.value?.data?.length > 0) setBranches(bRes.value.data);
        if (aRes.status === 'fulfilled' && aRes.value?.data?.length > 0) setAgents(aRes.value.data);
        if (dRes.status === 'fulfilled' && dRes.value?.data?.length > 0) setDeposits(dRes.value.data);
        if (colRes.status === 'fulfilled' && colRes.value?.data?.length > 0) setCollections(colRes.value.data);
        if (pRes.status === 'fulfilled' && pRes.value?.data?.length > 0) setPartners(pRes.value.data);
        if (uRes.status === 'fulfilled' && uRes.value?.data?.length > 0) setUsers(uRes.value.data);
      } catch (err) {
        console.warn('Using initial fallback state:', err);
      }
    };

    fetchDb();
  }, []);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mc360_admin_session');
    localStorage.removeItem('mc360_auth_token');
    setIsLogoutModalOpen(false);
    router.push('/admin/login');
  };

  const addBranch = async (newBranch: Branch) => {
    setBranches((prev) => [newBranch, ...prev]);
    try {
      await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranch),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBranchStatus = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b))
    );
  };

  const addAgent = async (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    try {
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a))
    );
  };

  const addCustomer = async (newCust: Customer) => {
    setCustomers((prev) => [newCust, ...prev]);
    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCust),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    );
  };

  const addLoan = async (newLoan: LoanApplication) => {
    setLoans((prev) => [newLoan, ...prev]);
    try {
      await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoan),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateLoanStatus = (id: string, status: LoanStatus, step: LoanApplication['step']) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, step } : l))
    );
  };

  const addDeposit = async (newDep: DepositAccount) => {
    setDeposits((prev) => [newDep, ...prev]);
    try {
      await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDep),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addCollection = async (newCol: CollectionRecord) => {
    setCollections((prev) => [newCol, ...prev]);
    try {
      await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCol),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addPartner = async (newPartner: WhiteLabelPartner) => {
    setPartners((prev) => [newPartner, ...prev]);
    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const togglePartnerStatus = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
    );
  };

  const addUser = async (newUser: SystemUser) => {
    setUsers((prev) => [newUser, ...prev]);
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        society,
        setSociety,
        branches,
        addBranch,
        toggleBranchStatus,
        agents,
        addAgent,
        toggleAgentStatus,
        customers,
        addCustomer,
        toggleCustomerStatus,
        loans,
        addLoan,
        updateLoanStatus,
        deposits,
        addDeposit,
        collections,
        addCollection,
        partners,
        addPartner,
        togglePartnerStatus,
        users,
        addUser,
        toggleUserStatus,
        searchQuery,
        setSearchQuery,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
