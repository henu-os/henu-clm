'use client';

import * as React from 'react';
import {
  TrendingUp,
  UserPlus,
  FileText,
  ShoppingBag,
  Receipt,
  Layers,
  Tag,
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardService, type DashboardMetrics } from '@/features/dashboard/dashboard.service';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function DashboardPage() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [timeRange, setTimeRange] = React.useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const { showToast } = useToast();

  React.useEffect(() => {
    DashboardService.getMetrics().then(setMetrics);
  }, []);

  const handleQuickApprove = (quoteNumber: string) => {
    showToast('success', 'Quote Approved', `Quote ${quoteNumber} has been approved and proposal dispatched.`);
    if (metrics) {
      setMetrics({
        ...metrics,
        quickApprovals: metrics.quickApprovals.filter((q) => q.quoteNumber !== quoteNumber),
      });
    }
  };

  if (!metrics) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-surface-container rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-surface-container rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Top Welcome Header & Quick Action Pills */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-on-surface">Good morning, Aarav</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-primary">
                HENU OS CLM v3.8
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Simple systems. Real progress. Here's what's happening with HENU OS CLM today.
            </p>
          </div>
          <div className="text-xs text-outline flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded border border-outline-variant/40">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Real-time Sync Active · Last updated 12s ago</span>
          </div>
        </div>

        {/* Quick Action Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <a
            href="/customers"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-primary" />
            <span>+ New Customer</span>
          </a>
          <a
            href="/quotes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>+ New Quote</span>
          </a>
          <a
            href="/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <span>+ New Sales Order</span>
          </a>
          <a
            href="/invoices"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5 text-primary" />
            <span>+ New Invoice</span>
          </a>
          <a
            href="/catalog"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>+ New Service</span>
          </a>
          <a
            href="/cms"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>+ New Offer</span>
          </a>
          <a
            href="/catalog"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary hover:text-primary transition-colors whitespace-nowrap shadow-xs"
          >
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>+ New Product</span>
          </a>
        </div>
      </section>

      {/* KPI METRIC TILES (8 Cards: 4 across desktop grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Total Sales */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Sales</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +{metrics.totalSales.growthPercent}%
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-on-surface">
              {formatCurrency(metrics.totalSales.amount, metrics.totalSales.currency)}
            </span>
            <svg className="w-16 h-7 text-tertiary" fill="none" viewBox="0 0 64 28">
              <path d="M2 24 L14 18 L26 22 L38 12 L50 14 L62 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-xs text-outline mt-1">vs last month (₹42.2L)</span>
        </Card>

        {/* Card 2: Outstanding Invoices */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Outstanding</span>
            <Badge variant="danger">{metrics.outstandingInvoices.overdueCount} overdue</Badge>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-on-surface">
              {formatCurrency(metrics.outstandingInvoices.amount, metrics.outstandingInvoices.currency)}
            </span>
            <svg className="w-16 h-7 text-error" fill="none" viewBox="0 0 64 28">
              <path d="M2 6 L14 12 L26 8 L38 19 L50 15 L62 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-xs text-outline mt-1">Action required within 5d</span>
        </Card>

        {/* Card 3: Payments Received */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Payments Received</span>
            <Badge variant="secondary">This Month</Badge>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-on-surface">
              {formatCurrency(metrics.paymentsReceived.amount, metrics.paymentsReceived.currency)}
            </span>
            <svg className="w-16 h-7 text-secondary" fill="none" viewBox="0 0 64 28">
              <path d="M2 22 L14 19 L26 15 L38 17 L50 8 L62 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-xs text-outline mt-1">{metrics.paymentsReceived.settlementRate}% settlement through gateways</span>
        </Card>

        {/* Card 4: Quote Conversion */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Conversion Rate</span>
            <Badge variant="primary">{metrics.quoteConversion.pendingQuotes} Pending</Badge>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-on-surface">{metrics.quoteConversion.ratePercent}%</span>
            <svg className="w-16 h-7 text-primary" fill="none" viewBox="0 0 64 28">
              <path d="M2 16 L14 14 L26 18 L38 9 L50 11 L62 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-xs text-outline mt-1">+4.8% industry average</span>
        </Card>

        {/* Card 5: Active Clients */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Clients</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
              +{metrics.activeClients.newThisWeek} this week
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-on-surface">{metrics.activeClients.count}</span>
          </div>
          <span className="text-xs text-outline mt-1">{metrics.activeClients.retentionRate}% enterprise retention</span>
        </Card>

        {/* Card 6: Active Services */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Services</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
              In Catalogue
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-on-surface">{metrics.activeServices.count}</span>
          </div>
          <span className="text-xs text-outline mt-1">Custom engineering & consulting</span>
        </Card>

        {/* Card 7: Products Sold */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Products Sold</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
              Digital & Source
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-on-surface">{metrics.productsSold.count}</span>
          </div>
          <span className="text-xs text-outline mt-1">Licenses & micro-modules</span>
        </Card>

        {/* Card 8: Orders in Pipeline */}
        <Card className="p-space-md flex flex-col justify-between hover:bg-surface-container-low/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Orders in Pipeline</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
              ₹18.9L value
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-on-surface">{metrics.ordersInPipeline.count}</span>
          </div>
          <span className="text-xs text-outline mt-1">Scheduled for fulfillment</span>
        </Card>
      </section>

      {/* MAIN CONTENT SPLIT VIEW (8 cols Chart / 4 cols Approvals & Feed) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Revenue Trend Area Chart */}
        <div className="lg:col-span-8 space-y-space-lg">
          <Card className="p-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/30 gap-3">
              <div>
                <h2 className="text-base font-bold text-on-surface">Revenue & Sales Performance</h2>
                <p className="text-xs text-outline">Real-time performance comparison vs previous cycle</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 mr-2">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <span>Target</span>
                  </div>
                </div>

                <div className="inline-flex bg-surface-container-low p-0.5 rounded border border-outline-variant/50">
                  {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        timeRange === r
                          ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Trend Graph matching Stitch UI */}
            <div className="pt-6">
              <div className="relative w-full h-56">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                  <div className="border-b border-outline-variant/50 w-full flex justify-end">
                    <span className="text-[10px] text-outline -translate-y-2">₹50L</span>
                  </div>
                  <div className="border-b border-outline-variant/50 w-full flex justify-end">
                    <span className="text-[10px] text-outline -translate-y-2">₹35L</span>
                  </div>
                  <div className="border-b border-outline-variant/50 w-full flex justify-end">
                    <span className="text-[10px] text-outline -translate-y-2">₹20L</span>
                  </div>
                  <div className="border-b border-outline-variant/50 w-full flex justify-end">
                    <span className="text-[10px] text-outline -translate-y-2">₹5L</span>
                  </div>
                </div>

                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 200">
                  <defs>
                    <linearGradient id="primaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#5e548c" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#5e548c" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#primaryAreaGrad)"
                    points="0,170 70,140 140,150 210,110 280,120 350,80 420,95 490,60 560,70 630,30 700,20 700,200 0,200"
                  />
                  <path
                    d="M0,170 L70,140 L140,150 L210,110 L280,120 L350,80 L420,95 L490,60 L560,70 L630,30 L700,20"
                    fill="none"
                    stroke="#5e548c"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0,150 L70,145 L140,130 L210,125 L280,110 L350,95 L420,80 L490,75 L560,55 L630,45 L700,40"
                    fill="none"
                    stroke="#7a5500"
                    strokeDasharray="4 4"
                    strokeOpacity="0.75"
                    strokeWidth="1.5"
                  />
                  <circle cx="210" cy="110" fill="#ffffff" r="3.5" stroke="#5e548c" strokeWidth="2" />
                  <circle cx="490" cy="60" fill="#ffffff" r="3.5" stroke="#5e548c" strokeWidth="2" />
                  <circle cx="700" cy="20" fill="#ffffff" r="4" stroke="#5e548c" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex justify-between pt-3 text-[10px] text-outline border-t border-outline-variant/40 mt-1">
                <span>01 May</span>
                <span>06 May</span>
                <span>12 May</span>
                <span>18 May</span>
                <span>24 May</span>
                <span>30 May (Projected)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Approvals & Live Activity Feed */}
        <div className="lg:col-span-4 space-y-space-lg">
          {/* Quick Approvals Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-tertiary" />
                <span>Pending Approvals</span>
              </CardTitle>
              <Badge variant="warning">{metrics.quickApprovals.length} Quotes</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.quickApprovals.length === 0 ? (
                <div className="text-center py-6 text-xs text-outline">All pending quotes reviewed.</div>
              ) : (
                metrics.quickApprovals.map((q) => (
                  <div key={q.id} className="p-3 bg-surface-container-low rounded border border-outline-variant/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{q.quoteNumber}</span>
                      <span className="text-xs font-bold text-primary">₹{(q.amount / 1000).toFixed(0)}k</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate font-medium">{q.clientName}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-secondary font-semibold">Margin: ~{q.marginPercent}%</span>
                      <Button size="sm" variant="primary" onClick={() => handleQuickApprove(q.quoteNumber)}>
                        Approve Proposal
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Live Operational Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 pb-2.5 border-b border-outline-variant/30 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface leading-snug">
                      <span className="font-semibold">{act.actor}</span> {act.action}{' '}
                      <span className="font-semibold text-primary">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-outline">{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
