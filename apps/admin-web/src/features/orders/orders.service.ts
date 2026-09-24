import { type SalesOrder, type Invoice, type PaymentTransaction } from '@henu/shared';

export const mockOrders: SalesOrder[] = [
  {
    id: 'ord-1',
    order_number: 'HENU-ORD-2026-000089',
    quote_id: 'q-1',
    user_id: 'c-1',
    client_name: 'Alexander Wright',
    client_company: 'Apex Global Technologies',
    title: 'Custom Global CLM Integration',
    total_amount: 4126.46,
    currency: 'USD',
    status: 'in_progress',
    progress_percentage: 65,
    linked_invoice_id: 'inv-1',
    linked_invoice_number: 'HENU-INV-2026-000312',
    milestones: [
      { id: 'm-1', title: 'Architecture Blueprint & Threat Model', completed: true, due_date: '2026-10-03' },
      { id: 'm-2', title: 'Database RLS & Core Entity Schemas', completed: true, due_date: '2026-10-08' },
      { id: 'm-3', title: 'Payment Gateway Integration & Webhooks', completed: false, due_date: '2026-10-12' },
      { id: 'm-4', title: 'Client Acceptance & Production Release', completed: false, due_date: '2026-10-15' },
    ],
    started_at: '2026-09-23T12:00:00Z',
    created_at: '2026-09-23T12:00:00Z',
    updated_at: '2026-09-24T04:00:00Z',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'HENU-INV-2026-000312',
    order_id: 'ord-1',
    quote_id: 'q-1',
    user_id: 'c-1',
    client_name: 'Alexander Wright',
    client_email: 'alexander.wright@apexglobal.com',
    client_company: 'Apex Global Technologies',
    subtotal: 3797,
    tax_amount: 629.46,
    discount_amount: 300,
    total_amount: 4126.46,
    amount_paid: 2000.0,
    amount_due: 2126.46,
    currency: 'USD',
    status: 'partially_paid',
    due_date: '2026-10-05',
    items: [
      {
        id: 'ii-1',
        invoice_id: 'inv-1',
        description: 'Enterprise CLM Architecture (Milestone 1 Deposit)',
        hsn_sac_code: '998313',
        quantity: 1,
        unit_rate: 3797,
        tax_rate_percentage: 18,
        line_total: 3797,
      },
    ],
    created_at: '2026-09-23T12:30:00Z',
    updated_at: '2026-09-24T05:00:00Z',
  },
  {
    id: 'inv-2',
    invoice_number: 'HENU-INV-2026-000313',
    user_id: 'c-2',
    client_name: 'Elena Rostova',
    client_email: 'elena.rostova@vanguard.io',
    client_company: 'Vanguard Dynamics',
    subtotal: 1899,
    tax_amount: 341.82,
    discount_amount: 0,
    total_amount: 2240.82,
    amount_paid: 2240.82,
    amount_due: 0.0,
    currency: 'USD',
    status: 'paid',
    due_date: '2026-09-20',
    items: [
      {
        id: 'ii-2',
        invoice_id: 'inv-2',
        description: 'Interactive 3D WebGL Shader Asset Pack',
        hsn_sac_code: '998314',
        quantity: 1,
        unit_rate: 1899,
        tax_rate_percentage: 18,
        line_total: 1899,
      },
    ],
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-20T16:00:00Z',
  },
];

export const mockPayments: PaymentTransaction[] = [
  {
    id: 'pay-1',
    payment_reference: 'HENU-PAY-2026-000450',
    invoice_id: 'inv-1',
    invoice_number: 'HENU-INV-2026-000312',
    user_id: 'c-1',
    client_name: 'Alexander Wright',
    amount: 2000.0,
    currency: 'USD',
    gateway: 'razorpay',
    gateway_order_id: 'order_Oihw81923kjs',
    gateway_payment_id: 'pay_Kjs8921390al',
    status: 'successful',
    reconciliation_state: 'reconciled',
    created_at: '2026-09-23T13:00:00Z',
    updated_at: '2026-09-23T13:02:00Z',
  },
  {
    id: 'pay-2',
    payment_reference: 'HENU-PAY-2026-000451',
    invoice_id: 'inv-2',
    invoice_number: 'HENU-INV-2026-000313',
    user_id: 'c-2',
    client_name: 'Elena Rostova',
    amount: 2240.82,
    currency: 'USD',
    gateway: 'cashfree',
    gateway_order_id: 'cf_order_99812401',
    gateway_payment_id: 'cf_pay_88190231',
    status: 'successful',
    reconciliation_state: 'reconciled',
    created_at: '2026-09-20T15:58:00Z',
    updated_at: '2026-09-20T16:00:00Z',
  },
];

export class OrderService {
  static async getOrders(): Promise<SalesOrder[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 100));
  }
}

export class InvoiceService {
  static async getInvoices(): Promise<Invoice[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockInvoices), 100));
  }
}

export class PaymentService {
  static async getPayments(): Promise<PaymentTransaction[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockPayments), 100));
  }
}
