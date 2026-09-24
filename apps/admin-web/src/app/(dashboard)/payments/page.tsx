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
  FileCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentItem[]>([
    {
      id: 'pay_001',
      payment_number: 'PAY-2026-041',
      invoice_number: 'INV-2026-081',
      customer_name: 'Aero Dynamics Inc',
      payment_type: 'INVOICE_PAYMENT',
      amount: 14000.00,
      currency: 'USD',
      payment_mode: 'RAZORPAY',
      deposit_to: 'Corporate Operating Account (HDFC)',
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
      currency: 'USD',
      payment_mode: 'BANK_TRANSFER',
      deposit_to: 'Corporate Operating Account (HDFC)',
      reference_number: 'NEFT-8839103982',
      status: 'COMPLETED',
      payment_date: '2026-05-20',
    },
  ]);

  const [selectedPayment, setSelectedPayment] = React.useState<PaymentItem | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // Form State
  const [paymentType, setPaymentType] = React.useState<'INVOICE_PAYMENT' | 'CUSTOMER_ADVANCE'>('INVOICE_PAYMENT');
  const [customerName, setCustomerName] = React.useState('Aero Dynamics Inc');
  const [amount, setAmount] = React.useState('12500');
  const [paymentMode, setPaymentMode] = React.useState<'BANK_TRANSFER' | 'UPI' | 'CASH' | 'CHEQUE'>('BANK_TRANSFER');
  const [depositTo, setDepositTo] = React.useState('Bank Account');
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [taxDeduction, setTaxDeduction] = React.useState('NO_TAX');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: PaymentItem = {
      id: `pay_${Date.now()}`,
      payment_number: `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`,
      invoice_number: paymentType === 'INVOICE_PAYMENT' ? 'INV-2026-089' : undefined,
      customer_name: customerName,
      payment_type: paymentType,
      amount: parseFloat(amount) || 0,
      currency: 'USD',
      payment_mode: paymentMode,
      deposit_to: depositTo,
      reference_number: referenceNumber || `REF-${Date.now()}`,
      status: 'COMPLETED',
      payment_date: new Date().toISOString().split('T')[0],
    };

    setPayments([newPayment, ...payments]);
    setIsRecordModalOpen(false);
    showToast('success', 'Payment Recorded', `Payment of $${newPayment.amount} recorded successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payments Received & Advance Ledger</h1>
          <p className="text-xs text-gray-400">
            Record customer receipts, invoice settlements, bank reconciliation, and advances
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => showToast('success', 'Ledger Synchronized', 'All gateway transactions reconciled.')}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Sync Gateways</span>
          </Button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-400">Total Payments Recorded</p>
          <p className="text-xl font-bold text-white mt-1">
            ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">{payments.length} Transactions settled</p>
        </div>
        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-400">Gateway Settlements (Razorpay/Cashfree)</p>
          <p className="text-xl font-bold text-[#887DB8] mt-1">$14,000.00</p>
          <p className="text-[11px] text-gray-400 mt-1">Verified via webhooks</p>
        </div>
        <div className="bg-[#181B24] p-4 rounded-xl border border-gray-800">
          <p className="text-xs text-gray-400">Offline & Direct Bank Transfers</p>
          <p className="text-xl font-bold text-[#D9A441] mt-1">$4,500.00</p>
          <p className="text-[11px] text-gray-400 mt-1">Manual bank reconciliation</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#181B24] rounded-xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/40 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Payment #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Invoice / Type</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#20202B]/50 transition">
                  <td className="py-4 px-4 font-mono font-bold text-white">{pay.payment_number}</td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{pay.payment_date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">{pay.customer_name}</td>
                  <td className="py-4 px-4">
                    {pay.invoice_number ? (
                      <span className="font-mono text-xs text-[#887DB8] bg-[#887DB8]/10 px-2 py-0.5 rounded border border-[#887DB8]/20">
                        {pay.invoice_number}
                      </span>
                    ) : (
                      <span className="text-xs text-[#D9A441] bg-[#D9A441]/10 px-2 py-0.5 rounded border border-[#D9A441]/20">
                        Advance Payment
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-medium text-gray-300">{pay.payment_mode}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-400">
                    ${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => showToast('info', 'Receipt Export', `Downloading ${pay.payment_number} receipt PDF.`)}
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

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#20202B]/40">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Receipt className="w-5 h-5 text-[#887DB8]" />
                <span>Record Payment Received</span>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Payment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('INVOICE_PAYMENT')}
                    className={`py-2 rounded-lg border text-xs font-medium transition ${
                      paymentType === 'INVOICE_PAYMENT'
                        ? 'border-[#887DB8] bg-[#887DB8]/15 text-white'
                        : 'border-gray-700 bg-[#20202B] text-gray-400'
                    }`}
                  >
                    Invoice Settlement
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('CUSTOMER_ADVANCE')}
                    className={`py-2 rounded-lg border text-xs font-medium transition ${
                      paymentType === 'CUSTOMER_ADVANCE'
                        ? 'border-[#D9A441] bg-[#D9A441]/15 text-white'
                        : 'border-gray-700 bg-[#20202B] text-gray-400'
                    }`}
                  >
                    Customer Advance
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Customer *</label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                >
                  <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                  <option value="Acme Global Ventures">Acme Global Ventures</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Amount Received ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Payment Mode *</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Deposit To</label>
                  <select
                    value={depositTo}
                    onChange={(e) => setDepositTo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="Bank Account">Operating Bank Account</option>
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="Undeposited Funds">Undeposited Funds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Reference / Transaction #</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-9988771122"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              {paymentType === 'CUSTOMER_ADVANCE' && (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tax Deduction on Advance</label>
                  <select
                    value={taxDeduction}
                    onChange={(e) => setTaxDeduction(e.target.value)}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="NO_TAX">No Tax Deduction</option>
                    <option value="TDS">TDS Deducted</option>
                    <option value="GST_ON_ADVANCE">GST on Advance</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
