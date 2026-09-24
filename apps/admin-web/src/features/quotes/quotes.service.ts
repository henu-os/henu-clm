import { type Quote, type QuoteStatus } from '@henu/shared';

export const mockQuotes: Quote[] = [
  {
    id: 'q-1',
    quote_number: 'HENU-QT-2026-000142',
    user_id: 'c-1',
    service_id: 's-1',
    service_title: 'Enterprise CLM & Workflow Architecture',
    client_name: 'Alexander Wright',
    client_email: 'alexander.wright@apexglobal.com',
    client_company: 'Apex Global Technologies',
    title: 'Custom Global CLM Integration & Multi-Tenancy',
    project_scope: 'Full deployment of HENU OS CLM with custom multi-tenant PostgreSQL RLS and Razorpay payment auto-collect.',
    subtotal: 3797,
    discount_amount: 300,
    tax_amount: 629.46,
    total_amount: 4126.46,
    estimated_margin: 44.5,
    currency: 'USD',
    status: 'approved',
    admin_notes: 'Priority enterprise client. Fast-track delivery within 14 days.',
    target_start_date: '2026-10-01',
    target_delivery_date: '2026-10-15',
    items: [
      {
        id: 'qi-1',
        quote_id: 'q-1',
        title: 'Enterprise CLM Base Engine',
        quantity: 1,
        unit_price: 2499,
        total_price: 2499,
      },
      {
        id: 'qi-2',
        quote_id: 'q-1',
        title: 'Multi-Gateway Smart Invoicing Add-on',
        quantity: 1,
        unit_price: 799,
        total_price: 799,
      },
      {
        id: 'qi-3',
        quote_id: 'q-1',
        title: 'Realtime Biometric Auth Module',
        quantity: 1,
        unit_price: 499,
        total_price: 499,
      },
    ],
    created_at: '2026-09-22T08:30:00Z',
    updated_at: '2026-09-23T11:00:00Z',
  },
  {
    id: 'q-2',
    quote_number: 'HENU-QT-2026-000143',
    user_id: 'c-2',
    service_id: 's-2',
    service_title: 'Interactive 3D WebGL / Shader Experience',
    client_name: 'Elena Rostova',
    client_email: 'elena.rostova@vanguard.io',
    client_company: 'Vanguard Dynamics',
    title: 'Ethereal Dragon Particle Canvas for Mobile App',
    project_scope: 'Custom GLSL fragment shaders and 60 FPS mobile mesh renderer.',
    subtotal: 2249,
    discount_amount: 0,
    tax_amount: 404.82,
    total_amount: 2653.82,
    estimated_margin: 52.0,
    currency: 'USD',
    status: 'in_review',
    admin_notes: 'Checking GPU compatibility for low-end device profiles.',
    target_start_date: '2026-10-05',
    target_delivery_date: '2026-10-20',
    items: [
      {
        id: 'qi-4',
        quote_id: 'q-2',
        title: 'Interactive 3D WebGL Base Engine',
        quantity: 1,
        unit_price: 1899,
        total_price: 1899,
      },
      {
        id: 'qi-5',
        quote_id: 'q-2',
        title: 'Custom Shaders & Ethereal Trails',
        quantity: 1,
        unit_price: 350,
        total_price: 350,
      },
    ],
    created_at: '2026-09-23T14:15:00Z',
    updated_at: '2026-09-23T14:15:00Z',
  },
  {
    id: 'q-3',
    quote_number: 'HENU-QT-2026-000144',
    user_id: 'c-3',
    service_id: 's-3',
    service_title: 'Zero-Trust Supabase & Cloud Security Hardening',
    client_name: 'Vikram Mehta',
    client_email: 'vikram.mehta@zenithlogistics.in',
    client_company: 'Zenith Logistics Ltd',
    title: 'Logistics Fleet Security Audit & PostgreSQL RLS',
    project_scope: 'Full RLS policies, audit log triggers, and vulnerability penetration test.',
    subtotal: 3200,
    discount_amount: 200,
    tax_amount: 540.0,
    total_amount: 3540.0,
    estimated_margin: 38.0,
    currency: 'USD',
    status: 'submitted',
    created_at: '2026-09-24T02:00:00Z',
    updated_at: '2026-09-24T02:00:00Z',
    items: [
      {
        id: 'qi-6',
        quote_id: 'q-3',
        title: 'Zero-Trust Cloud Security Hardening',
        quantity: 1,
        unit_price: 3200,
        total_price: 3200,
      },
    ],
  },
];

export class QuoteService {
  static async getQuotes(query?: { status?: string; search?: string }): Promise<Quote[]> {
    return new Promise((resolve) => {
      let filtered = [...mockQuotes];
      if (query?.status && query.status !== 'all') {
        filtered = filtered.filter((q) => q.status === query.status);
      }
      if (query?.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (q) =>
            q.quote_number.toLowerCase().includes(s) ||
            q.title.toLowerCase().includes(s) ||
            q.client_name.toLowerCase().includes(s) ||
            q.client_company?.toLowerCase().includes(s)
        );
      }
      setTimeout(() => resolve(filtered), 100);
    });
  }

  static async updateQuoteStatus(quoteId: string, status: QuoteStatus, adminNotes?: string): Promise<Quote> {
    const quote = mockQuotes.find((q) => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');
    quote.status = status;
    if (adminNotes) quote.admin_notes = adminNotes;
    quote.updated_at = new Date().toISOString();
    return quote;
  }
}
