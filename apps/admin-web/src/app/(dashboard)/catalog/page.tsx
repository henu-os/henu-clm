'use client';

import * as React from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Tag, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Package,
  Wrench,
  Search,
  Filter,
  Archive,
  BarChart2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export interface ItemRecord {
  id: string;
  item_type: 'GOODS' | 'SERVICE';
  name: string;
  sku: string;
  unit: string;
  hsn_sac_code: string;
  tax_preference: 'TAXABLE' | 'NON_TAXABLE' | 'OUT_OF_SCOPE' | 'NON_GST';
  exemption_reason?: string;
  selling_price: number;
  sales_account: string;
  sales_description?: string;
  cost_price: number;
  purchase_account: string;
  preferred_vendor?: string;
  intra_state_tax_rate: number;
  inter_state_tax_rate: number;
  track_inventory: boolean;
  opening_stock: number;
  opening_stock_rate: number;
  reorder_point: number;
  current_stock: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export default function CatalogPage() {
  const [items, setItems] = React.useState<ItemRecord[]>([
    {
      id: 'itm_001',
      item_type: 'SERVICE',
      name: 'Enterprise Cloud Architecture Topology',
      sku: 'SRV-ARCH-01',
      unit: 'project',
      hsn_sac_code: '998313',
      tax_preference: 'TAXABLE',
      selling_price: 18000.00,
      sales_account: 'Consulting Revenue',
      sales_description: 'Multi-region high-availability topology blueprint and Terraform scripts.',
      cost_price: 8000.00,
      purchase_account: 'Contractor Expenses',
      intra_state_tax_rate: 18.00,
      inter_state_tax_rate: 18.00,
      track_inventory: false,
      opening_stock: 0,
      opening_stock_rate: 0,
      reorder_point: 0,
      current_stock: 0,
      status: 'ACTIVE',
    },
    {
      id: 'itm_002',
      item_type: 'SERVICE',
      name: 'Full-Stack Security Penetration Audit',
      sku: 'SRV-SEC-02',
      unit: 'audit',
      hsn_sac_code: '998314',
      tax_preference: 'TAXABLE',
      selling_price: 14000.00,
      sales_account: 'Audit Services',
      sales_description: 'DAST/SAST penetration testing & SOC2 compliance report.',
      cost_price: 5000.00,
      purchase_account: 'Security Tooling',
      intra_state_tax_rate: 18.00,
      inter_state_tax_rate: 18.00,
      track_inventory: false,
      opening_stock: 0,
      opening_stock_rate: 0,
      reorder_point: 0,
      current_stock: 0,
      status: 'ACTIVE',
    },
    {
      id: 'itm_003',
      item_type: 'GOODS',
      name: 'Hardware Security Key (FIDO2 Enterprise)',
      sku: 'HW-KEY-001',
      unit: 'pcs',
      hsn_sac_code: '8471',
      tax_preference: 'TAXABLE',
      selling_price: 120.00,
      sales_account: 'Hardware Sales',
      sales_description: 'Cryptographic security token for zero-trust IAM authentication.',
      cost_price: 65.00,
      purchase_account: 'Hardware Inventory Asset',
      preferred_vendor: 'Yubico Supply Partner',
      intra_state_tax_rate: 18.00,
      inter_state_tax_rate: 18.00,
      track_inventory: true,
      opening_stock: 500,
      opening_stock_rate: 65,
      reorder_point: 50,
      current_stock: 420,
      status: 'ACTIVE',
    },
  ]);

  const [filterType, setFilterType] = React.useState<'ALL' | 'GOODS' | 'SERVICE'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  const [newItem, setNewItem] = React.useState<Omit<ItemRecord, 'id' | 'current_stock' | 'status'>>({
    item_type: 'SERVICE',
    name: '',
    sku: '',
    unit: 'project',
    hsn_sac_code: '998313',
    tax_preference: 'TAXABLE',
    exemption_reason: '',
    selling_price: 5000,
    sales_account: 'Sales',
    sales_description: '',
    cost_price: 2500,
    purchase_account: 'Cost of Goods Sold',
    preferred_vendor: '',
    intra_state_tax_rate: 18,
    inter_state_tax_rate: 18,
    track_inventory: false,
    opening_stock: 0,
    opening_stock_rate: 0,
    reorder_point: 10,
  });

  const { showToast } = useToast();

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) return;

    const created: ItemRecord = {
      ...newItem,
      id: `itm_${Date.now()}`,
      current_stock: newItem.opening_stock || 0,
      status: 'ACTIVE',
    };

    setItems([created, ...items]);
    setCreateModalOpen(false);
    showToast('success', 'Item Created', `${created.name} (${created.sku}) added to catalog.`);
    setNewItem({
      item_type: 'SERVICE',
      name: '',
      sku: '',
      unit: 'project',
      hsn_sac_code: '998313',
      tax_preference: 'TAXABLE',
      exemption_reason: '',
      selling_price: 5000,
      sales_account: 'Sales',
      sales_description: '',
      cost_price: 2500,
      purchase_account: 'Cost of Goods Sold',
      preferred_vendor: '',
      intra_state_tax_rate: 18,
      inter_state_tax_rate: 18,
      track_inventory: false,
      opening_stock: 0,
      opening_stock_rate: 0,
      reorder_point: 10,
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'ALL' || item.item_type === filterType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Items & Catalog</h1>
          <p className="text-xs text-gray-400">Manage goods, billable services, tax classifications, and inventory accounts</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Catalog Items</p>
          <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Services</p>
          <p className="text-2xl font-bold text-[#887DB8] mt-1">
            {items.filter((i) => i.item_type === 'SERVICE').length}
          </p>
        </div>
        <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inventory Goods</p>
          <p className="text-2xl font-bold text-[#D9A441] mt-1">
            {items.filter((i) => i.item_type === 'GOODS').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181B24] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'ALL'
                ? 'bg-[#887DB8] text-white'
                : 'bg-[#20202B] text-gray-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('SERVICE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'SERVICE'
                ? 'bg-[#887DB8] text-white'
                : 'bg-[#20202B] text-gray-400 hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setFilterType('GOODS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'GOODS'
                ? 'bg-[#887DB8] text-white'
                : 'bg-[#20202B] text-gray-400 hover:text-white'
            }`}
          >
            Goods
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#887DB8]"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-[#181B24] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/60 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">HSN / SAC</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Tax (GST)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#20202B]/40 transition">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs font-mono text-[#887DB8] mt-0.5">{item.sku}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium border ${
                        item.item_type === 'GOODS'
                          ? 'bg-[#D9A441]/10 text-[#D9A441] border-[#D9A441]/20'
                          : 'bg-[#887DB8]/10 text-[#887DB8] border-[#887DB8]/20'
                      }`}
                    >
                      {item.item_type === 'GOODS' ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                      {item.item_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-gray-300">{item.hsn_sac_code || '—'}</td>
                  <td className="py-4 px-4 font-bold text-white">₹{item.selling_price.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-300">₹{item.cost_price.toLocaleString()}</td>
                  <td className="py-4 px-4 text-xs text-gray-300">{item.intra_state_tax_rate}% GST</td>
                  <td className="py-4 px-4">
                    {item.track_inventory ? (
                      <span className="font-mono font-medium text-white">{item.current_stock} {item.unit}</span>
                    ) : (
                      <span className="text-xs text-gray-400">N/A (Service)</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW ITEM MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Item / Service"
        description="Configure item details, HSN/SAC codes, multi-tax rates, sales/purchase accounts, and inventory controls"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateItem} className="space-y-5 text-xs text-on-surface">
          {/* Item Type */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1.5">Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, item_type: 'GOODS' })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition ${
                  newItem.item_type === 'GOODS'
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-outline-variant bg-surface-container-low text-outline hover:bg-surface-container-high'
                }`}
              >
                <Package className="w-4 h-4" />
                Goods
              </button>
              <button
                type="button"
                onClick={() => setNewItem({ ...newItem, item_type: 'SERVICE' })}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition ${
                  newItem.item_type === 'SERVICE'
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-outline-variant bg-surface-container-low text-outline hover:bg-surface-container-high'
                }`}
              >
                <Wrench className="w-4 h-4" />
                Service
              </button>
            </div>
          </div>

          {/* Main Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dedicated Engineering Retainer"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">SKU</label>
              <input
                type="text"
                required
                placeholder="e.g. SRV-ENG-01"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Unit</label>
              <input
                type="text"
                placeholder="pcs, box, kg, hrs, project"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">HSN / SAC Code</label>
              <input
                type="text"
                placeholder="HSN for Goods / SAC for Services"
                value={newItem.hsn_sac_code}
                onChange={(e) => setNewItem({ ...newItem, hsn_sac_code: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Tax Preference *</label>
              <select
                value={newItem.tax_preference}
                onChange={(e) => setNewItem({ ...newItem, tax_preference: e.target.value as any })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="TAXABLE">Taxable</option>
                <option value="NON_TAXABLE">Non-Taxable</option>
                <option value="OUT_OF_SCOPE">Out of Scope</option>
                <option value="NON_GST">Non-GST</option>
              </select>
            </div>

            {newItem.tax_preference === 'NON_TAXABLE' && (
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Exemption Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Export of Services under LUT"
                  value={newItem.exemption_reason}
                  onChange={(e) => setNewItem({ ...newItem, exemption_reason: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Sales Information */}
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-on-surface">Sales Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={newItem.selling_price}
                  onChange={(e) => setNewItem({ ...newItem, selling_price: Number(e.target.value) })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Sales Account *</label>
                <select
                  value={newItem.sales_account}
                  onChange={(e) => setNewItem({ ...newItem, sales_account: e.target.value })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="Sales">Sales</option>
                  <option value="Consulting Revenue">Consulting Revenue</option>
                  <option value="Software Subscription">Software Subscription</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Description rendered on customer quotes and invoices..."
                value={newItem.sales_description}
                onChange={(e) => setNewItem({ ...newItem, sales_description: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Purchase Information & Tax Rates */}
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-on-surface">Purchase & Tax Rates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  value={newItem.cost_price}
                  onChange={(e) => setNewItem({ ...newItem, cost_price: Number(e.target.value) })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Intra State Tax (GST)</label>
                <select
                  value={newItem.intra_state_tax_rate}
                  onChange={(e) => setNewItem({ ...newItem, intra_state_tax_rate: Number(e.target.value) })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value={0}>GST 0%</option>
                  <option value={5}>GST 5%</option>
                  <option value={12}>GST 12%</option>
                  <option value={18}>GST 18%</option>
                  <option value={28}>GST 28%</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Inter State Tax (IGST)</label>
                <select
                  value={newItem.inter_state_tax_rate}
                  onChange={(e) => setNewItem({ ...newItem, inter_state_tax_rate: Number(e.target.value) })}
                  className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value={0}>IGST 0%</option>
                  <option value={5}>IGST 5%</option>
                  <option value={12}>IGST 12%</option>
                  <option value={18}>IGST 18%</option>
                  <option value={28}>IGST 28%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Track Inventory (for Goods) */}
          {newItem.item_type === 'GOODS' && (
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inv_track"
                  checked={newItem.track_inventory}
                  onChange={(e) => setNewItem({ ...newItem, track_inventory: e.target.checked })}
                  className="rounded border-outline-variant text-primary"
                />
                <label htmlFor="inv_track" className="font-bold uppercase tracking-wider text-on-surface cursor-pointer">
                  Track Inventory for this item
                </label>
              </div>

              {newItem.track_inventory && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Stock</label>
                    <input
                      type="number"
                      value={newItem.opening_stock}
                      onChange={(e) => setNewItem({ ...newItem, opening_stock: Number(e.target.value) })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Stock Rate / Unit (₹)</label>
                    <input
                      type="number"
                      value={newItem.opening_stock_rate}
                      onChange={(e) => setNewItem({ ...newItem, opening_stock_rate: Number(e.target.value) })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Reorder Point</label>
                    <input
                      type="number"
                      value={newItem.reorder_point}
                      onChange={(e) => setNewItem({ ...newItem, reorder_point: Number(e.target.value) })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
