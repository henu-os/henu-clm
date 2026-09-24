'use client';

import * as React from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  CheckSquare, 
  FileText, 
  ArrowUpRight,
  Plus,
  Trash2,
  MoreVertical,
  Download,
  Eye,
  Send,
  Edit3,
  Printer,
  FileSpreadsheet,
  Layers,
  Save,
  Check,
  Paperclip,
  Upload,
  Settings,
  ChevronDown,
  Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { OrderService } from '@/features/orders/orders.service';
import { type SalesOrder } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { formatCurrencyWords } from '@/lib/finance/number_to_words';
import { CATALOG_PRESET_ITEMS } from '@/features/catalog/items.data';

interface OrderLineItem {
  id: string;
  item_id?: string;
  item_details: string;
  account: string;
  quantity: number;
  rate: number;
  tax_rate: number;
  amount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<SalesOrder[]>([]);
  const { showToast } = useToast();

  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = React.useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = React.useState(false);
  const [selectedBulkItemIds, setSelectedBulkItemIds] = React.useState<string[]>([]);
  const [bulkSearchQuery, setBulkSearchQuery] = React.useState('');

  const [orderForm, setOrderForm] = React.useState({
    customer_name: 'Aero Dynamics Inc',
    order_number: `SO-000${Math.floor(10 + Math.random() * 90)}`,
    reference_number: 'REF-PO-9912',
    order_date: new Date().toISOString().split('T')[0],
    expected_shipment_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    payment_terms: 'Net 30',
    delivery_method: 'Digital Sprint Handover & Cloud Deployment',
    salesperson: 'Aarav Sharma',
    customer_notes: 'Scope executed under dedicated sprint cycle. Milestones tracked in real time.',
    terms_conditions: 'Work defined strictly as per approved quotation and milestone acceptance criteria.',
    tds_tcs: 'TDS' as 'NONE' | 'TDS' | 'TCS',
    tax_deduction_amount: 0,
    adjustment: 0,
    template: 'Spreadsheet Template',
  });

  const [orderItems, setOrderItems] = React.useState<OrderLineItem[]>([
    {
      id: 'oi_1',
      item_id: 'itm_001',
      item_details: 'Dedicated Full-Stack System Architecture & Engineering',
      account: 'Sales',
      quantity: 1,
      rate: 15000,
      tax_rate: 18,
      amount: 17700,
    },
  ]);

  React.useEffect(() => {
    OrderService.getOrders().then(setOrders);
  }, []);

