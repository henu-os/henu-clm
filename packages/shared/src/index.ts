import { z } from 'zod';

// ==========================================
// 1. ENUMS & CONSTANTS
// ==========================================
export type UserRole = 'super_admin' | 'admin' | 'sales' | 'finance' | 'support' | 'content_manager' | 'client';

export type QuoteStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'expired' | 'converted_to_order';

export type OrderStatus = 'pending_deposit' | 'in_progress' | 'review_pending' | 'completed' | 'cancelled';

export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'voided' | 'refunded';

export type PaymentStatus = 'initiated' | 'processing' | 'successful' | 'failed' | 'refunded' | 'partially_refunded';

export type PaymentGateway = 'razorpay' | 'cashfree' | 'bank_transfer' | 'manual';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type SupportStatus = 'open' | 'waiting_on_client' | 'waiting_on_agent' | 'resolved' | 'closed' | 'reopened';

export type VIPTier = 'Standard' | 'Silver' | 'Gold' | 'Platinum' | 'Enterprise';

// ==========================================
// 2. PERMISSION CODES
// ==========================================
export const PERMISSIONS = {
  CUSTOMERS_VIEW_ALL: 'customers.profile.view_all',
  CUSTOMERS_UPDATE_ALL: 'customers.profile.update_all',
  QUOTES_VIEW_ALL: 'quotes.quote.view_all',
  QUOTES_MODIFY_PRICING: 'quotes.quote.modify_pricing',
  QUOTES_UPDATE_STATUS: 'quotes.quote.update_status',
  INVOICES_VIEW_ALL: 'invoices.invoice.view_all',
  INVOICES_CREATE: 'invoices.invoice.create',
  INVOICES_VOID: 'invoices.invoice.void',
  PAYMENTS_VIEW_ALL: 'payments.transaction.view_all',
  PAYMENTS_REFUND: 'payments.refund.issue',
  CATALOG_SERVICE_MANAGE: 'catalog.service.manage',
  CATALOG_OFFER_MANAGE: 'catalog.offer.manage',
  CMS_CONTENT_MANAGE: 'cms.content.manage',
  SYSTEM_SETTINGS_MANAGE: 'system.settings.manage',
  SYSTEM_GATEWAYS_MANAGE: 'system.gateways.manage',
  AUDIT_LOGS_VIEW: 'audit.logs.view',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ==========================================
// 3. ENTITY INTERFACES
// ==========================================
export interface UserProfile {
  id: string;
  client_code: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  vip_tier: VIPTier;
  is_active: boolean;
  total_spent: number;
  active_quotes_count: number;
  active_orders_count: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  icon_name: string;
  thumbnail_url?: string;
  base_price: number;
  currency: string;
  turnaround_time: string;
  is_featured: boolean;
  display_order: number;
  status: ContentStatus;
  addons?: ServiceAddon[];
  created_at: string;
  updated_at: string;
}

export interface ServiceAddon {
  id: string;
  service_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  is_mandatory: boolean;
  display_order: number;
  status: ContentStatus;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  user_id: string;
  service_id?: string;
  service_title?: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  title: string;
  project_scope: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  estimated_margin?: number;
  currency: string;
  status: QuoteStatus;
  rejection_reason?: string;
  admin_notes?: string;
  target_start_date?: string;
  target_delivery_date?: string;
  items: QuoteItem[];
  attachments?: Array<{ name: string; url: string; size: number }>;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  quote_id: string;
  user_id: string;
  client_name: string;
  client_company?: string;
  title: string;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  progress_percentage: number;
  linked_invoice_id?: string;
  linked_invoice_number?: string;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    due_date?: string;
  }>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  hsn_sac_code?: string;
  quantity: number;
  unit_rate: number;
  tax_rate_percentage: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id?: string;
  quote_id?: string;
  user_id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string;
  pdf_storage_path?: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  payment_reference: string;
  invoice_id: string;
  invoice_number: string;
  user_id: string;
  client_name: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  status: PaymentStatus;
  reconciliation_state: 'reconciled' | 'pending' | 'mismatch';
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportConversation {
  id: string;
  ticket_number: string;
  user_id: string;
  client_name: string;
  client_company?: string;
  title: string;
  category: string;
  status: SupportStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  unread_count: number;
  last_message: string;
  last_message_at: string;
  assigned_to?: string;
  created_at: string;
  messages: Array<{
    id: string;
    sender_id: string;
    sender_name: string;
    sender_role: 'admin' | 'client';
    message_text: string;
    is_internal_note: boolean;
    created_at: string;
    attachments?: string[];
  }>;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon_name: string;
  action_type: string;
  target_route: string;
  badge_text?: string;
  display_order: number;
  is_active: boolean;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  category: 'quote' | 'order' | 'billing' | 'system' | 'support';
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface PaymentGatewayConfig {
  gateway: 'razorpay' | 'cashfree';
  enabled: boolean;
  environment: 'test' | 'live';
  key_id_masked: string;
  secret_configured: boolean;
  webhook_secret_configured: boolean;
  last_tested_at?: string;
  status: 'connected' | 'unconfigured' | 'error';
}

export interface AIAssistantConfig {
  provider: 'openai' | 'anthropic' | 'google-gemini';
  model: string;
  enabled: boolean;
  api_key_configured: boolean;
  temperature: number;
  context_message_limit: number;
  request_timeout_ms: number;
  status: 'connected' | 'unconfigured' | 'error';
  last_tested_at?: string;
}

// ==========================================
// 4. API UNIFORM ENVELOPE & ZOD SCHEMAS
// ==========================================
export interface ApiResponse<T> {
  success: true;
  data: T;
  metadata?: {
    total_count?: number;
    page?: number;
    limit?: number;
    timestamp?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Zod validation schemas
export const CustomerFormSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  company_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  vip_tier: z.enum(['Standard', 'Silver', 'Gold', 'Platinum', 'Enterprise']).default('Standard'),
  is_active: z.boolean().default(true),
});

export const ServiceFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  tagline: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  icon_name: z.string().min(2, 'Icon name is required'),
  base_price: z.number().min(0, 'Base price must be positive'),
  currency: z.string().default('USD'),
  turnaround_time: z.string().min(2, 'Turnaround time is required'),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export const QuoteApprovalSchema = z.object({
  quote_id: z.string().uuid(),
  final_amount: z.number().min(0.01, 'Final amount must be greater than 0'),
  admin_notes: z.string().optional(),
});

export const QuoteRejectionSchema = z.object({
  quote_id: z.string().uuid(),
  rejection_reason: z.string().min(5, 'Rejection reason is required (min 5 chars)'),
});
