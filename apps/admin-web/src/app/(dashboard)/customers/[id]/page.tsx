'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Clock, 
  MessageSquare, 
  Plus, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Repeat
} from 'lucide-react';

export default function Customer360Page({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'quotes' | 'orders' | 'invoices' | 'payments' | 'recurring' | 'credits'>('timeline');

  // Customer profile
  const customer = {
    id: params.id,
    customer_code: 'HENU-CL-2026-000001',
    company_name: 'Aero Dynamics Inc',
    customer_type: 'BUSINESS',
    industry: 'Aerospace & Defence',
    primary_contact_name: 'Siddharth Rao',
    primary_contact_email: 'siddharth@folio.enterprise',
    primary_contact_phone: '+1 555-019-2834',
    gst_treatment: 'Registered Business - Regular',
    gstin: '29ABCDE1234F2Z5',
    place_of_supply: 'Karnataka (29)',
    currency: 'USD',
    vip_tier: 'Enterprise VIP',
    status: 'ACTIVE',
    billing_address: {
      attention: 'Accounts Payable',
      line1: 'Level 4, Aerospace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560066',
      country: 'India',
    },
    financial_summary: {
      total_quoted: 59760.00,
      total_invoiced: 48250.00,
      total_paid: 35750.00,
      outstanding: 12500.00,
      credit_balance: 0.00,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/customers"
            className="p-2 rounded-lg bg-[#20202B] text-gray-300 hover:text-white hover:bg-[#2E2E37] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{customer.company_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#887DB8]/20 text-[#887DB8] border border-[#887DB8]/30">
                {customer.vip_tier}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {customer.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Customer Code: <span className="text-gray-300 font-mono">{customer.customer_code}</span> • GSTIN: <span className="text-gray-300 font-mono">{customer.gstin}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/quotes?customer=${customer.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#20202B] text-gray-200 hover:text-white hover:bg-[#2E2E37] text-sm font-medium border border-gray-700 transition"
          >
            <FileText className="w-4 h-4 text-[#887DB8]" />
            New Quote
          </Link>
          <Link
            href={`/invoices?customer=${customer.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#887DB8] text-white hover:bg-[#776ca7] text-sm font-medium transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Financial 360 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800 shadow-sm">
          <p className="text-xs text-gray-400">Total Quoted</p>
          <p className="text-xl font-bold text-white mt-1">${customer.financial_summary.total_quoted.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <span>2 Proposals</span>
          </div>
        </div>

        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800 shadow-sm">
          <p className="text-xs text-gray-400">Total Invoiced</p>
          <p className="text-xl font-bold text-white mt-1">${customer.financial_summary.total_invoiced.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <span>3 Invoices issued</span>
          </div>
        </div>

        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800 shadow-sm">
          <p className="text-xs text-gray-400">Total Received</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">${customer.financial_summary.total_paid.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400/80 mt-1">
            <span>2 Settled payments</span>
          </div>
        </div>

        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800 shadow-sm">
          <p className="text-xs text-gray-400">Outstanding Balance</p>
          <p className="text-xl font-bold text-[#C96F61] mt-1">${customer.financial_summary.outstanding.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#C96F61]/80 mt-1">
            <span>Due in 7 days</span>
          </div>
        </div>

        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800 shadow-sm">
          <p className="text-xs text-gray-400">Available Credits</p>
          <p className="text-xl font-bold text-[#D9A441] mt-1">${customer.financial_summary.credit_balance.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <span>Credit notes: $0</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 gap-6 text-sm font-medium">
        {[
          { key: 'timeline', label: '360° Timeline', icon: Clock },
          { key: 'quotes', label: 'Quotes', icon: FileText },
          { key: 'invoices', label: 'Invoices', icon: Receipt },
          { key: 'payments', label: 'Payments', icon: CreditCard },
          { key: 'recurring', label: 'Recurring Profiles', icon: Repeat },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 border-b-2 transition ${
                isActive
                  ? 'border-[#887DB8] text-[#887DB8]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Metadata Card */}
          <div className="bg-[#181B24] p-5 rounded-xl border border-gray-800 space-y-4">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase text-gray-400">Primary Contact</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{customer.primary_contact_name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{customer.primary_contact_email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{customer.primary_contact_phone}</span>
              </div>
            </div>

            <hr className="border-gray-800" />

            <h2 className="text-sm font-semibold text-white tracking-wide uppercase text-gray-400">Billing Address</h2>
            <div className="text-sm text-gray-300 space-y-1">
              <p>{customer.billing_address.attention}</p>
              <p>{customer.billing_address.line1}</p>
              <p>{customer.billing_address.city}, {customer.billing_address.state} - {customer.billing_address.postal_code}</p>
              <p className="text-gray-400">{customer.billing_address.country}</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2 bg-[#181B24] p-5 rounded-xl border border-gray-800 space-y-4">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase text-gray-400">Customer 360° Activity Stream</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Invoice Issued — INV-2026-089',
                  time: '2 hours ago',
                  desc: 'Monthly Engineering Retainer issued for $12,500.00',
                  badge: 'Invoice',
                },
                {
                  title: 'Payment Received — PAY-2026-041',
                  time: 'Yesterday at 4:30 PM',
                  desc: 'Settled $14,000.00 via Razorpay gateway for INV-2026-081',
                  badge: 'Payment',
                },
                {
                  title: 'Quote Approved — QT-2026-0104',
                  time: '3 days ago',
                  desc: 'Siddharth Rao digitally approved Enterprise Architecture Blueprint ($35,760.00)',
                  badge: 'Quote',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-[#20202B]/60 border border-gray-800/80">
                  <div className="p-2 rounded-lg bg-[#887DB8]/20 text-[#887DB8] mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="bg-[#181B24] p-5 rounded-xl border border-gray-800 text-sm text-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Quotes for {customer.company_name}</h3>
            <Link href="/quotes" className="text-xs text-[#887DB8] hover:underline">View All Quotes</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="pb-2">Quote #</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-2.5 font-mono text-white">QT-2026-0104</td>
                <td className="py-2.5">Enterprise Architecture Blueprint</td>
                <td className="py-2.5 font-semibold text-white">$35,760.00</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">APPROVED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-[#181B24] p-5 rounded-xl border border-gray-800 text-sm text-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Invoices for {customer.company_name}</h3>
            <Link href="/invoices" className="text-xs text-[#887DB8] hover:underline">View All Invoices</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="pb-2">Invoice #</th>
                <th className="pb-2">Due Date</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Balance</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-2.5 font-mono text-white">INV-2026-089</td>
                <td className="py-2.5">June 5, 2026</td>
                <td className="py-2.5 font-semibold text-white">$12,500.00</td>
                <td className="py-2.5 font-semibold text-[#C96F61]">$12,500.00</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">SENT</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-white">INV-2026-081</td>
                <td className="py-2.5">May 15, 2026</td>
                <td className="py-2.5 font-semibold text-white">$14,000.00</td>
                <td className="py-2.5 font-semibold text-gray-400">$0.00</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">PAID</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-[#181B24] p-5 rounded-xl border border-gray-800 text-sm text-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Payment Transactions</h3>
            <Link href="/payments" className="text-xs text-[#887DB8] hover:underline">Record Payment</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="pb-2">Payment #</th>
                <th className="pb-2">Mode</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-2.5 font-mono text-white">PAY-2026-041</td>
                <td className="py-2.5">Razorpay Gateway</td>
                <td className="py-2.5 font-semibold text-emerald-400">$14,000.00</td>
                <td className="py-2.5"><span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">COMPLETED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'recurring' && (
        <div className="bg-[#181B24] p-5 rounded-xl border border-gray-800 text-sm text-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Recurring Billing Profiles</h3>
            <Link href="/invoices/recurring" className="text-xs text-[#887DB8] hover:underline">New Recurring Profile</Link>
          </div>
          <div className="p-4 rounded-lg bg-[#20202B]/70 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Monthly Engineering Concierge Retainer</p>
              <p className="text-xs text-gray-400 mt-0.5">Repeats every 1 Month • Next run: July 1, 2026 • Auto-send: ON</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">$12,500.00 / mo</p>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
