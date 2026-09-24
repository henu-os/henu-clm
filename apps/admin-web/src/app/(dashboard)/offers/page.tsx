'use client';

import * as React from 'react';
import { 
  Tag, 
  Plus, 
  Calendar, 
  Search, 
  Trash2, 
  Download, 
  CheckCircle2, 
  MoreVertical, 
  Edit3, 
  Percent, 
  Gift, 
  Sparkles,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { downloadDocumentFile } from '@/lib/download';

export interface OfferItem {
  id: string;
  offer_title: string;
  coupon_code: string;
  discount_type: 'PERCENTAGE' | 'FLAT_AMOUNT';
  discount_value: number;
  min_order_value: number;
  valid_from: string;
  valid_until: string;
  max_redemptions: number;
  redeemed_count: number;
  target_audience: 'ALL_CLIENTS' | 'ENTERPRISE_ONLY' | 'NEW_CLIENTS';
  description: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
}

const INITIAL_OFFERS: OfferItem[] = [
  {
    id: 'off_001',
    offer_title: 'Early Bird Enterprise CLM Migration Discount',
    coupon_code: 'ENTERPRISE20',
    discount_type: 'PERCENTAGE',
    discount_value: 20,
    min_order_value: 100000,
    valid_from: '2026-09-01',
    valid_until: '2026-10-31',
    max_redemptions: 50,
    redeemed_count: 14,
    target_audience: 'ENTERPRISE_ONLY',
    description: '20% off full-stack CLM cloud migration and custom multi-tenant architecture setup.',
    status: 'ACTIVE',
  },
  {
    id: 'off_002',
    offer_title: 'Q3 Security Audit Flat Welcome Rebate',
    coupon_code: 'SECURE5000',
    discount_type: 'FLAT_AMOUNT',
    discount_value: 5000,
    min_order_value: 25000,
    valid_from: '2026-09-15',
    valid_until: '2026-11-15',
    max_redemptions: 100,
    redeemed_count: 38,
    target_audience: 'ALL_CLIENTS',
    description: 'Flat ₹5,000 rebate on comprehensive cybersecurity audits and zero-trust verification.',
    status: 'ACTIVE',
  }
];

export default function OffersPage() {
  const [offers, setOffers] = React.useState<OfferItem[]>(INITIAL_OFFERS);
  const [isNewOfferModalOpen, setIsNewOfferModalOpen] = React.useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [offerForm, setOfferForm] = React.useState({
    offer_title: '',
    coupon_code: '',
    discount_type: 'PERCENTAGE' as OfferItem['discount_type'],
    discount_value: 10,
    min_order_value: 10000,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '2026-12-31',
    max_redemptions: 50,
    target_audience: 'ALL_CLIENTS' as OfferItem['target_audience'],
    description: '',
  });

  const { showToast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('info', 'Code Copied', `Coupon code "${code}" copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.offer_title || !offerForm.coupon_code) return;

    const newOffer: OfferItem = {
      id: `off_${Date.now()}`,
      offer_title: offerForm.offer_title,
      coupon_code: offerForm.coupon_code.toUpperCase(),
      discount_type: offerForm.discount_type,
      discount_value: Number(offerForm.discount_value) || 0,
      min_order_value: Number(offerForm.min_order_value) || 0,
      valid_from: offerForm.valid_from,
      valid_until: offerForm.valid_until,
      max_redemptions: Number(offerForm.max_redemptions) || 10,
      redeemed_count: 0,
      target_audience: offerForm.target_audience,
      description: offerForm.description,
      status: 'ACTIVE',
    };

    setOffers([newOffer, ...offers]);
    setIsNewOfferModalOpen(false);
    showToast('success', 'Offer Created', `Offer ${newOffer.coupon_code} created and live.`);
  };

  const handleDeleteOffer = (id: string, code: string) => {
    setOffers(offers.filter(o => o.id !== id));
    setActiveActionMenuId(null);
    showToast('info', 'Offer Deleted', `Offer ${code} was removed.`);
  };

  const filteredOffers = offers.filter(o => 
    o.offer_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.coupon_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Commercial Offers & Promotions</h1>
          <p className="text-xs text-on-surface-variant">
            Create coupon codes, promotional rebates, client loyalty packages, and quote discount rules.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsNewOfferModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>+ Create Offer</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Active Promotional Offers</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{offers.filter(o => o.status === 'ACTIVE').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Redemptions</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {offers.reduce((acc, o) => acc + o.redeemed_count, 0)} Used
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Campaign Reach</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              {offers.reduce((acc, o) => acc + o.max_redemptions, 0)} Total Cap
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl flex items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search offers by title or coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-outline">{filteredOffers.length} Offers</span>
      </div>

      {/* Offers Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/60">
              <TableHead className="text-xs uppercase font-semibold">Offer Title & Code</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Discount</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Min Order Value</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Validity Period</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Usage & Cap</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
              <TableHead className="text-xs uppercase font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.map((off) => (
              <TableRow key={off.id} className="hover:bg-surface-container-low/40 transition">
                <TableCell>
                  <div className="font-semibold text-xs text-on-surface">{off.offer_title}</div>
                  <button
                    onClick={() => handleCopyCode(off.coupon_code)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary mt-0.5 hover:underline"
                    title="Click to copy coupon code"
                  >
                    <span>{off.coupon_code}</span>
                    {copiedCode === off.coupon_code ? (
                      <Check className="w-3 h-3 text-secondary" />
                    ) : (
                      <Copy className="w-3 h-3 text-outline" />
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-xs font-bold text-on-surface font-mono">
                  {off.discount_type === 'PERCENTAGE' ? `${off.discount_value}% OFF` : `₹${off.discount_value.toLocaleString()} FLAT`}
                </TableCell>
                <TableCell className="text-xs font-mono text-on-surface-variant">
                  ₹{off.min_order_value.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-outline">
                  {off.valid_from} → {off.valid_until}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  <span className="font-bold text-on-surface">{off.redeemed_count}</span> / {off.max_redemptions}
                </TableCell>
                <TableCell>
                  <Badge variant={off.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {off.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="relative inline-block text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href="/quotes"
                        className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary/10 hover:text-primary text-xs font-medium transition text-on-surface inline-flex items-center gap-1"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Apply in Quote</span>
                      </a>
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === off.id ? null : off.id)}
                        className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {activeActionMenuId === off.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant/80 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-xs text-left">
                        <button
                          onClick={() => {
                            downloadDocumentFile('Promotional Offer Campaign Voucher', off.coupon_code, {
                              client: 'Valued Enterprise Client',
                              date: off.valid_until,
                              amount: off.discount_value,
                              status: off.status,
                              notes: off.description
                            });
                            showToast('success', 'Voucher Exported', `Downloaded voucher for ${off.coupon_code}`);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                        >
                          <Download className="w-3.5 h-3.5 text-outline" />
                          <span>Download Voucher PDF</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(off.id, off.coupon_code)}
                          className="w-full px-3 py-2 hover:bg-red-500/10 text-red-600 flex items-center gap-2 border-t border-outline-variant/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Offer</span>
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

      {/* NEW OFFER MODAL */}
      <Modal
        isOpen={isNewOfferModalOpen}
        onClose={() => setIsNewOfferModalOpen(false)}
        title="Create Promotional Offer"
        description="Configure discount percentage, minimum order constraints, validity dates, and redemption caps"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveOffer} className="space-y-4 text-xs text-on-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Offer Title *</label>
              <input
                type="text"
                required
                value={offerForm.offer_title}
                onChange={(e) => setOfferForm({ ...offerForm, offer_title: e.target.value })}
                placeholder="e.g. Q4 Cloud Modernization Rebate"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={offerForm.coupon_code}
                onChange={(e) => setOfferForm({ ...offerForm, coupon_code: e.target.value.toUpperCase() })}
                placeholder="e.g. CLOUD2026"
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Discount Type</label>
              <select
                value={offerForm.discount_type}
                onChange={(e) => setOfferForm({ ...offerForm, discount_type: e.target.value as any })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              >
                <option value="PERCENTAGE">Percentage Discount (%)</option>
                <option value="FLAT_AMOUNT">Flat Amount Rebate (INR ₹)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Discount Value *</label>
              <input
                type="number"
                required
                value={offerForm.discount_value}
                onChange={(e) => setOfferForm({ ...offerForm, discount_value: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Min Order Value (INR ₹)</label>
              <input
                type="number"
                value={offerForm.min_order_value}
                onChange={(e) => setOfferForm({ ...offerForm, min_order_value: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Max Redemptions Cap</label>
              <input
                type="number"
                value={offerForm.max_redemptions}
                onChange={(e) => setOfferForm({ ...offerForm, max_redemptions: parseInt(e.target.value) || 10 })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Valid From</label>
              <input
                type="date"
                value={offerForm.valid_from}
                onChange={(e) => setOfferForm({ ...offerForm, valid_from: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Valid Until</label>
              <input
                type="date"
                value={offerForm.valid_until}
                onChange={(e) => setOfferForm({ ...offerForm, valid_until: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Offer Terms & Description</label>
            <textarea
              rows={2}
              value={offerForm.description}
              onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
              placeholder="Terms and eligibility conditions for this promotional discount..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsNewOfferModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save & Launch Offer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
