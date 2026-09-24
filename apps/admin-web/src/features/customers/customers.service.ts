import { type UserProfile } from '@henu/shared';

export const mockCustomers: UserProfile[] = [
  {
    id: 'c-1',
    client_code: 'HENU-CL-2026-000001',
    first_name: 'Alexander',
    last_name: 'Wright',
    company_name: 'Apex Global Technologies',
    email: 'alexander.wright@apexglobal.com',
    phone: '+1 (555) 019-2834',
    role: 'client',
    vip_tier: 'Enterprise',
    is_active: true,
    total_spent: 1250000,
    active_quotes_count: 2,
    active_orders_count: 1,
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-09-20T14:30:00Z',
  },
  {
    id: 'c-2',
    client_code: 'HENU-CL-2026-000002',
    first_name: 'Elena',
    last_name: 'Rostova',
    company_name: 'Vanguard Dynamics',
    email: 'elena.rostova@vanguard.io',
    phone: '+44 20 7946 0912',
    role: 'client',
    vip_tier: 'Platinum',
    is_active: true,
    total_spent: 840000,
    active_quotes_count: 1,
    active_orders_count: 2,
    created_at: '2026-02-10T11:20:00Z',
    updated_at: '2026-09-22T16:45:00Z',
  },
  {
    id: 'c-3',
    client_code: 'HENU-CL-2026-000003',
    first_name: 'Vikram',
    last_name: 'Mehta',
    company_name: 'Zenith Logistics Ltd',
    email: 'vikram.mehta@zenithlogistics.in',
    phone: '+91 98200 12345',
    role: 'client',
    vip_tier: 'Gold',
    is_active: true,
    total_spent: 450000,
    active_quotes_count: 3,
    active_orders_count: 0,
    created_at: '2026-03-05T08:15:00Z',
    updated_at: '2026-09-23T10:10:00Z',
  },
  {
    id: 'c-4',
    client_code: 'HENU-CL-2026-000004',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    company_name: 'Nexus BioHealth',
    email: 's.jenkins@nexusbio.com',
    phone: '+1 (555) 432-8765',
    role: 'client',
    vip_tier: 'Silver',
    is_active: false,
    total_spent: 120000,
    active_quotes_count: 0,
    active_orders_count: 0,
    created_at: '2026-04-12T13:40:00Z',
    updated_at: '2026-08-15T09:00:00Z',
  },
];

export class CustomerService {
  static async getCustomers(query: { search?: string; vipTier?: string; status?: string }): Promise<UserProfile[]> {
    return new Promise((resolve) => {
      let filtered = [...mockCustomers];
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.first_name.toLowerCase().includes(s) ||
            c.last_name.toLowerCase().includes(s) ||
            c.company_name?.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            c.client_code.toLowerCase().includes(s)
        );
      }
      if (query.vipTier && query.vipTier !== 'all') {
        filtered = filtered.filter((c) => c.vip_tier === query.vipTier);
      }
      if (query.status && query.status !== 'all') {
        const isActive = query.status === 'active';
        filtered = filtered.filter((c) => c.is_active === isActive);
      }
      setTimeout(() => resolve(filtered), 100);
    });
  }

  static async getCustomerById(id: string): Promise<UserProfile | null> {
    const customer = mockCustomers.find((c) => c.id === id);
    return customer || null;
  }
}
