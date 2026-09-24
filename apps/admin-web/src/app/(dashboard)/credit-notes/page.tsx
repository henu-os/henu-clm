'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileMinus, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Receipt,
  Download,
  Building2,
  Trash2,
  Save,
  Send,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/feedback/toast';
import { formatCurrencyWords } from '@/lib/finance/number_to_words';

interface CreditNote {
  id: string;
  credit_note_number: string;
  reference_invoice: string;
  customer_name: string;
  date: string;
  reason: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  balance_amount: number;
  currency: string;
  status: 'OPEN' | 'CLOSED' | 'VOID';
}

interface CNLineItem {
  id: string;
  item_details: string;
  account: string;
  quantity: number;
  rate: number;
  tax_rate: number;
  amount: number;
}

export default function CreditNotesPage() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([
    {
      id: 'cn_001',
      credit_note_number: 'CN-2026-0001',
      reference_invoice: 'INV-2026-081',
      customer_name: 'Aero Dynamics Inc',
      date: '2026-05-18',
      reason: 'Discount Granted on Annual Prepayment',
      subtotal: 1000.00,
      tax: 180.00,
      total_amount: 1180.00,
      balance_amount: 1180.00,
      currency: 'INR',
      status: 'OPEN',
    },
  ]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newCreditNote, setNewCreditNote] = useState({
    customer_name: 'Aero Dynamics Inc',
    credit_note_number: `CN-2026-${String(creditNotes.length + 1).padStart(4, '0')}`,
    reference_invoice: 'INV-2026-089',
    reason: 'Correction in Invoice',
    date: new Date().toISOString().split('T')[0],
    salesperson: 'Aarav Sharma',
    subject: 'Credit adjustment on SLA milestone delivery',
    customer_notes: 'This credit note can be adjusted against future invoices or refunded as agreed.',
    terms_conditions: 'Credit notes must be utilized within 180 days from the date of issue.',
    tax_option: 'TDS' as 'TDS' | 'TCS',
    adjustment: 0,
    template: 'Spreadsheet Template',
  });

  const [items, setItems] = useState<CNLineItem[]>([
    {
      id: 'cni_1',
      item_details: 'Engineering Consulting Scope Credit',
      account: 'Sales Returns',
      quantity: 1,
      rate: 1000,
      tax_rate: 18,
      amount: 1180,
    },
  ]);

  const handleItemChange = (id: string, field: keyof CNLineItem, value: any) => {
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
        id: `cni_${Date.now()}`,
        item_details: 'Scope Adjustment Credit',
        account: 'Sales Returns',
        quantity: 1,
        rate: 500,
        tax_rate: 18,
        amount: 590,
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
  const grandTotal = Math.max(0, subtotal + totalTax + Number(newCreditNote.adjustment || 0));

  const handleCreateCreditNote = (status: 'OPEN' | 'CLOSED') => {
    const created: CreditNote = {
      id: `cn_${Date.now()}`,
      credit_note_number: newCreditNote.credit_note_number,
      reference_invoice: newCreditNote.reference_invoice,
      customer_name: newCreditNote.customer_name,
      date: newCreditNote.date,
      reason: newCreditNote.reason,
      subtotal: subtotal,
      tax: totalTax,
      total_amount: grandTotal,
      balance_amount: grandTotal,
      currency: 'INR',
      status: status,
    };

    setCreditNotes([created, ...creditNotes]);
    setIsNewModalOpen(false);
    showToast('success', 'Credit Note Created', `Credit Note ${created.credit_note_number} for ₹${created.total_amount.toLocaleString()} issued.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Credit Notes</h1>
          <p className="text-xs text-gray-400">Issue sales returns, invoice corrections, and granted customer credits</p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Credit Note
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Credit Issued</p>
          <p className="text-2xl font-bold text-white mt-1">₹1,180.00</p>
        </div>
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Balance</p>
          <p className="text-2xl font-bold text-[#887DB8] mt-1">₹1,180.00</p>
        </div>
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Open Notes</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">1</p>
        </div>
      </div>

      {/* Credit Notes Table */}
      <div className="bg-[#181B24] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/60 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Credit Note #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Invoice Ref</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {creditNotes.map((cn) => (
                <tr key={cn.id} className="hover:bg-[#20202B]/40 transition">
                  <td className="py-4 px-4 font-mono font-semibold text-[#887DB8]">{cn.credit_note_number}</td>
                  <td className="py-4 px-4 text-white font-medium">{cn.customer_name}</td>
                  <td className="py-4 px-4 text-xs font-mono text-gray-400">{cn.reference_invoice}</td>
                  <td className="py-4 px-4 text-xs text-gray-300">{cn.date}</td>
                  <td className="py-4 px-4 text-xs text-gray-300">{cn.reason}</td>
                  <td className="py-4 px-4 font-bold text-white">₹{cn.total_amount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {cn.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => showToast('success', 'PDF Export', `Exporting ${cn.credit_note_number} PDF...`)}
                      className="p-1.5 rounded-lg bg-[#20202B] hover:bg-[#2E2E37] text-gray-300 hover:text-white transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW CREDIT NOTE MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create New Credit Note"
        description="Issue official credit adjustments against invoices with tax deduction options and template selection"
        maxWidth="5xl"
      >
        <div className="space-y-5 text-xs text-on-surface">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={newCreditNote.customer_name}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                <option value="Acme Global Ventures">Acme Global Ventures</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reason *</label>
              <select
                value={newCreditNote.reason}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, reason: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Sales Return">Sales Return</option>
                <option value="Correction in Invoice">Correction in Invoice</option>
                <option value="Discount Granted">Discount Granted</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Credit Note # *</label>
              <input
                type="text"
                required
                value={newCreditNote.credit_note_number}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, credit_note_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reference Invoice #</label>
              <input
                type="text"
                value={newCreditNote.reference_invoice}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, reference_invoice: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Credit Note Date *</label>
              <input
                type="date"
                required
                value={newCreditNote.date}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Salesperson</label>
              <input
                type="text"
                value={newCreditNote.salesperson}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, salesperson: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Subject</label>
              <input
                type="text"
                value={newCreditNote.subject}
                onChange={(e) => setNewCreditNote({ ...newCreditNote, subject: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Item Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Line Items
              </h4>
              <Button size="sm" variant="outline" onClick={handleAddRow}>
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
                          <option value="Sales Returns">Sales Returns</option>
                          <option value="Discounts">Discounts Allowed</option>
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

          {/* Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Notes</label>
                <textarea
                  rows={3}
                  value={newCreditNote.customer_notes}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, customer_notes: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={newCreditNote.terms_conditions}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, terms_conditions: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Sub Total:</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Tax Amount:</span>
                <span className="font-semibold text-on-surface">₹{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Adjustment (+ / -):</span>
                <input
                  type="number"
                  value={newCreditNote.adjustment}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, adjustment: Number(e.target.value) })}
                  className="w-24 p-1 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs"
                />
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-outline-variant/80 text-sm">
                <span className="font-bold text-on-surface">Total (₹):</span>
                <span className="font-bold text-primary text-base">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-[11px] text-outline font-medium">
                <span className="font-semibold text-on-surface">Total in Words:</span> {formatCurrencyWords(grandTotal, 'INR')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCreateCreditNote('CLOSED')}>
              <Save className="w-3.5 h-3.5 mr-1" />
              Save as Draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleCreateCreditNote('OPEN')}>
              <Send className="w-3.5 h-3.5 mr-1" />
              Save as Open
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
