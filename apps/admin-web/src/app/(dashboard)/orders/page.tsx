'use client';

import * as React from 'react';
import { ShoppingBag, CheckCircle2, Clock, CheckSquare, FileText, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { OrderService } from '@/features/orders/orders.service';
import { type SalesOrder } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<SalesOrder[]>([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    OrderService.getOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Sales Orders & Delivery</h1>
          <p className="text-xs text-outline">Monitor project delivery progress, milestones, and invoice settlement linkages.</p>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Project Title / Client</TableHead>
              <TableHead>Contract Value</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Milestones</TableHead>
              <TableHead>Linked Invoice</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-outline">
                  No active orders in progress.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs text-primary font-semibold">{order.order_number}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface text-xs">{order.title}</span>
                      <span className="text-[11px] text-outline">
                        {order.client_name} ({order.client_company})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-on-surface">
                    {formatCurrency(order.total_amount, order.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-outline">
                        <span>{order.progress_percentage}% Complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${order.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-on-surface-variant">
                    {order.milestones.filter((m) => m.completed).length} of {order.milestones.length} Completed
                  </TableCell>
                  <TableCell>
                    {order.linked_invoice_number ? (
                      <a
                        href="/invoices"
                        className="inline-flex items-center gap-1 font-mono text-xs text-primary font-semibold hover:underline"
                      >
                        <span>{order.linked_invoice_number}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-outline">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'in_progress' ? 'warning' : 'success'}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
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
