'use client';

import * as React from 'react';
import { FileText, CheckCircle2, XCircle, Search, Filter, Eye, DollarSign, Calendar, Clock, Sparkles } from 'lucide-react';
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

export default function QuotesPage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedQuote, setSelectedQuote] = React.useState<Quote | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = React.useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = React.useState(false);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [rejectionReason, setRejectionReason] = React.useState('');
  const { showToast } = useToast();

  const loadQuotes = React.useCallback(() => {
    QuoteService.getQuotes({ status: statusFilter }).then(setQuotes);
  }, [statusFilter]);

  React.useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

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
          <Button variant="primary" size="md" onClick={() => showToast('info', 'New Quote Wizard', 'Manual quote creation.')}>
            <FileText className="w-4 h-4 mr-1.5" />
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
