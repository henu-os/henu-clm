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
  Building2
} from 'lucide-react';

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
      currency: 'USD',
      status: 'OPEN',
    },
  ]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCreditNote, setNewCreditNote] = useState({
    customer_name: 'Aero Dynamics Inc',
    reference_invoice: 'INV-2026-089',
    reason: 'INVOICE_CORRECTION',
    amount: 1000,
    notes: '',
  });

  const handleCreateCreditNote = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newCreditNote.amount);
    const tax = Math.round(amount * 0.18 * 100) / 100;
    const total = amount + tax;

    const created: CreditNote = {
      id: `cn_${Date.now()}`,
      credit_note_number: `CN-2026-${String(creditNotes.length + 1).padStart(4, '0')}`,
      reference_invoice: newCreditNote.reference_invoice,
      customer_name: newCreditNote.customer_name,
      date: new Date().toISOString().split('T')[0],
      reason: newCreditNote.reason.replace(/_/g, ' '),
      subtotal: amount,
      tax,
      total_amount: total,
      balance_amount: total,
      currency: 'USD',
      status: 'OPEN',
    };

    setCreditNotes([created, ...creditNotes]);
    setIsNewModalOpen(false);
    setNewCreditNote({
      customer_name: 'Aero Dynamics Inc',
      reference_invoice: 'INV-2026-089',
      reason: 'INVOICE_CORRECTION',
      amount: 1000,
      notes: '',
    });
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
          Create Credit Note
        </button>
      </div>

      {/* Credit Notes Table */}
      <div className="bg-[#181B24] rounded-xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search credit notes by number, customer..."
              className="w-full pl-9 pr-4 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#887DB8]"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{creditNotes.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/40 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Credit Note #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Ref Invoice</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {creditNotes.map((cn) => (
                <tr key={cn.id} className="hover:bg-[#20202B]/50 transition">
                  <td className="py-4 px-4 font-mono font-bold text-white">{cn.credit_note_number}</td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cn.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300 font-medium">{cn.customer_name}</td>
                  <td className="py-4 px-4 text-gray-400 font-mono text-xs">{cn.reference_invoice}</td>
                  <td className="py-4 px-4 text-gray-300 text-xs">{cn.reason}</td>
                  <td className="py-4 px-4 font-bold text-[#D9A441]">
                    ${cn.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        cn.status === 'OPEN'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {cn.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-[#20202B] hover:bg-[#2E2E37] text-gray-300 hover:text-white transition">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Credit Note Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#20202B]/40">
              <div className="flex items-center gap-2 text-white font-semibold">
                <FileMinus className="w-5 h-5 text-[#887DB8]" />
                <span>Create Credit Note</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCreditNote} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Customer *</label>
                <select
                  value={newCreditNote.customer_name}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, customer_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                >
                  <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                  <option value="Acme Global Ventures">Acme Global Ventures</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Reference Invoice</label>
                  <input
                    type="text"
                    value={newCreditNote.reference_invoice}
                    onChange={(e) => setNewCreditNote({ ...newCreditNote, reference_invoice: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Credit Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newCreditNote.amount}
                    onChange={(e) => setNewCreditNote({ ...newCreditNote, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Reason *</label>
                <select
                  value={newCreditNote.reason}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                >
                  <option value="SALES_RETURN">Sales Return</option>
                  <option value="INVOICE_CORRECTION">Invoice Correction</option>
                  <option value="DISCOUNT_GRANTED">Discount Granted</option>
                  <option value="OTHER">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Customer Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes visible to client on mobile portal..."
                  value={newCreditNote.notes}
                  onChange={(e) => setNewCreditNote({ ...newCreditNote, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium"
                >
                  Issue Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
