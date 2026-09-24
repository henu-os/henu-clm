'use client';

import * as React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  DollarSign, 
  Calendar, 
  Clock, 
  Sparkles,
  Plus,
  Trash2,
  Paperclip,
  Save,
  Send,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Drawer } from '@/components/ui/drawer';
import { QuoteService } from '@/features/quotes/quotes.service';
import { type Quote, type QuoteStatus } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { formatCurrencyWords } from '@/lib/finance/number_to_words';

interface LineItemRow {
  id: string;
  item_details: string;
  account: string;
  quantity: number;
  rate: number;
  discount: number;
  tax_rate: number;
  amount: number;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = React.useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = React.useState(false);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [rejectionReason, setRejectionReason] = React.useState('');
  const { showToast } = useToast();

  // New Quote Wizard Modal State
  const [isNewQuoteOpen, setIsNewQuoteOpen] = React.useState(false);
  const [newQuoteForm, setNewQuoteForm] = React.useState({
    customer_name: 'Aero Dynamics Inc',
    quote_number: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
    reference_number: 'PO-REF-0982',
    quote_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    salesperson: 'Aarav Sharma (Sales Lead)',
    subject: 'Enterprise Cloud Infrastructure & Platform Engineering Retainer',
    customer_notes: 'Standard Graphic ₹189 | AI Video 15–30 sec ₹397 | YouTube Management ₹5,829/month',
    terms_conditions: 'Scope: Work and features as defined in this quote only.\nTaxes: 18% GST applicable.\nPayment: 60% advance to start, 40% before final handover.\nDisputes subject to courts of Rajasthan, India.',
    shipping_charges: 0,
    adjustment: 0,
    tds_tcs: 'NONE' as 'NONE' | 'TDS' | 'TCS',
    template: 'Spreadsheet Template',
  });

  const [lineItems, setLineItems] = React.useState<LineItemRow[]>([
    {
      id: 'row_1',
      item_details: 'Dedicated Full-Stack System Architecture & Engineering',
      account: 'Sales',
      quantity: 1,
      rate: 15000,
      discount: 0,
      tax_rate: 18,
      amount: 17700,
    },
    {
      id: 'row_2',
      item_details: 'Cloud Security Audit & Realtime Telemetry Setup',
      account: 'Professional Services',
      quantity: 1,
      rate: 4500,
      discount: 500,
      tax_rate: 18,
      amount: 4720,
    },
  ]);

  const loadQuotes = React.useCallback(() => {
    QuoteService.getQuotes({ status: statusFilter }).then(setQuotes);
  }, [statusFilter]);

