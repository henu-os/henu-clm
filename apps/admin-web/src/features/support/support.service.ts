import {
  type SupportConversation,
  type QuickActionItem,
  type AppNotification,
  type PaymentGatewayConfig,
  type AIAssistantConfig,
} from '@henu/shared';

export const mockConversations: SupportConversation[] = [
  {
    id: 'conv-1',
    ticket_number: 'HENU-SUP-2026-001024',
    user_id: 'c-1',
    client_name: 'Alexander Wright',
    client_company: 'Apex Global Technologies',
    title: 'Question regarding Milestone 2 deliverable timeline',
    category: 'Project Delivery',
    status: 'open',
    priority: 'high',
    unread_count: 1,
    last_message: 'Could you confirm if the RLS schema includes test automation scripts?',
    last_message_at: '2026-09-24T04:15:00Z',
    created_at: '2026-09-24T03:00:00Z',
    messages: [
      {
        id: 'm-1',
        sender_id: 'c-1',
        sender_name: 'Alexander Wright',
        sender_role: 'client',
        message_text: 'Hi team, reviewing the architecture blueprint for Milestone 2.',
        is_internal_note: false,
        created_at: '2026-09-24T03:00:00Z',
      },
      {
        id: 'm-2',
        sender_id: 'c-1',
        sender_name: 'Alexander Wright',
        sender_role: 'client',
        message_text: 'Could you confirm if the RLS schema includes test automation scripts?',
        is_internal_note: false,
        created_at: '2026-09-24T04:15:00Z',
      },
    ],
  },
];

export const mockQuickActions: QuickActionItem[] = [
  {
    id: 'qa-1',
    title: 'Custom Quote',
    subtitle: 'Bespoke Estimation',
    icon_name: 'request_quote',
    action_type: 'navigate',
    target_route: '/quotes/new',
    badge_text: 'Fast Track',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'qa-2',
    title: 'Services',
    subtitle: 'Explore Catalog',
    icon_name: 'inventory_2',
    action_type: 'navigate',
    target_route: '/services',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'qa-3',
    title: 'Invoices',
    subtitle: 'Pay & Statements',
    icon_name: 'receipt_long',
    action_type: 'navigate',
    target_route: '/billing',
    badge_text: 'Due',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'qa-4',
    title: 'Support Desk',
    subtitle: 'Direct Assistance',
    icon_name: 'support_agent',
    action_type: 'navigate',
    target_route: '/support',
    display_order: 4,
    is_active: true,
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'admin',
    title: 'New Quote Request Submitted',
    body: 'Alexander Wright submitted HENU-QT-2026-000142 ($4,126.46)',
    category: 'quote',
    action_url: '/quotes',
    is_read: false,
    created_at: '2026-09-24T05:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'admin',
    title: 'Payment Reconciled Successfully',
    body: 'Razorpay settled ₹4,50,000 against invoice HENU-INV-2026-000312',
    category: 'billing',
    action_url: '/payments',
    is_read: true,
    created_at: '2026-09-24T03:30:00Z',
  },
];

export const mockGatewayConfigs: PaymentGatewayConfig[] = [
  {
    gateway: 'razorpay',
    enabled: true,
    environment: 'test',
    key_id_masked: 'rzp_test_************',
    secret_configured: true,
    webhook_secret_configured: true,
    last_tested_at: '2026-09-24T04:30:00Z',
    status: 'connected',
  },
  {
    gateway: 'cashfree',
    enabled: true,
    environment: 'test',
    key_id_masked: 'TEST************',
    secret_configured: true,
    webhook_secret_configured: true,
    last_tested_at: '2026-09-24T04:31:00Z',
    status: 'connected',
  },
];

export const mockAIConfig: AIAssistantConfig = {
  provider: 'openai',
  model: 'gpt-4o',
  enabled: true,
  api_key_configured: true,
  temperature: 0.7,
  context_message_limit: 20,
  request_timeout_ms: 30000,
  status: 'connected',
  last_tested_at: '2026-09-24T04:00:00Z',
};

export class SupportService {
  static async getConversations(): Promise<SupportConversation[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockConversations), 100));
  }
}

export class CmsService {
  static async getQuickActions(): Promise<QuickActionItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockQuickActions), 100));
  }
}

export class NotificationService {
  static async getNotifications(): Promise<AppNotification[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockNotifications), 100));
  }
}

export class SettingsService {
  static async getPaymentGateways(): Promise<PaymentGatewayConfig[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockGatewayConfigs), 100));
  }

  static async getAIConfig(): Promise<AIAssistantConfig> {
    return new Promise((resolve) => setTimeout(() => resolve(mockAIConfig), 100));
  }
}
