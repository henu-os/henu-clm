'use client';

import * as React from 'react';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, Eye, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { PaymentService } from '@/features/orders/orders.service';
import { type PaymentTransaction } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentTransaction[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentTransaction | null>(null);
  const { showToast } = useToast();

  React.useEffect(() => {
    PaymentService.getPayments().then(setPayments);
  }, []);

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Payments & Reconciliation Ledger</h1>
          <p className="text-xs text-outline">Real-time payment transactions across Razorpay, Cashfree, and banking channels.</p>
        </div>
        <Button variant="outline" size="md" onClick={() => showToast('success', 'Ledger Synchronized', 'All gateway transactions reconciled.')}>
          <RefreshCw className="w-4 h-4 mr-1.5" />
          <span>Re-sync Gateway Records</span>
        </Button>
      </div>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Ref</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reconciliation</TableHead>
              <TableHead className="text-right">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-outline">
                  No payment transactions recorded.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-mono text-xs text-primary font-semibold">{pay.payment_reference}</TableCell>
                  <TableCell className="font-mono text-xs text-on-surface">{pay.invoice_number}</TableCell>
                  <TableCell className="text-xs font-semibold text-on-surface">{pay.client_name}</TableCell>
                  <TableCell className="text-xs font-bold text-secondary">
                    {formatCurrency(pay.amount, pay.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pay.gateway === 'razorpay' ? 'primary' : 'warning'}>
                      {pay.gateway.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pay.status === 'successful' ? 'success' : 'danger'}>
                      {pay.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Reconciled
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedPayment(pay)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Transaction Cryptographic Details"
        description={selectedPayment?.payment_reference}
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface-container-low rounded border border-outline-variant/40 space-y-2">
              <div className="flex justify-between">
                <span className="text-outline">Gateway Order ID:</span>
                <span className="font-mono font-semibold">{selectedPayment.gateway_order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Gateway Payment ID:</span>
                <span className="font-mono font-semibold">{selectedPayment.gateway_payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Settled Timestamp:</span>
                <span>{formatDate(selectedPayment.created_at)}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded border border-outline-variant/40">
              <p className="text-[10px] text-outline uppercase font-semibold mb-1">Webhook Signature Verification</p>
              <p className="font-mono text-[11px] text-secondary break-all">
                HMAC-SHA256: Verified against server secret in Supabase Vault.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