  React.useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  // Recalculate row amount
  const handleItemChange = (id: string, field: keyof LineItemRow, value: any) => {
    setLineItems((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          const qty = Number(updated.quantity) || 0;
          const rate = Number(updated.rate) || 0;
          const disc = Number(updated.discount) || 0;
          const taxPct = Number(updated.tax_rate) || 0;
          const taxable = Math.max(0, qty * rate - disc);
          const tax = taxable * (taxPct / 100);
          updated.amount = taxable + tax;
          return updated;
        }
        return row;
      })
    );
  };

  const handleAddRow = () => {
    const newRow: LineItemRow = {
      id: `row_${Date.now()}`,
      item_details: 'Consulting & Implementation Services',
      account: 'Sales',
      quantity: 1,
      rate: 2500,
      discount: 0,
      tax_rate: 18,
      amount: 2950,
    };
    setLineItems([...lineItems, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((r) => r.id !== id));
  };

  // Compute Totals
  const subtotal = lineItems.reduce((acc, r) => acc + (Number(r.quantity) || 0) * (Number(r.rate) || 0), 0);
  const totalDiscount = lineItems.reduce((acc, r) => acc + (Number(r.discount) || 0), 0);
  const taxableSubtotal = Math.max(0, subtotal - totalDiscount);
  const totalTax = lineItems.reduce((acc, r) => {
    const base = Math.max(0, (Number(r.quantity) || 0) * (Number(r.rate) || 0) - (Number(r.discount) || 0));
    return acc + base * ((Number(r.tax_rate) || 0) / 100);
  }, 0);
  const grandTotal = Math.max(0, taxableSubtotal + totalTax + Number(newQuoteForm.shipping_charges || 0) + Number(newQuoteForm.adjustment || 0));

  const handleSaveQuote = (status: 'draft' | 'submitted') => {
    const createdQuote: Quote = {
      id: `q_${Date.now()}`,
      quote_number: newQuoteForm.quote_number,
      user_id: 'usr_001',
      client_name: newQuoteForm.customer_name,
      client_email: 'contact@aerodynamics.com',
      client_company: newQuoteForm.customer_name,
      title: newQuoteForm.subject || 'Custom Commercial Proposal',
      project_scope: newQuoteForm.customer_notes,
      currency: 'INR',
      subtotal: subtotal,
      discount_amount: totalDiscount,
      tax_amount: totalTax,
      total_amount: grandTotal,
      estimated_margin: 45,
      target_start_date: newQuoteForm.quote_date,
      target_delivery_date: newQuoteForm.expiry_date,
      status: status,
      items: lineItems.map((item, idx) => ({
        id: `qi_${idx}_${Date.now()}`,
        quote_id: newQuoteForm.quote_number,
        title: item.item_details,
        description: item.account,
        quantity: item.quantity,
        unit_price: item.rate,
        total_price: item.amount,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setQuotes([createdQuote, ...quotes]);
    setIsNewQuoteOpen(false);
    showToast(
      'success',
      status === 'draft' ? 'Quote Saved as Draft' : 'Quote Saved & Dispatched',
      `Quote ${createdQuote.quote_number} for ${createdQuote.client_name} total: ₹${grandTotal.toLocaleString()}`
    );
  };

  const handleApprove = async () => {
    if (!selectedQuote) return;
    await QuoteService.updateQuoteStatus(selectedQuote.id, 'approved', adminNotes);
    showToast('success', 'Quote Approved', `Quote ${selectedQuote.quote_number} is now approved.`);
    setApprovalModalOpen(false);
    setSelectedQuote(null);
    loadQuotes();
  };

  const handleReject = async () => {
    if (!selectedQuote) return;
    await QuoteService.updateQuoteStatus(selectedQuote.id, 'rejected', rejectionReason);
    showToast('error', 'Quote Rejected', `Quote ${selectedQuote.quote_number} has been rejected.`);
    setRejectionModalOpen(false);
    setSelectedQuote(null);
    loadQuotes();
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Quotes Workbench</h1>
          <p className="text-xs text-outline">Review client briefs, calculate project margins, adjust line-items, and dispatch proposals.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" onClick={() => setIsNewQuoteOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Create Custom Proposal</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2 overflow-x-auto">
        {(['all', 'submitted', 'in_review', 'approved', 'converted_to_order', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              statusFilter === status
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote Number</TableHead>
              <TableHead>Client / Title</TableHead>
              <TableHead>Estimated Value</TableHead>
              <TableHead>Est. Margin</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-outline">
                  No quotes found in this status category.
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-xs text-primary font-semibold">{q.quote_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface text-xs">{q.title}</span>
                      <span className="text-[11px] text-outline">
                        {q.client_name} ({q.client_company || 'Individual'})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-on-surface">
                    {formatCurrency(q.total_amount, q.currency)}
                  </TableCell>
                  <TableCell>
                    {q.estimated_margin ? (
                      <span className="text-xs font-bold text-secondary">{q.estimated_margin}%</span>
                    ) : (
                      <span className="text-xs text-outline">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-outline">
                    {formatDate(q.target_start_date)} → {formatDate(q.target_delivery_date)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        q.status === 'approved'
                          ? 'success'
                          : q.status === 'in_review'
                          ? 'warning'
                          : q.status === 'submitted'
                          ? 'primary'
                          : q.status === 'converted_to_order'
                          ? 'secondary'
                          : 'danger'
                      }
                    >
                      {q.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedQuote(q)}>
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Review</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* NEW QUOTE WIZARD MODAL */}
      <Modal
        isOpen={isNewQuoteOpen}
        onClose={() => setIsNewQuoteOpen(false)}
        title="Create New Quotation / Proposal"
        description="Comprehensive commercial estimate creation with itemized GST and live preview"
        maxWidth="5xl"
      >
        <div className="space-y-6 text-xs text-on-surface">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={newQuoteForm.customer_name}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc (Regular)</option>
                <option value="Acme Global Ventures">Acme Global Ventures (SEZ)</option>
                <option value="TechCorp Solutions">TechCorp Solutions (Composition)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Quote # *</label>
              <input
                type="text"
                required
                value={newQuoteForm.quote_number}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, quote_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reference #</label>
              <input
                type="text"
                value={newQuoteForm.reference_number}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, reference_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Quote Date *</label>
              <input
                type="date"
                required
                value={newQuoteForm.quote_date}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, quote_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Expiry Date</label>
              <input
                type="date"
                value={newQuoteForm.expiry_date}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, expiry_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Salesperson</label>
              <input
                type="text"
                value={newQuoteForm.salesperson}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, salesperson: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Subject / Proposal Summary</label>
              <input
                type="text"
                placeholder="Let your customer know what this Quote is for..."
                value={newQuoteForm.subject}
                onChange={(e) => setNewQuoteForm({ ...newQuoteForm, subject: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Line Items
              </h4>
              <Button size="sm" variant="outline" onClick={handleAddRow}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add New Row
              </Button>
            </div>

            <div className="border border-outline-variant/60 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-semibold uppercase text-outline">
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5">Item Details</th>
                    <th className="p-2.5 w-32">Account</th>
                    <th className="p-2.5 w-20 text-center">Qty</th>
                    <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                    <th className="p-2.5 w-24 text-right">Discount (₹)</th>
                    <th className="p-2.5 w-24 text-center">Tax Rate</th>
                    <th className="p-2.5 w-28 text-right">Amount (₹)</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {lineItems.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/50">
                      <td className="p-2 text-center text-outline font-mono">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.item_details}
                          onChange={(e) => handleItemChange(row.id, 'item_details', e.target.value)}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.account}
                          onChange={(e) => handleItemChange(row.id, 'account', e.target.value)}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
                        >
                          <option value="Sales">Sales</option>
                          <option value="Professional Services">Professional Services</option>
                          <option value="Consulting">Consulting</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleItemChange(row.id, 'quantity', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center text-xs text-on-surface focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.rate}
                          onChange={(e) => handleItemChange(row.id, 'rate', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs text-on-surface focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.discount}
                          onChange={(e) => handleItemChange(row.id, 'discount', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs text-on-surface focus:border-primary focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.tax_rate}
                          onChange={(e) => handleItemChange(row.id, 'tax_rate', Number(e.target.value))}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center text-xs text-on-surface focus:border-primary focus:outline-none"
                        >
                          <option value={0}>0% (Non-GST)</option>
                          <option value={5}>5% GST</option>
                          <option value={12}>12% GST</option>
                          <option value={18}>18% GST</option>
                          <option value={28}>28% GST</option>
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
                          title="Remove Row"
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

          {/* Totals & Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Notes & Terms */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Notes (Markdown Supported)</label>
                <textarea
                  rows={4}
                  value={newQuoteForm.customer_notes}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, customer_notes: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Terms & Conditions</label>
                <textarea
                  rows={4}
                  value={newQuoteForm.terms_conditions}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, terms_conditions: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">PDF Template</label>
                <select
                  value={newQuoteForm.template}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, template: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="Spreadsheet Template">Spreadsheet Template (HENU Default)</option>
                  <option value="Standard Template">Standard Commercial Template</option>
                </select>
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Sub Total:</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Total Discount:</span>
                <span className="font-semibold text-error">-₹{totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Applicable GST / Tax:</span>
                <span className="font-semibold text-on-surface">₹{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Shipping Charges:</span>
                <input
                  type="number"
                  value={newQuoteForm.shipping_charges}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, shipping_charges: Number(e.target.value) })}
                  className="w-24 p-1 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Adjustment (+ / -):</span>
                <input
                  type="number"
                  value={newQuoteForm.adjustment}
                  onChange={(e) => setNewQuoteForm({ ...newQuoteForm, adjustment: Number(e.target.value) })}
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
            <Button variant="outline" size="sm" onClick={() => setIsNewQuoteOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveQuote('draft')}>
              <Save className="w-3.5 h-3.5 mr-1" />
              Save as Draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleSaveQuote('submitted')}>
              <Send className="w-3.5 h-3.5 mr-1" />
              Save and Send
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quote Review Drawer */}
      <Drawer
        isOpen={!!selectedQuote && !approvalModalOpen && !rejectionModalOpen}
        onClose={() => setSelectedQuote(null)}
        title={selectedQuote?.title || ''}
        description={selectedQuote?.quote_number}
        width="xl"
      >
        {selectedQuote && (
          <div className="space-y-6">
            {/* Commercial Summary Card */}
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-outline uppercase font-semibold">Total Proposal Amount</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedQuote.total_amount, selectedQuote.currency)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-outline uppercase font-semibold">Estimated Margin</p>
                  <p className="text-base font-bold text-secondary">~{selectedQuote.estimated_margin || 40}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30 text-xs">
                <div>
                  <span className="text-outline">Subtotal:</span>{' '}
                  <span className="font-semibold">{formatCurrency(selectedQuote.subtotal, selectedQuote.currency)}</span>
                </div>
                <div>
                  <span className="text-outline">Discount:</span>{' '}
                  <span className="font-semibold text-error">-{formatCurrency(selectedQuote.discount_amount, selectedQuote.currency)}</span>
                </div>
                <div>
                  <span className="text-outline">Tax:</span>{' '}
                  <span className="font-semibold">{formatCurrency(selectedQuote.tax_amount, selectedQuote.currency)}</span>
                </div>
              </div>
            </div>

            {/* Scope Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Project Scope & Brief</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed p-3 bg-surface-container-lowest rounded border border-outline-variant/40">
                {selectedQuote.project_scope}
              </p>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Line Items</h4>
              <div className="border border-outline-variant/40 rounded overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item / Scope</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuote.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs font-medium text-on-surface">{item.title}</TableCell>
                        <TableCell className="text-xs">{item.quantity}</TableCell>
                        <TableCell className="text-xs">{formatCurrency(item.unit_price, selectedQuote.currency)}</TableCell>
                        <TableCell className="text-xs font-semibold text-right">
                          {formatCurrency(item.total_price, selectedQuote.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Approval / Rejection Action Controls */}
            {selectedQuote.status !== 'approved' && selectedQuote.status !== 'converted_to_order' && (
              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between gap-3">
                <Button variant="danger" size="md" onClick={() => setRejectionModalOpen(true)}>
                  <XCircle className="w-4 h-4 mr-1.5" />
                  <span>Reject Proposal</span>
                </Button>
                <Button variant="primary" size="md" onClick={() => setApprovalModalOpen(true)}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Approve & Dispatch</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Approval Confirmation Modal */}
      <Modal isOpen={approvalModalOpen} onClose={() => setApprovalModalOpen(false)} title="Approve Commercial Proposal">
        <div className="space-y-4">
          <p className="text-xs text-on-surface">
            Approving proposal <span className="font-semibold text-primary">{selectedQuote?.quote_number}</span> will transition status to{' '}
            <span className="font-bold text-secondary">Approved</span> and trigger real-time push delivery to the client.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Internal Admin Notes</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
              placeholder="Add internal notes on margin, scope adjustments..."
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setApprovalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApprove}>
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal isOpen={rejectionModalOpen} onClose={() => setRejectionModalOpen(false)} title="Reject Commercial Proposal">
        <div className="space-y-4">
          <p className="text-xs text-on-surface">
            Please provide a mandatory reason for rejecting proposal <span className="font-semibold text-primary">{selectedQuote?.quote_number}</span>.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Rejection Reason</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. Scope outside of current technical bandwidth..."
              required
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setRejectionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
