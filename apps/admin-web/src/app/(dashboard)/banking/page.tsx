'use client';

import * as React from 'react';
import { 
  Building2, 
  CreditCard, 
  Plus, 
  Upload, 
  Sliders, 
  MoreVertical, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileSpreadsheet, 
  RefreshCw, 
  Download, 
  Trash2, 
  X, 
  ChevronDown, 
  DollarSign, 
  Wallet,
  ShieldCheck,
  Search,
  Receipt,
  FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { downloadDocumentFile } from '@/lib/download';

export interface BankAccountItem {
  id: string;
  account_name: string;
  account_type: 'BANK' | 'CREDIT_CARD' | 'CASH';
  account_code: string;
  currency: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  description: string;
  is_primary: boolean;
  opening_balance: number;
  amount_in_bank: number;
  amount_in_books: number;
  uncategorized_count: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const INITIAL_ACCOUNTS: BankAccountItem[] = [
  {
    id: 'acc_001',
    account_name: 'HENU OS Private Limited',
    account_type: 'BANK',
    account_code: 'ACC-HDFC-01',
    currency: 'INR',
    account_number: 'xxxx6727',
    bank_name: 'HDFC Bank Ltd',
    ifsc_code: 'HDFC0001234',
    description: 'Primary corporate operating current account',
    is_primary: true,
    opening_balance: 34299.00,
    amount_in_bank: 34299.00,
    amount_in_books: 34299.00,
    uncategorized_count: 2,
    status: 'ACTIVE',
  },
  {
    id: 'acc_002',
    account_name: 'Petty Cash Operating Float',
    account_type: 'CASH',
    account_code: 'ACC-CASH-01',
    currency: 'INR',
    account_number: 'CASH-MAIN',
    bank_name: 'Cash in Hand',
    ifsc_code: 'N/A',
    description: 'Office operations & daily utility cash drawer',
    is_primary: false,
    opening_balance: 18098.41,
    amount_in_bank: 18098.41,
    amount_in_books: 18098.41,
    uncategorized_count: 0,
    status: 'ACTIVE',
  },
  {
    id: 'acc_003',
    account_name: 'Razorpay Clearing & AutoCollect',
    account_type: 'BANK',
    account_code: 'ACC-RZP-01',
    currency: 'INR',
    account_number: 'xxxx9981',
    bank_name: 'Virtual Escrow Account',
    ifsc_code: 'RZPY0000001',
    description: 'Automated gateway customer collections settlement',
    is_primary: false,
    opening_balance: 0.00,
    amount_in_bank: 0.00,
    amount_in_books: 14000.00,
    uncategorized_count: 1,
    status: 'ACTIVE',
  }
];

export default function BankingPage() {
  const [accounts, setAccounts] = React.useState<BankAccountItem[]>(INITIAL_ACCOUNTS);
  const [showAutoUploadBanner, setShowAutoUploadBanner] = React.useState(true);
  const [dateRange, setDateRange] = React.useState('THIS_MONTH');
  const [showChart, setShowChart] = React.useState(true);
  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);

  // Modals State
  const [isAddBankModalOpen, setIsAddBankModalOpen] = React.useState(false);
  const [isAddCashModalOpen, setIsAddCashModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = React.useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = React.useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = React.useState<BankAccountItem | null>(null);

  // Add Bank Account Form State
  const [bankForm, setBankForm] = React.useState({
    account_type: 'BANK' as 'BANK' | 'CREDIT_CARD',
    account_name: '',
    account_code: '',
    currency: 'INR',
    account_number: '',
    bank_name: 'HDFC Bank',
    ifsc_code: '',
    description: '',
    is_primary: false,
    opening_balance: 0,
    opening_date: new Date().toISOString().split('T')[0],
  });

  // Add Cash Account Form State
  const [cashForm, setCashForm] = React.useState({
    account_name: '',
    account_code: '',
    currency: 'INR',
    description: '',
    opening_balance: 0,
    opening_date: new Date().toISOString().split('T')[0],
  });

  // Transaction Form State
  const [txnForm, setTxnForm] = React.useState({
    txn_flow: 'MONEY_IN' as 'MONEY_IN' | 'MONEY_OUT',
    txn_type: 'CUSTOMER_PAYMENT',
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    entity_name: 'Apex Global Technologies',
    account_id: 'acc_001',
    payment_mode: 'UPI',
    reference_number: `REF-${Date.now().toString().slice(-6)}`,
    description: '',
    tax_rate: 18,
  });

  // Reconcile Form State
  const [closingBalanceInput, setClosingBalanceInput] = React.useState(34299);
  const [clearedTransactions, setClearedTransactions] = React.useState<string[]>(['t1', 't2']);

  const { showToast } = useToast();

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.account_name || !bankForm.account_number) return;

    const newAcc: BankAccountItem = {
      id: `acc_${Date.now()}`,
      account_name: bankForm.account_name,
      account_type: bankForm.account_type,
      account_code: bankForm.account_code || `ACC-${Date.now().toString().slice(-4)}`,
      currency: bankForm.currency,
      account_number: `xxxx${bankForm.account_number.slice(-4)}`,
      bank_name: bankForm.bank_name,
      ifsc_code: bankForm.ifsc_code || 'HDFC0001',
      description: bankForm.description,
      is_primary: bankForm.is_primary,
      opening_balance: Number(bankForm.opening_balance) || 0,
      amount_in_bank: Number(bankForm.opening_balance) || 0,
      amount_in_books: Number(bankForm.opening_balance) || 0,
      uncategorized_count: 0,
      status: 'ACTIVE',
    };

    setAccounts([newAcc, ...accounts]);
    setIsAddBankModalOpen(false);
    showToast('success', 'Bank Account Added', `${newAcc.account_name} configured.`);
  };

  const handleSaveCashAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashForm.account_name) return;

    const newCash: BankAccountItem = {
      id: `acc_${Date.now()}`,
      account_name: cashForm.account_name,
      account_type: 'CASH',
      account_code: cashForm.account_code || `CASH-${Date.now().toString().slice(-4)}`,
      currency: cashForm.currency,
      account_number: 'CASH',
      bank_name: 'Cash Float',
      ifsc_code: 'N/A',
      description: cashForm.description,
      is_primary: false,
      opening_balance: Number(cashForm.opening_balance) || 0,
      amount_in_bank: Number(cashForm.opening_balance) || 0,
      amount_in_books: Number(cashForm.opening_balance) || 0,
      uncategorized_count: 0,
      status: 'ACTIVE',
    };

    setAccounts([newCash, ...accounts]);
    setIsAddCashModalOpen(false);
    showToast('success', 'Cash Account Added', `${newCash.account_name} recorded.`);
  };

  const handleDeleteAccount = (id: string, name: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    setActiveActionMenuId(null);
    showToast('info', 'Account Deleted', `Account ${name} was removed.`);
  };

  const totalBankBalance = accounts.filter(a => a.account_type === 'BANK').reduce((acc, a) => acc + a.amount_in_books, 0);
  const totalCashBalance = accounts.filter(a => a.account_type === 'CASH').reduce((acc, a) => acc + a.amount_in_books, 0);
  const totalClearing = accounts.find(a => a.id === 'acc_003')?.amount_in_books || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Banking & Accounts</h1>
          <p className="text-xs text-on-surface-variant">
            Manage corporate bank accounts, petty cash drawers, bank feed auto-uploads, and bank reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-1.5" />
            Import Statement
          </Button>

          <Button variant="primary" size="sm" onClick={() => setIsAddBankModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ Add Bank Account</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setIsAddCashModalOpen(true)}>
            <Wallet className="w-4 h-4 mr-1.5 text-secondary" />
            <span>+ Add Cash Account</span>
          </Button>
        </div>
      </div>

      {/* Auto-Upload Banner */}
      {showAutoUploadBanner && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-on-surface">Automatic Bank Feeds Integration</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                ● Enable Auto-upload in HENU OS CLM → ● Set up Auto-forwarding alias → ● Auto-sync daily statement feeds
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={() => showToast('info', 'Bank Feeds', 'Unique mail alias generated: bank-feeds@henu.io')}>
              Set Up Now
            </Button>
            <button
              onClick={() => setShowAutoUploadBanner(false)}
              className="p-1 rounded-lg text-outline hover:text-on-surface"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards & Chart Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Bank Balance</p>
            <p className="text-2xl font-bold text-on-surface mt-1">₹{totalBankBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Cash in Hand</p>
            <p className="text-2xl font-bold text-primary mt-1">₹{totalCashBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Payment Clearing</p>
            <p className="text-2xl font-bold text-secondary mt-1">₹{totalClearing.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Accounts Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <div className="p-3 border-b border-outline-variant/50 bg-surface-container-low/30 flex items-center justify-between gap-4">
          <span className="font-bold text-xs text-on-surface uppercase tracking-wider">Active Financial Accounts</span>
          <span className="text-xs text-outline">{accounts.length} Linked Accounts</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/60">
              <TableHead className="text-xs uppercase font-semibold">Account Details</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Account Type</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Uncategorized</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Amount in Bank</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Amount in Books</TableHead>
              <TableHead className="text-xs uppercase font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((acc) => (
              <TableRow key={acc.id} className="hover:bg-surface-container-low/40 transition">
                <TableCell>
                  <div className="font-semibold text-xs text-on-surface flex items-center gap-1.5">
                    {acc.account_name}
                    {acc.is_primary && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary/10 text-primary font-semibold">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-outline">
                    {acc.bank_name} ({acc.account_number})
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={acc.account_type === 'BANK' ? 'primary' : acc.account_type === 'CASH' ? 'secondary' : 'warning'}>
                    {acc.account_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {acc.uncategorized_count > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      {acc.uncategorized_count} Pending
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">Reconciled</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-mono font-bold text-on-surface">
                  ₹{acc.amount_in_bank.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-mono font-bold text-primary">
                  ₹{acc.amount_in_books.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="relative inline-block text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAccountForAction(acc);
                          setIsReconcileModalOpen(true);
                        }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-secondary" />
                        <span>Reconcile</span>
                      </Button>
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === acc.id ? null : acc.id)}
                        className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {activeActionMenuId === acc.id && (
                      <div className="absolute right-0 mt-1 w-52 bg-surface-container-lowest border border-outline-variant/80 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-xs text-left">
                        <button
                          onClick={() => {
                            setSelectedAccountForAction(acc);
                            setIsAddTransactionModalOpen(true);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                        >
                          <Plus className="w-3.5 h-3.5 text-primary" />
                          <span>+ Add Transaction</span>
                        </button>
                        <button
                          onClick={() => {
                            downloadDocumentFile('Bank Account Ledger Statement', acc.account_code, {
                              client: acc.account_name,
                              date: new Date().toISOString().split('T')[0],
                              amount: acc.amount_in_books,
                              status: acc.status,
                              notes: acc.description
                            });
                            showToast('success', 'Download Started', `Exporting statement for ${acc.account_name}`);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                        >
                          <Download className="w-3.5 h-3.5 text-outline" />
                          <span>Download Statement</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(acc.id, acc.account_name)}
                          className="w-full px-3 py-2 hover:bg-red-500/10 text-red-600 flex items-center gap-2 border-t border-outline-variant/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ADD BANK ACCOUNT MODAL */}
      <Modal
        isOpen={isAddBankModalOpen}
        onClose={() => setIsAddBankModalOpen(false)}
        title="Add Bank or Credit Card Account"
        description="Connect a corporate bank account with routing details, account number, and opening balance"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveBankAccount} className="space-y-4 text-xs text-on-surface">
          <div className="flex items-center gap-4 p-3 bg-surface-container-low rounded-lg">
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
              <input
                type="radio"
                name="accType"
                checked={bankForm.account_type === 'BANK'}
                onChange={() => setBankForm({ ...bankForm, account_type: 'BANK' })}
              />
              <span>Bank Account</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
              <input
                type="radio"
                name="accType"
                checked={bankForm.account_type === 'CREDIT_CARD'}
                onChange={() => setBankForm({ ...bankForm, account_type: 'CREDIT_CARD' })}
              />
              <span>Credit Card</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Account Name *</label>
              <input
                type="text"
                required
                value={bankForm.account_name}
                onChange={(e) => setBankForm({ ...bankForm, account_name: e.target.value })}
                placeholder="e.g. HDFC Current Account"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Bank Name *</label>
              <input
                type="text"
                required
                value={bankForm.bank_name}
                onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                placeholder="e.g. HDFC Bank"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Account Number *</label>
              <input
                type="text"
                required
                value={bankForm.account_number}
                onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                placeholder="e.g. 50200012346727"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">IFSC / Routing Code</label>
              <input
                type="text"
                value={bankForm.ifsc_code}
                onChange={(e) => setBankForm({ ...bankForm, ifsc_code: e.target.value })}
                placeholder="e.g. HDFC0001234"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Balance (INR ₹)</label>
              <input
                type="number"
                value={bankForm.opening_balance}
                onChange={(e) => setBankForm({ ...bankForm, opening_balance: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Date</label>
              <input
                type="date"
                value={bankForm.opening_date}
                onChange={(e) => setBankForm({ ...bankForm, opening_date: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={bankForm.is_primary}
              onChange={(e) => setBankForm({ ...bankForm, is_primary: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="font-semibold text-xs text-on-surface">Make this my primary bank account</span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsAddBankModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Bank Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD CASH ACCOUNT MODAL */}
      <Modal
        isOpen={isAddCashModalOpen}
        onClose={() => setIsAddCashModalOpen(false)}
        title="Add Cash / Petty Cash Account"
        description="Track physical cash drawers, petty cash floats, and cash on hand"
        maxWidth="md"
      >
        <form onSubmit={handleSaveCashAccount} className="space-y-4 text-xs text-on-surface">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Account Name *</label>
            <input
              type="text"
              required
              value={cashForm.account_name}
              onChange={(e) => setCashForm({ ...cashForm, account_name: e.target.value })}
              placeholder="e.g. Petty Cash Drawer"
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Balance (INR ₹)</label>
            <input
              type="number"
              value={cashForm.opening_balance}
              onChange={(e) => setCashForm({ ...cashForm, opening_balance: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Description</label>
            <textarea
              rows={2}
              value={cashForm.description}
              onChange={(e) => setCashForm({ ...cashForm, description: e.target.value })}
              placeholder="Notes on who holds this cash float..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsAddCashModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Cash Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* RECONCILE ACCOUNT MODAL */}
      {isReconcileModalOpen && selectedAccountForAction && (
        <Modal
          isOpen={true}
          onClose={() => setIsReconcileModalOpen(false)}
          title={`Bank Reconciliation — ${selectedAccountForAction.account_name}`}
          description={`Reconcile statement balances with cleared bank transactions`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs text-on-surface">
            <div className="p-3 bg-surface-container-low rounded-lg grid grid-cols-3 gap-3 text-center border border-outline-variant/40">
              <div>
                <p className="text-outline text-[11px]">Ledger Balance</p>
                <p className="font-bold text-sm text-on-surface font-mono">₹{selectedAccountForAction.amount_in_books.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-outline text-[11px]">Closing Balance on Statement</p>
                <input
                  type="number"
                  value={closingBalanceInput}
                  onChange={(e) => setClosingBalanceInput(parseFloat(e.target.value) || 0)}
                  className="w-28 p-1 bg-surface-container-lowest border border-outline-variant rounded text-center font-bold text-xs font-mono"
                />
              </div>
              <div>
                <p className="text-outline text-[11px]">Difference Variance</p>
                <p className="font-bold text-sm text-emerald-600 font-mono">
                  ₹{Math.abs(selectedAccountForAction.amount_in_books - closingBalanceInput).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              <p className="font-semibold text-outline uppercase tracking-wider text-[11px]">Uncleared Transactions</p>
              {[
                { id: 't1', desc: 'Customer Invoice Settlement #INV-2026-081', amount: 14000, type: 'IN' },
                { id: 't2', desc: 'Cloud Infrastructure SLA Retainer', amount: 20299, type: 'IN' }
              ].map((txn) => (
                <div key={txn.id} className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clearedTransactions.includes(txn.id)}
                      onChange={(e) => {
                        if (e.target.checked) setClearedTransactions([...clearedTransactions, txn.id]);
                        else setClearedTransactions(clearedTransactions.filter(x => x !== txn.id));
                      }}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-xs">{txn.desc}</span>
                  </label>
                  <span className="font-bold text-xs font-mono text-emerald-600">+₹{txn.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/40">
              <Button variant="outline" onClick={() => setIsReconcileModalOpen(false)}>
                Save as Draft
              </Button>
              <Button onClick={() => {
                showToast('success', 'Reconciliation Completed', 'Account statement balanced and locked.');
                setIsReconcileModalOpen(false);
              }}>
                Reconcile Now (Difference: ₹0.00)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* IMPORT STATEMENT MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Bank Statement"
        description="Upload your physical bank statement file to auto-extract transactions (Supported: CSV, TSV, OFX, QIF, CAMT.053)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-on-surface">
          <div className="p-6 border-2 border-dashed border-outline-variant/60 rounded-xl text-center space-y-2 bg-surface-container-low hover:bg-surface-container-high transition cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-primary" />
            <p className="font-bold text-on-surface">Drag & Drop Bank Statement File</p>
            <p className="text-outline text-[11px]">Maximum file size: 10MB per statement</p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/40">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              showToast('success', 'Statement Imported', 'Extracted 12 transactions from uploaded statement.');
              setIsImportModalOpen(false);
            }}>
              Parse & Import
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
