'use client';

import * as React from 'react';
import { Receipt, Download, Eye, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { InvoiceService } from '@/features/orders/orders.service';
import { type Invoice } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    InvoiceService.getInvoices().then(setInvoices);
  }, []);

  const handleDownloadPDF = (invoiceNumber: string) => {
    showToast('success', 'PDF Invoice Generated', `Downloading official tax invoice ${invoiceNumber}...`);
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Tax Invoices & Billing</h1>
          <p className="text-xs text-outline">Manage commercial tax invoices, payment settlement statuses, and PDF generation.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => showToast('info', 'New Invoice Builder', 'Manual invoice creation.')}>
          <Receipt className="w-4 h-4 mr-1.5" />
          <span>+ Issue New Invoice</span>
        </Button>
      </div>

      {/* Financial KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Total Invoiced (MTD)</p>
          <p className="text-xl font-bold text-on-surface mt-1">₹6,367.28</p>
        </Card>
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Amount Received</p>
          <p className="text-xl font-bold text-secondary mt-1">₹4,240.82</p>
        </Card>
        <Card className="p-space-md">
          <p className="text-[10px] text-outline uppercase font-semibold">Outstanding Due</p>
          <p className="text-xl font-bold text-error mt-1">₹2,126.46</p>
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
                    <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'partially_paid' ? 'warning' : 'danger'}>
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
    </div>
  );
}
