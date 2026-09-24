'use client';

import * as React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Plus, 
  Download, 
  DollarSign,
  Calendar,
  Building2,
  Receipt,
  FileCheck,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export interface PaymentItem {
  id: string;
  payment_number: string;
  invoice_number?: string;
  customer_name: string;
  payment_type: 'INVOICE_PAYMENT' | 'CUSTOMER_ADVANCE';
  amount: number;
  currency: string;
  payment_mode: 'BANK_TRANSFER' | 'RAZORPAY' | 'CASHFREE' | 'UPI' | 'CASH' | 'CHEQUE';
  deposit_to: string;
  reference_number?: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  payment_date: string;
}

interface UnpaidInvoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  invoice_amount: number;
  amount_due: number;
  payment_applied: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentItem[]>([
    {
      id: 'pay_001',
      payment_number: 'PAY-2026-041',
      invoice_number: 'INV-2026-081',
      customer_name: 'Aero Dynamics Inc',
      payment_type: 'INVOICE_PAYMENT',
      amount: 14000.00,
      currency: 'INR',
      payment_mode: 'RAZORPAY',
      deposit_to: 'Operating Bank Account (HDFC)',
      reference_number: 'pay_rzp_live_938174829',
      status: 'COMPLETED',
      payment_date: '2026-05-18',
    },
    {
      id: 'pay_002',
      payment_number: 'PAY-2026-042',
      invoice_number: 'INV-2026-077',
      customer_name: 'Acme Global Ventures',
      payment_type: 'INVOICE_PAYMENT',
      amount: 4500.00,
      currency: 'INR',
      payment_mode: 'BANK_TRANSFER',
      deposit_to: 'Operating Bank Account (HDFC)',
      reference_number: 'NEFT-8839103982',
      status: 'COMPLETED',
      payment_date: '2026-05-20',
    },
  ]);

  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // Form State
  const [paymentType, setPaymentType] = React.useState<'INVOICE_PAYMENT' | 'CUSTOMER_ADVANCE'>('INVOICE_PAYMENT');
  const [customerName, setCustomerName] = React.useState('Aero Dynamics Inc');
  const [amount, setAmount] = React.useState('12500');
  const [bankCharges, setBankCharges] = React.useState('0');
  const [paymentDate, setPaymentDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [paymentNumber, setPaymentNumber] = React.useState(`PAY-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [paymentMode, setPaymentMode] = React.useState<'BANK_TRANSFER' | 'UPI' | 'CASH' | 'CHEQUE' | 'RAZORPAY'>('BANK_TRANSFER');
  const [depositTo, setDepositTo] = React.useState('Operating Bank Account');
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [taxDeduction, setTaxDeduction] = React.useState('NO_TAX');
  const [notes, setNotes] = React.useState('');

  const [unpaidInvoices, setUnpaidInvoices] = React.useState<UnpaidInvoice[]>([
    {
      id: 'inv_1',
      invoice_number: 'INV-2026-081',
      invoice_date: '2026-05-01',
      invoice_amount: 15000,
      amount_due: 7500,
      payment_applied: 7500,
    },
    {
      id: 'inv_2',
      invoice_number: 'INV-2026-085',
      invoice_date: '2026-05-10',
      invoice_amount: 5000,
      amount_due: 5000,
      payment_applied: 5000,
    },
  ]);

  const handlePayFull = (id: string) => {
    setUnpaidInvoices(
      unpaidInvoices.map((inv) => (inv.id === id ? { ...inv, payment_applied: inv.amount_due } : inv))
    );
  };

  const handleClearApplied = (id: string) => {
    setUnpaidInvoices(
      unpaidInvoices.map((inv) => (inv.id === id ? { ...inv, payment_applied: 0 } : inv))
    );
  };

  const handleAppliedChange = (id: string, val: number) => {
    setUnpaidInvoices(
      unpaidInvoices.map((inv) => (inv.id === id ? { ...inv, payment_applied: Math.min(inv.amount_due, Math.max(0, val)) } : inv))
    );
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: PaymentItem = {
      id: `pay_${Date.now()}`,
      payment_number: paymentNumber,
      invoice_number: paymentType === 'INVOICE_PAYMENT' ? unpaidInvoices[0]?.invoice_number : undefined,
      customer_name: customerName,
      payment_type: paymentType,
      amount: parseFloat(amount) || 0,
      currency: 'INR',
      payment_mode: paymentMode,
      deposit_to: depositTo,
      reference_number: referenceNumber || `REF-${Date.now()}`,
      status: 'COMPLETED',
      payment_date: paymentDate,
    };

    setPayments([newPayment, ...payments]);
    setIsRecordModalOpen(false);
    showToast('success', 'Payment Recorded', `Payment ${newPayment.payment_number} for ₹${newPayment.amount.toLocaleString()} received.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Payments Received</h1>
          <p className="text-xs text-on-surface-variant">Manage invoice payment settlements, customer advances, and bank allocations</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Received (MTD)</p>
            <p className="text-2xl font-bold text-on-surface mt-1">₹18,500.00</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Gateway Collections</p>
            <p className="text-2xl font-bold text-primary mt-1">₹14,000.00</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Bank Transfers</p>
            <p className="text-2xl font-bold text-secondary mt-1">₹4,500.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-low/60 text-xs font-semibold uppercase text-on-surface-variant tracking-wider">
                <th className="py-3.5 px-4">Payment #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-surface-container-low/40 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-primary">{pay.payment_number}</td>
                  <td className="py-3.5 px-4 text-on-surface font-semibold">{pay.customer_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-outline">{pay.payment_type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">{pay.payment_date}</td>
                  <td className="py-3.5 px-4 text-xs text-on-surface font-mono">{pay.payment_mode}</td>
                  <td className="py-3.5 px-4 font-bold text-on-surface font-mono">₹{pay.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">
                      {pay.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast('success', 'Receipt Export', `Downloading ${pay.payment_number} receipt PDF.`)}
                      className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high text-on-surface transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Payment Received"
        description="Allocate incoming funds to invoices or record customer advance payments with bank deposit accounts"
        maxWidth="4xl"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs text-on-surface">
          {/* Mode Switcher */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1.5">Payment Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('INVOICE_PAYMENT')}
                className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition ${
                  paymentType === 'INVOICE_PAYMENT'
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-outline-variant bg-surface-container-low text-outline'
                }`}
              >
                Invoice Payment
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('CUSTOMER_ADVANCE')}
                className={`py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition ${
                  paymentType === 'CUSTOMER_ADVANCE'
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-outline-variant bg-surface-container-low text-outline'
                }`}
              >
                Customer Advance
              </button>
            </div>
          </div>

          {/* Primary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                <option value="Acme Global Ventures">Acme Global Ventures</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Amount Received (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-semibold text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Bank Charges (if any)</label>
              <input
                type="number"
                value={bankCharges}
                onChange={(e) => setBankCharges(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment # *</label>
              <input
                type="text"
                required
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Mode *</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI</option>
                <option value="RAZORPAY">Razorpay / Cashfree</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Deposit To *</label>
              <select
                value={depositTo}
                onChange={(e) => setDepositTo(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Operating Bank Account">Operating Bank Account (HDFC)</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="Undeposited Funds">Undeposited Funds</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reference / UTR #</label>
              <input
                type="text"
                placeholder="e.g. UTR-9988771122"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Mode 1: Unpaid Invoices Allocation Table */}
          {paymentType === 'INVOICE_PAYMENT' && (
            <div className="space-y-2 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
              <h4 className="font-bold uppercase tracking-wider text-on-surface">Unpaid Invoices Allocation</h4>
              <div className="border border-outline-variant/60 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant/40 text-[11px] text-outline font-semibold uppercase">
                      <th className="p-2">Invoice #</th>
                      <th className="p-2">Date</th>
                      <th className="p-2 text-right">Invoice Amount</th>
                      <th className="p-2 text-right">Amount Due</th>
                      <th className="p-2 text-right w-32">Payment Amount (₹)</th>
                      <th className="p-2 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {unpaidInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-2 font-mono text-primary font-semibold">{inv.invoice_number}</td>
                        <td className="p-2 text-outline">{inv.invoice_date}</td>
                        <td className="p-2 text-right">₹{inv.invoice_amount.toLocaleString()}</td>
                        <td className="p-2 text-right font-semibold text-error">₹{inv.amount_due.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            value={inv.payment_applied}
                            onChange={(e) => handleAppliedChange(inv.id, Number(e.target.value))}
                            className="w-full p-1 bg-surface-container-lowest border border-outline-variant rounded text-right font-semibold"
                          />
                        </td>
                        <td className="p-2 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handlePayFull(inv.id)}
                            className="text-primary hover:underline text-[11px] font-semibold"
                          >
                            Pay Full
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClearApplied(inv.id)}
                            className="text-outline hover:underline text-[11px]"
                          >
                            Clear
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mode 2: Customer Advance Tax Options */}
          {paymentType === 'CUSTOMER_ADVANCE' && (
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-2">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Tax Deduction on Advance</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tax_ded"
                    checked={taxDeduction === 'NO_TAX'}
                    onChange={() => setTaxDeduction('NO_TAX')}
                  />
                  <span>No Tax</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tax_ded"
                    checked={taxDeduction === 'TDS'}
                    onChange={() => setTaxDeduction('TDS')}
                  />
                  <span>TDS Deducted</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tax_ded"
                    checked={taxDeduction === 'GST_ON_ADVANCE'}
                    onChange={() => setTaxDeduction('GST_ON_ADVANCE')}
                  />
                  <span>GST on Advance</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Notes / Remarks</label>
            <textarea
              rows={2}
              placeholder="Internal payment notes, cheque clearance details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
