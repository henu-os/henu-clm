'use client';

import * as React from 'react';
import { 
  Receipt, 
  Download, 
  Eye, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Save,
  Send,
  CreditCard,
  Building,
  QrCode
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { InvoiceService } from '@/features/orders/orders.service';
import { type Invoice } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { formatCurrencyWords } from '@/lib/finance/number_to_words';

interface InvoiceLineItem {
  id: string;
  item_details: string;
  account: string;
  quantity: number;
  rate: number;
  tax_rate: number;
  amount: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const { showToast } = useToast();

  // New Invoice Modal State
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = React.useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = React.useState({
    customer_name: 'Aero Dynamics Inc',
    invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    order_number: 'ORD-2026-081',
    reference_number: 'REF-PO-4412',
    invoice_date: new Date().toISOString().split('T')[0],
    terms: 'Net 30',
    due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    salesperson: 'Aarav Sharma',
    subject: 'Cloud Infrastructure Retainer & Sprint Delivery Milestone',
    customer_notes: 'Thank you for your business! Please remit payment within the specified terms.',
    terms_conditions: '1. Payment is due strictly according to agreed payment terms.\n2. Interest @ 18% per annum will be charged on overdue payments.\n3. All disputes subject to jurisdiction of courts of Rajasthan, India.',
    shipping_charges: 0,
    adjustment: 0,
    tds_tcs: 'NONE' as 'NONE' | 'TDS' | 'TCS',
    payment_gateways: {
      upi: true,
      cards: true,
      netbanking: true,
      bank_transfer: true,
    },
    template: 'Spreadsheet Template',
  });

  const [invoiceItems, setInvoiceItems] = React.useState<InvoiceLineItem[]>([
    {
      id: 'item_1',
      item_details: 'Core Cloud Infrastructure Engineering & Telemetry Setup',
      account: 'Sales',
      quantity: 1,
      rate: 10000,
      tax_rate: 18,
      amount: 11800,
    },
    {
      id: 'item_2',
      item_details: 'Realtime WebSocket Synchronization & Broker Optimization',
      account: 'Sales',
      quantity: 1,
      rate: 3500,
      tax_rate: 18,
      amount: 4130,
    },
  ]);

  React.useEffect(() => {
    InvoiceService.getInvoices().then(setInvoices);
  }, []);

  const handleDownloadPDF = (invoiceNumber: string) => {
    showToast('success', 'PDF Invoice Generated', `Downloading official tax invoice ${invoiceNumber}...`);
  };

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setInvoiceItems((prev) =>
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
    const newItem: InvoiceLineItem = {
      id: `item_${Date.now()}`,
      item_details: 'Consulting & Implementation Services',
      account: 'Sales',
      quantity: 1,
      rate: 2000,
      tax_rate: 18,
      amount: 2360,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleRemoveRow = (id: string) => {
    if (invoiceItems.length <= 1) return;
    setInvoiceItems(invoiceItems.filter((r) => r.id !== id));
  };

  // Calculations
  const subtotal = invoiceItems.reduce((acc, r) => acc + (Number(r.quantity) || 0) * (Number(r.rate) || 0), 0);
  const totalTax = invoiceItems.reduce((acc, r) => {
    const base = (Number(r.quantity) || 0) * (Number(r.rate) || 0);
    return acc + base * ((Number(r.tax_rate) || 0) / 100);
  }, 0);
  const grandTotal = Math.max(0, subtotal + totalTax + Number(newInvoiceForm.shipping_charges || 0) + Number(newInvoiceForm.adjustment || 0));

  const handleSaveInvoice = (status: 'issued' | 'draft') => {
    const createdInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoice_number: newInvoiceForm.invoice_number,
      order_id: 'ord_001',
      user_id: 'usr_001',
      client_name: newInvoiceForm.customer_name,
      client_email: 'billing@aerodynamics.com',
      client_company: newInvoiceForm.customer_name,
      currency: 'INR',
      subtotal: subtotal,
      discount_amount: 0,
      tax_amount: totalTax,
      total_amount: grandTotal,
      amount_paid: 0,
      amount_due: grandTotal,
      status: status === 'issued' ? 'issued' : 'draft',
      due_date: newInvoiceForm.due_date,
      items: invoiceItems.map((item, idx) => ({
        id: `ii_${idx}_${Date.now()}`,
        invoice_id: newInvoiceForm.invoice_number,
        description: item.item_details,
        hsn_sac_code: '998313',
        quantity: item.quantity,
        unit_rate: item.rate,
        tax_rate_percentage: item.tax_rate,
        line_total: item.amount,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setInvoices([createdInvoice, ...invoices]);
    setIsNewInvoiceOpen(false);
    showToast(
      'success',
      status === 'draft' ? 'Invoice Saved as Draft' : 'Tax Invoice Issued',
      `Invoice ${createdInvoice.invoice_number} created for ${createdInvoice.client_name} (Total: ₹${grandTotal.toLocaleString()})`
    );
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Tax Invoices & Billing</h1>
          <p className="text-xs text-outline">Manage commercial tax invoices, payment settlement statuses, and PDF generation.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsNewInvoiceOpen(true)}>
          <Receipt className="w-4 h-4 mr-1.5" />
          <span>+ Issue New Invoice</span>
        </Button>
      </div>

      {/* Financial KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Total Invoiced (MTD)</p>
          <p className="text-xl font-bold text-on-surface mt-1">₹18,500.00</p>
        </Card>
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Amount Received</p>
          <p className="text-xl font-bold text-secondary mt-1">₹12,400.00</p>
        </Card>
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Outstanding Due</p>
          <p className="text-xl font-bold text-error mt-1">₹6,100.00</p>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client / Entity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-outline">
                  No invoices available.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs text-primary font-semibold">{inv.invoice_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface text-xs">{inv.client_name}</span>
                      <span className="text-[11px] text-outline">{inv.client_company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-on-surface">
                    {formatCurrency(inv.total_amount, inv.currency)}
                  </TableCell>
                  <TableCell className="text-xs text-secondary font-semibold">
                    {formatCurrency(inv.amount_paid, inv.currency)}
                  </TableCell>
                  <TableCell className="text-xs text-error font-semibold">
                    {formatCurrency(inv.amount_due, inv.currency)}
                  </TableCell>
                  <TableCell className="text-xs text-outline">{formatDate(inv.due_date)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'partially_paid' ? 'warning' : inv.status === 'issued' ? 'primary' : 'danger'}>
                      {inv.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(inv.invoice_number)}>
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>PDF</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* NEW INVOICE BUILDER MODAL */}
      <Modal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        title="Issue New Tax Invoice"
        description="Comprehensive commercial tax invoice creation with itemized GST, due date terms, and gateway options"
        maxWidth="5xl"
      >
        <div className="space-y-6 text-xs text-on-surface">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={newInvoiceForm.customer_name}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc (Regular)</option>
                <option value="Acme Global Ventures">Acme Global Ventures (SEZ)</option>
                <option value="TechCorp Solutions">TechCorp Solutions (Composition)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Invoice # *</label>
              <input
                type="text"
                required
                value={newInvoiceForm.invoice_number}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, invoice_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Order # / Reference #</label>
              <input
                type="text"
                value={newInvoiceForm.order_number}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, order_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Invoice Date *</label>
              <input
                type="date"
                required
                value={newInvoiceForm.invoice_date}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, invoice_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Terms</label>
              <select
                value={newInvoiceForm.terms}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, terms: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={newInvoiceForm.due_date}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, due_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Subject</label>
              <input
                type="text"
                value={newInvoiceForm.subject}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, subject: e.target.value })}
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
                    <th className="p-2.5 w-8 text-center">#</th>
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
                  {invoiceItems.map((row, idx) => (
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
                          <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                          <option value="Professional Services">Professional Services</option>
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

          {/* Payment Options, Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left Column: Gateways & Notes */}
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2">
                <h5 className="font-bold uppercase tracking-wider text-outline text-[11px]">Configured Payment Options</h5>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInvoiceForm.payment_gateways.upi}
                      onChange={(e) =>
                        setNewInvoiceForm({
                          ...newInvoiceForm,
                          payment_gateways: { ...newInvoiceForm.payment_gateways, upi: e.target.checked },
                        })
                      }
                      className="rounded border-outline-variant text-primary"
                    />
                    <span className="flex items-center gap-1"><QrCode className="w-3 h-3 text-primary" /> UPI (Instant QR)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInvoiceForm.payment_gateways.cards}
                      onChange={(e) =>
                        setNewInvoiceForm({
                          ...newInvoiceForm,
                          payment_gateways: { ...newInvoiceForm.payment_gateways, cards: e.target.checked },
                        })
                      }
                      className="rounded border-outline-variant text-primary"
                    />
                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-primary" /> Cards / Debit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInvoiceForm.payment_gateways.netbanking}
                      onChange={(e) =>
                        setNewInvoiceForm({
                          ...newInvoiceForm,
                          payment_gateways: { ...newInvoiceForm.payment_gateways, netbanking: e.target.checked },
                        })
                      }
                      className="rounded border-outline-variant text-primary"
                    />
                    <span className="flex items-center gap-1"><Building className="w-3 h-3 text-primary" /> Net Banking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInvoiceForm.payment_gateways.bank_transfer}
                      onChange={(e) =>
                        setNewInvoiceForm({
                          ...newInvoiceForm,
                          payment_gateways: { ...newInvoiceForm.payment_gateways, bank_transfer: e.target.checked },
                        })
                      }
                      className="rounded border-outline-variant text-primary"
                    />
                    <span>NEFT / RTGS Virtual A/C</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Notes</label>
                <textarea
                  rows={3}
                  value={newInvoiceForm.customer_notes}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customer_notes: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={newInvoiceForm.terms_conditions}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, terms_conditions: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs font-mono text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Totals */}
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Sub Total:</span>
                <span className="font-semibold text-on-surface">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-outline">Tax (GST):</span>
                <span className="font-semibold text-on-surface">₹{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Shipping Charges:</span>
                <input
                  type="number"
                  value={newInvoiceForm.shipping_charges}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, shipping_charges: Number(e.target.value) })}
                  className="w-24 p-1 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Adjustment (+ / -):</span>
                <input
                  type="number"
                  value={newInvoiceForm.adjustment}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, adjustment: Number(e.target.value) })}
                  className="w-24 p-1 bg-surface-container-lowest border border-outline-variant rounded text-right text-xs"
                />
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-outline-variant/80 text-sm">
                <span className="font-bold text-on-surface">Total Amount (₹):</span>
                <span className="font-bold text-primary text-base">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-[11px] text-outline font-medium">
                <span className="font-semibold text-on-surface">Total in Words:</span> {formatCurrencyWords(grandTotal, 'INR')}
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNewInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveInvoice('draft')}>
              <Save className="w-3.5 h-3.5 mr-1" />
              Save as Draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleSaveInvoice('issued')}>
              <Send className="w-3.5 h-3.5 mr-1" />
              Save and Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
