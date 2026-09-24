export interface DashboardMetrics {
  totalSales: {
    amount: number;
    growthPercent: number;
    previousAmount: number;
    currency: string;
  };
  outstandingInvoices: {
    amount: number;
    overdueCount: number;
    currency: string;
  };
  paymentsReceived: {
    amount: number;
    settlementRate: number;
    currency: string;
  };
  quoteConversion: {
    ratePercent: number;
    pendingQuotes: number;
  };
  activeClients: {
    count: number;
    newThisWeek: number;
    retentionRate: number;
  };
  activeServices: {
    count: number;
  };
  productsSold: {
    count: number;
  };
  ordersInPipeline: {
    count: number;
    pipelineValue: number;
    currency: string;
  };
  recentActivities: Array<{
    id: string;
    actor: string;
    action: string;
    target: string;
    time: string;
    type: 'quote' | 'payment' | 'invoice' | 'customer' | 'order';
  }>;
  quickApprovals: Array<{
    id: string;
    quoteNumber: string;
    clientName: string;
    serviceName: string;
    amount: number;
    marginPercent: number;
  }>;
}

export const mockDashboardMetrics: DashboardMetrics = {
  totalSales: {
    amount: 4825400,
    growthPercent: 14.2,
    previousAmount: 4220000,
    currency: 'INR',
  },
  outstandingInvoices: {
    amount: 640000,
    overdueCount: 8,
    currency: 'INR',
  },
  paymentsReceived: {
    amount: 3280000,
    settlementRate: 87,
    currency: 'INR',
  },
  quoteConversion: {
    ratePercent: 68.4,
    pendingQuotes: 24,
  },
  activeClients: {
    count: 142,
    newThisWeek: 8,
    retentionRate: 98.2,
  },
  activeServices: {
    count: 28,
  },
  productsSold: {
    count: 315,
  },
  ordersInPipeline: {
    count: 19,
    pipelineValue: 1890000,
    currency: 'INR',
  },
  recentActivities: [
    {
      id: 'act-1',
      actor: 'Apex Global Technologies',
      action: 'accepted proposal for',
      target: 'HENU-QT-2026-000142',
      time: '12m ago',
      type: 'quote',
    },
    {
      id: 'act-2',
      actor: 'Razorpay Gateway',
      action: 'settled ₹4,50,000 for',
      target: 'HENU-INV-2026-000312',
      time: '42m ago',
      type: 'payment',
    },
    {
      id: 'act-3',
      actor: 'Priya Sharma (Sales)',
      action: 'issued approved quote',
      target: 'HENU-QT-2026-000145',
      time: '2h ago',
      type: 'quote',
    },
    {
      id: 'act-4',
      actor: 'CyberCraft Studios',
      action: 'onboarded as Enterprise Client',
      target: 'HENU-CL-2026-000088',
      time: '4h ago',
      type: 'customer',
    },
  ],
  quickApprovals: [
    {
      id: 'qa-1',
      quoteNumber: 'HENU-QT-2026-000146',
      clientName: 'Zenith Logistics Ltd',
      serviceName: 'Enterprise Cloud Migration & CLM Setup',
      amount: 850000,
      marginPercent: 42,
    },
    {
      id: 'qa-2',
      quoteNumber: 'HENU-QT-2026-000147',
      clientName: 'Nova FinTech Corp',
      serviceName: 'Custom Bespoke UI & Smart Invoicing',
      amount: 420000,
      marginPercent: 38,
    },
  ],
};

export class DashboardService {
  static async getMetrics(): Promise<DashboardMetrics> {
    // Simulates API delay; in Phase 6 connects directly to PostgREST view
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardMetrics), 100);
    });
  }
}