  const handleSelectItem = (rowId: string, itemId: string) => {
    const preset = CATALOG_PRESET_ITEMS.find((p) => p.id === itemId);
    if (!preset) return;

    setOrderItems((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const qty = row.quantity || 1;
          const rate = preset.default_rate;
          const taxPct = preset.default_tax_rate;
          const taxable = qty * rate;
          const tax = taxable * (taxPct / 100);
          return {
            ...row,
            item_id: preset.id,
            item_details: preset.name,
            account: preset.default_account,
            rate: rate,
            tax_rate: taxPct,
            amount: taxable + tax,
          };
        }
        return row;
      })
    );
  };

  const handleItemChange = (id: string, field: keyof OrderLineItem, value: any) => {
    setOrderItems((prev) =>
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
    const defaultPreset = CATALOG_PRESET_ITEMS[0];
    const newRow: OrderLineItem = {
      id: `oi_${Date.now()}`,
      item_id: defaultPreset.id,
      item_details: defaultPreset.name,
      account: defaultPreset.default_account,
      quantity: 1,
      rate: defaultPreset.default_rate,
      tax_rate: defaultPreset.default_tax_rate,
      amount: defaultPreset.default_rate * (1 + defaultPreset.default_tax_rate / 100),
    };
    setOrderItems([...orderItems, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (orderItems.length <= 1) return;
    setOrderItems(orderItems.filter((r) => r.id !== id));
  };

  const handleConfirmBulkAdd = () => {
    const newRows: OrderLineItem[] = selectedBulkItemIds.map((id, idx) => {
      const preset = CATALOG_PRESET_ITEMS.find((p) => p.id === id)!;
      const taxable = preset.default_rate;
      const tax = taxable * (preset.default_tax_rate / 100);
      return {
        id: `bulk_${Date.now()}_${idx}`,
        item_id: preset.id,
        item_details: preset.name,
        account: preset.default_account,
        quantity: 1,
        rate: preset.default_rate,
        tax_rate: preset.default_tax_rate,
        amount: taxable + tax,
      };
    });

    setOrderItems([...orderItems, ...newRows]);
    setSelectedBulkItemIds([]);
    setIsBulkModalOpen(false);
    showToast('success', 'Items Added', `Added ${newRows.length} items from catalog to sales order.`);
  };

  const subtotal = orderItems.reduce((acc, r) => acc + (Number(r.quantity) || 0) * (Number(r.rate) || 0), 0);
  const totalTax = orderItems.reduce((acc, r) => {
    const base = (Number(r.quantity) || 0) * (Number(r.rate) || 0);
    return acc + base * ((Number(r.tax_rate) || 0) / 100);
  }, 0);
  const grandTotal = Math.max(0, subtotal + totalTax + Number(orderForm.adjustment || 0));

  const handleSaveOrder = (status: 'in_progress' | 'pending_deposit') => {
    const newOrder: SalesOrder = {
      id: `ord_${Date.now()}`,
      order_number: orderForm.order_number,
      quote_id: 'q_001',
      user_id: 'usr_001',
      client_name: orderForm.customer_name,
      client_company: orderForm.customer_name,
      title: 'Commercial Execution & Sprint Milestone Contract',
      total_amount: grandTotal,
      currency: 'INR',
      status: status,
      progress_percentage: 15,
      linked_invoice_number: undefined,
      milestones: [
        { id: 'm1', title: 'Phase 1: Architecture & Foundations', completed: true },
        { id: 'm2', title: 'Phase 2: Realtime Engine & Gateway', completed: false },
        { id: 'm3', title: 'Phase 3: QA & Final Handover', completed: false },
      ],
      started_at: orderForm.order_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderOpen(false);
    showToast('success', 'Sales Order Created', `Order ${newOrder.order_number} confirmed for ₹${grandTotal.toLocaleString()}.`);
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Sales Orders & Delivery</h1>
          <p className="text-xs text-outline">Monitor project delivery progress, milestones, itemized contracts, and invoice settlement linkages.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsNewOrderOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>+ New Sales Order</span>
        </Button>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-outline">
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
                  <TableCell className="text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === order.id ? null : order.id)}
                        className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeActionMenuId === order.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl py-1 z-30 text-xs text-left">
                          <button
                            onClick={() => {
                              showToast('success', 'Order Dispatch', `Order confirmation sent for ${order.order_number}`);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5 text-primary" />
                            <span>Send Confirmation</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('success', 'PDF Export', `Downloading ${order.order_number} PDF...`);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5 text-outline" />
                            <span>Download PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              window.print();
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 border-t border-outline-variant/40"
                          >
                            <Printer className="w-3.5 h-3.5 text-outline" />
                            <span>Print Order</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* NEW SALES ORDER MODAL */}
      <Modal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="Create New Sales Order"
        description="Configure order line items, shipment delivery dates, milestone linkages, and auto-dispatch"
        maxWidth="5xl"
      >
        <div className="space-y-6 text-xs text-on-surface">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={orderForm.customer_name}
                onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                <option value="Acme Global Ventures">Acme Global Ventures</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Sales Order # *</label>
              <input
                type="text"
                required
                value={orderForm.order_number}
                onChange={(e) => setOrderForm({ ...orderForm, order_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reference #</label>
              <input
                type="text"
                value={orderForm.reference_number}
                onChange={(e) => setOrderForm({ ...orderForm, reference_number: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Sales Order Date *</label>
              <input
                type="date"
                required
                value={orderForm.order_date}
                onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Expected Delivery / Shipment Date</label>
              <input
                type="date"
                value={orderForm.expected_shipment_date}
                onChange={(e) => setOrderForm({ ...orderForm, expected_shipment_date: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Terms</label>
              <select
                value={orderForm.payment_terms}
                onChange={(e) => setOrderForm({ ...orderForm, payment_terms: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Delivery / Handover Method</label>
              <input
                type="text"
                value={orderForm.delivery_method}
                onChange={(e) => setOrderForm({ ...orderForm, delivery_method: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Salesperson</label>
              <input
                type="text"
                value={orderForm.salesperson}
                onChange={(e) => setOrderForm({ ...orderForm, salesperson: e.target.value })}
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
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsBulkModalOpen(true)}>
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  Add Items in Bulk
                </Button>
                <Button size="sm" variant="outline" onClick={handleAddRow}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add New Row
                </Button>
              </div>
            </div>

            <div className="border border-outline-variant/60 rounded-lg overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-semibold uppercase text-outline">
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5">Item Details (Catalog Select)</th>
                    <th className="p-2.5 w-20 text-center">Qty</th>
                    <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                    <th className="p-2.5 w-24 text-center">Tax Rate</th>
                    <th className="p-2.5 w-28 text-right">Amount (₹)</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {orderItems.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="p-2 text-center text-outline font-mono">{idx + 1}</td>
                      <td className="p-2">
                        <select
                          value={row.item_id || ''}
                          onChange={(e) => handleSelectItem(row.id, e.target.value)}
                          className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
                        >
                          <option value="" disabled>-- Select Catalog Item --</option>
                          {CATALOG_PRESET_ITEMS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.sku}) - ₹{item.default_rate}
                            </option>
                          ))}
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
                  value={orderForm.customer_notes}
                  onChange={(e) => setOrderForm({ ...orderForm, customer_notes: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={orderForm.terms_conditions}
                  onChange={(e) => setOrderForm({ ...orderForm, terms_conditions: e.target.value })}
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
                <span className="text-outline">GST / Tax Amount:</span>
                <span className="font-semibold text-on-surface">₹{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Adjustment (+ / -):</span>
                <input
                  type="number"
                  value={orderForm.adjustment}
                  onChange={(e) => setOrderForm({ ...orderForm, adjustment: Number(e.target.value) })}
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
            <Button variant="outline" size="sm" onClick={() => setIsNewOrderOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveOrder('pending_deposit')}>
              <Save className="w-3.5 h-3.5 mr-1" />
              Save as Draft
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleSaveOrder('in_progress')}>
              <Send className="w-3.5 h-3.5 mr-1" />
              Save and Send
            </Button>
          </div>
        </div>
      </Modal>

      {/* BULK ITEM SELECTION MODAL */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Add Items in Bulk from Catalog"
        description="Select multiple service scopes or goods to add directly into the sales order"
        maxWidth="3xl"
      >
        <div className="space-y-4 text-xs text-on-surface">
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog items..."
              value={bulkSearchQuery}
              onChange={(e) => setBulkSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs"
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-2 border border-outline-variant/40 rounded-lg p-2">
            {CATALOG_PRESET_ITEMS.filter((item) =>
              item.name.toLowerCase().includes(bulkSearchQuery.toLowerCase()) ||
              item.sku.toLowerCase().includes(bulkSearchQuery.toLowerCase())
            ).map((item) => {
              const isSelected = selectedBulkItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedBulkItemIds(selectedBulkItemIds.filter((id) => id !== item.id));
                    } else {
                      setSelectedBulkItemIds([...selectedBulkItemIds, item.id]);
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-on-surface'
                      : 'bg-surface-container-lowest border-outline-variant/50 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{item.name}</p>
                      <p className="text-[11px] text-outline font-mono">SKU: {item.sku} | SAC/HSN: {item.hsn_sac_code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-on-surface">₹{item.default_rate.toLocaleString()}</p>
                    <p className="text-[10px] text-outline">{item.default_tax_rate}% GST</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
            <span className="text-outline">{selectedBulkItemIds.length} items selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={selectedBulkItemIds.length === 0}
                onClick={handleConfirmBulkAdd}
              >
                Add {selectedBulkItemIds.length} Items
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
