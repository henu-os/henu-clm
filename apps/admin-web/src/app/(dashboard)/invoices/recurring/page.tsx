'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Repeat, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PauseCircle, 
  PlayCircle,
  MoreVertical,
  ArrowRight,
  Receipt,
  Trash2,
  FileSpreadsheet,
  Save,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/feedback/toast';
import { formatCurrencyWords } from '@/lib/finance/number_to_words';

interface RecurringProfile {
  id: string;
  profile_name: string;
  customer_name: string;
  repeat_every: string;
  repeat_interval: number;
  start_date: string;
  end_condition: string;
  total_amount: number;
  currency: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  next_run_date: string;
  auto_send: boolean;
}

interface RecLineItem {
  id: string;
  item_details: string;
  account: string;
  quantity: number;
  rate: number;
  tax_rate: number;
  amount: number;
}

export default function RecurringInvoicesPage() {
  const [profiles, setProfiles] = useState<RecurringProfile[]>([
    {
      id: 'rec_001',
      profile_name: 'Monthly Engineering Retainer',
      customer_name: 'Aero Dynamics Inc',
      repeat_every: 'MONTH',
      repeat_interval: 1,
      start_date: '2026-01-01',
      end_condition: 'NEVER',
      total_amount: 14750.00,
      currency: 'INR',
      status: 'ACTIVE',
      next_run_date: '2026-07-01',
      auto_send: true,
    },
    {
      id: 'rec_002',
      profile_name: 'Cloud Infrastructure Monitoring SLA',
      customer_name: 'Acme Global Ventures',
      repeat_every: 'MONTH',
      repeat_interval: 1,
      start_date: '2026-03-01',
      end_condition: 'AFTER_OCCURRENCES',
      total_amount: 5900.00,
      currency: 'INR',
      status: 'ACTIVE',
      next_run_date: '2026-07-01',
      auto_send: true,
    },
  ]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newProfile, setNewProfile] = useState({
    profile_name: '',
    customer_name: 'Aero Dynamics Inc',
    repeat_every: 'MONTH',
    repeat_interval: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date_type: 'NEVER' as 'NEVER' | 'AT_DATE' | 'AFTER_OCCURRENCES',
    end_date: '',
    occurrences: 12,
    payment_terms: 'Due on Receipt',
    salesperson: 'Aarav Sharma',
    customer_notes: 'Monthly retainer fee billed automatically according to SLA terms.',
    terms_conditions: 'Payment due on receipt. Standard SLA uptime commitments apply.',
    auto_action: 'CREATE_AND_SEND' as 'CREATE_DRAFT' | 'CREATE_AND_SEND' | 'AUTO_CHARGE',
  });

  const [items, setItems] = useState<RecLineItem[]>([
    {
      id: 'item_1',
      item_details: 'Dedicated Engineering & Maintenance Retainer',
      account: 'Sales',
      quantity: 1,
      rate: 12500,
      tax_rate: 18,
      amount: 14750,
    },
  ]);

  const handleItemChange = (id: string, field: keyof RecLineItem, value: any) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          const qty = Number(updated.quantity) || 0;
          const rate = Number(updated.rate) || 0;
          const taxPct = Number(updated.tax_rate) || 0;
          const taxable = qty * rate;
          const tax = taxable * (taxPct / 100);
          updated.amount = taxable + tax;
          return updated;
        }
        return row;
      })
    );
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        item_details: 'Cloud Telemetry & Log Ingestion Retainer',
        account: 'Sales',
        quantity: 1,
        rate: 2500,
        tax_rate: 18,
        amount: 2950,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((r) => r.id !== id));
  };

  const subtotal = items.reduce((acc, r) => acc + (Number(r.quantity) || 0) * (Number(r.rate) || 0), 0);
  const totalTax = items.reduce((acc, r) => {
    const base = (Number(r.quantity) || 0) * (Number(r.rate) || 0);
    return acc + base * ((Number(r.tax_rate) || 0) / 100);
  }, 0);
  const grandTotal = subtotal + totalTax;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.profile_name) return;

    const created: RecurringProfile = {
      id: `rec_${Date.now()}`,
      profile_name: newProfile.profile_name,
      customer_name: newProfile.customer_name,
      repeat_every: newProfile.repeat_every,
      repeat_interval: newProfile.repeat_interval,
      start_date: newProfile.start_date,
      end_condition: newProfile.end_date_type,
      total_amount: grandTotal,
      currency: 'INR',
      status: 'ACTIVE',
      next_run_date: '2026-08-01',
      auto_send: newProfile.auto_action === 'CREATE_AND_SEND',
    };

    setProfiles([created, ...profiles]);
    setIsNewModalOpen(false);
    showToast('success', 'Recurring Profile Created', `${created.profile_name} scheduled for ${created.customer_name}.`);
  };

  const toggleStatus = (id: string) => {
    setProfiles(
      profiles.map((p) => {
        if (p.id === id) {
          const next = p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          showToast('info', 'Status Updated', `Profile ${p.profile_name} set to ${next}.`);
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-outline mb-1">
            <Link href="/invoices" className="hover:text-primary transition">Invoices</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Recurring</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight mt-1">Recurring Invoices</h1>
          <p className="text-xs text-on-surface-variant">Automate recurring billing cycles and scheduled invoice generation</p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Recurring Profile</span>
        </Button>
      </div>

      {/* Profiles Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <div className="p-3 border-b border-outline-variant/50 bg-surface-container-low/30 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recurring profiles..."
              className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-xs text-outline font-medium">{profiles.length} Total Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-low/60 text-xs font-semibold uppercase text-on-surface-variant tracking-wider">
                <th className="py-3.5 px-4">Profile Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Frequency</th>
                <th className="py-3.5 px-4">Next Run Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-surface-container-low/40 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-on-surface">{profile.profile_name}</p>
                    <p className="text-[11px] text-outline mt-0.5">
                      Auto-send: {profile.auto_send ? 'Enabled' : 'Draft only'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface font-semibold">{profile.customer_name}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    Every {profile.repeat_interval} {profile.repeat_every.toLowerCase()}
                  </td>
                  <td className="py-3.5 px-4 text-outline font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{profile.next_run_date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface font-mono">
                    ₹{profile.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'warning'}>
                      {profile.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(profile.id)}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      {profile.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* NEW RECURRING PROFILE MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create New Recurring Invoice Profile"
        description="Configure automated billing frequency, end conditions, itemized line items, and auto-dispatch options"
        maxWidth="5xl"
      >
        <form onSubmit={handleCreateProfile} className="space-y-5 text-xs text-on-surface">
          {/* Schedule & Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <div className="md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Profile Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Monthly Dedicated Engineering Retainer"
                value={newProfile.profile_name}
                onChange={(e) => setNewProfile({ ...newProfile, profile_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-semibold text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer *</label>
              <select
                value={newProfile.customer_name}
                onChange={(e) => setNewProfile({ ...newProfile, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                <option value="Acme Global Ventures">Acme Global Ventures</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Repeat Every *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  value={newProfile.repeat_interval}
                  onChange={(e) => setNewProfile({ ...newProfile, repeat_interval: Number(e.target.value) })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                />
                <select
                  value={newProfile.repeat_every}
                  onChange={(e) => setNewProfile({ ...newProfile, repeat_every: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="WEEK">Week(s)</option>
                  <option value="MONTH">Month(s)</option>
                  <option value="YEAR">Year(s)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={newProfile.start_date}
                onChange={(e) => setNewProfile({ ...newProfile, start_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Terms</label>
              <select
                value={newProfile.payment_terms}
                onChange={(e) => setNewProfile({ ...newProfile, payment_terms: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">End Condition</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="end_cond"
                    checked={newProfile.end_date_type === 'NEVER'}
                    onChange={() => setNewProfile({ ...newProfile, end_date_type: 'NEVER' })}
                  />
                  <span>Never Expires</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="end_cond"
                    checked={newProfile.end_date_type === 'AT_DATE'}
                    onChange={() => setNewProfile({ ...newProfile, end_date_type: 'AT_DATE' })}
                  />
                  <span>At Specific Date</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="end_cond"
                    checked={newProfile.end_date_type === 'AFTER_OCCURRENCES'}
                    onChange={() => setNewProfile({ ...newProfile, end_date_type: 'AFTER_OCCURRENCES' })}
                  />
                  <span>After Occurrences</span>
                </label>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Line Items
              </h4>
              <Button size="sm" variant="outline" type="button" onClick={handleAddRow}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Row
              </Button>
            </div>

            <div className="border border-outline-variant/60 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-semibold uppercase text-outline">
                    <th className="p-2.5">Item Details</th>
                    <th className="p-2.5 w-32">Account</th>
                    <th className="p-2.5 w-20 text-center">Qty</th>
                    <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                    <th className="p-2.5 w-24 text-center">Tax Rate</th>
                    <th className="p-2.5 w-28 text-right">Amount (₹)</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {items.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.item_details}
                          onChange={(e) => handleItemChange(row.id, 'item_details', e.target.value)}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.account}
                          onChange={(e) => handleItemChange(row.id, 'account', e.target.value)}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                        >
                          <option value="Sales">Sales</option>
                          <option value="Retainer Revenue">Retainer Revenue</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleItemChange(row.id, 'quantity', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.rate}
                          onChange={(e) => handleItemChange(row.id, 'rate', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.tax_rate}
                          onChange={(e) => handleItemChange(row.id, 'tax_rate', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center text-xs"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </td>
                      <td className="p-2 text-right font-bold text-on-surface">
                        ₹{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="text-error/70 hover:text-error transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automation Options & Total Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-on-surface">Invoice Automation Action</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="auto_act"
                    checked={newProfile.auto_action === 'CREATE_DRAFT'}
                    onChange={() => setNewProfile({ ...newProfile, auto_action: 'CREATE_DRAFT' })}
                  />
                  <span>Create Invoice as Draft only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="auto_act"
                    checked={newProfile.auto_action === 'CREATE_AND_SEND'}
                    onChange={() => setNewProfile({ ...newProfile, auto_action: 'CREATE_AND_SEND' })}
                  />
                  <span>Create & Dispatch to Customer (Email & Mobile)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="auto_act"
                    checked={newProfile.auto_action === 'AUTO_CHARGE'}
                    onChange={() => setNewProfile({ ...newProfile, auto_action: 'AUTO_CHARGE' })}
                  />
                  <span>Auto-charge Customer Card / Bank mandate</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Sub Total:</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Tax Amount (GST):</span>
                <span className="font-semibold text-on-surface">₹{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-outline-variant/80 text-sm">
                <span className="font-bold text-on-surface">Cycle Total (₹):</span>
                <span className="font-bold text-primary text-base">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-[11px] text-outline font-medium">
                <span className="font-semibold text-on-surface">Total in Words:</span> {formatCurrencyWords(grandTotal, 'INR')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Recurring Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
