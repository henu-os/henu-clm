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
  BarChart2
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
      cost_price: 65.00,
      purchase_account: 'Cost of Goods Sold',
      preferred_vendor: 'Yubico Distributor',
      intra_state_tax_rate: 18.00,
      inter_state_tax_rate: 18.00,
      track_inventory: true,
      opening_stock: 100,
      current_stock: 84,
      status: 'ACTIVE',
    },
  ]);

  const [typeFilter, setTypeFilter] = React.useState<'ALL' | 'GOODS' | 'SERVICE'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // New item form state
  const [newItem, setNewItem] = React.useState<Partial<ItemRecord>>({
    item_type: 'SERVICE',
    name: '',
    sku: '',
    unit: 'hrs',
    hsn_sac_code: '9983',
    tax_preference: 'TAXABLE',
    selling_price: 1000,
    sales_account: 'Sales',
    cost_price: 500,
    purchase_account: 'Cost of Goods Sold',
    intra_state_tax_rate: 18,
    inter_state_tax_rate: 18,
    track_inventory: false,
    opening_stock: 0,
  });

  const filteredItems = items.filter((item) => {
    if (typeFilter !== 'ALL' && item.item_type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.hsn_sac_code.includes(q)
      );
    }
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) {
      showToast('error', 'Validation Error', 'Item Name and SKU are required.');
      return;
    }

    const created: ItemRecord = {
      id: `itm_${Date.now()}`,
      item_type: newItem.item_type || 'SERVICE',
      name: newItem.name,
      sku: newItem.sku,
      unit: newItem.unit || 'unit',
      hsn_sac_code: newItem.hsn_sac_code || '9983',
      tax_preference: newItem.tax_preference || 'TAXABLE',
      exemption_reason: newItem.exemption_reason,
      selling_price: Number(newItem.selling_price) || 0,
      sales_account: newItem.sales_account || 'Sales',
      sales_description: newItem.sales_description,
      cost_price: Number(newItem.cost_price) || 0,
      purchase_account: newItem.purchase_account || 'Cost of Goods Sold',
      preferred_vendor: newItem.preferred_vendor,
      intra_state_tax_rate: Number(newItem.intra_state_tax_rate) || 18,
      inter_state_tax_rate: Number(newItem.inter_state_tax_rate) || 18,
      track_inventory: Boolean(newItem.track_inventory),
      opening_stock: Number(newItem.opening_stock) || 0,
      current_stock: Number(newItem.opening_stock) || 0,
      status: 'ACTIVE',
    };

    setItems([created, ...items]);
    setCreateModalOpen(false);
    showToast('success', 'Item Created', `${created.name} (${created.sku}) is now active.`);
    setNewItem({
      item_type: 'SERVICE',
      name: '',
      sku: '',
      unit: 'hrs',
      hsn_sac_code: '9983',
      tax_preference: 'TAXABLE',
      selling_price: 1000,
      sales_account: 'Sales',
      cost_price: 500,
      purchase_account: 'Cost of Goods Sold',
      intra_state_tax_rate: 18,
      inter_state_tax_rate: 18,
      track_inventory: false,
      opening_stock: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Items & Services Catalog</h1>
          <p className="text-xs text-gray-400">
            Manage goods, professional services, pricing, HSN/SAC codes, and tax preferences
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Item / Service</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#181B24] p-4 rounded-xl border border-gray-800">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU, or HSN/SAC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#887DB8]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['ALL', 'SERVICE', 'GOODS'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                typeFilter === type
                  ? 'bg-[#887DB8] text-white'
                  : 'bg-[#20202B] text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {type === 'ALL' ? 'All Items' : type === 'SERVICE' ? 'Services' : 'Goods'}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-[#181B24] rounded-xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/40 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">SKU / HSN</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Tax %</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#20202B]/50 transition">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.sales_description || 'Standard catalog item'}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-[#20202B] border border-gray-700 text-gray-300">
                      {item.item_type === 'SERVICE' ? (
                        <Wrench className="w-3 h-3 text-[#887DB8]" />
                      ) : (
                        <Package className="w-3 h-3 text-[#D9A441]" />
                      )}
                      {item.item_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-gray-300">
                    <p className="font-semibold text-white">{item.sku}</p>
                    <p className="text-gray-400">HSN: {item.hsn_sac_code}</p>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">
                    ${item.selling_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-mono">
                    ${item.cost_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {item.tax_preference === 'TAXABLE' ? `${item.intra_state_tax_rate}%` : item.tax_preference}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
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

      {/* New Item Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#20202B]/40 sticky top-0 z-10 backdrop-blur">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Package className="w-5 h-5 text-[#887DB8]" />
                <span>Create New Item / Service</span>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-5 text-sm">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Item Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, item_type: 'SERVICE' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                      newItem.item_type === 'SERVICE'
                        ? 'border-[#887DB8] bg-[#887DB8]/15 text-white'
                        : 'border-gray-700 bg-[#20202B] text-gray-400'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-[#887DB8]" />
                    Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, item_type: 'GOODS' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                      newItem.item_type === 'GOODS'
                        ? 'border-[#D9A441] bg-[#D9A441]/15 text-white'
                        : 'border-gray-700 bg-[#20202B] text-gray-400'
                    }`}
                  >
                    <Package className="w-4 h-4 text-[#D9A441]" />
                    Goods
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise Architecture Design"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SRV-ENG-001"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. hrs, pcs, project"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 998313"
                    value={newItem.hsn_sac_code}
                    onChange={(e) => setNewItem({ ...newItem, hsn_sac_code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tax Preference</label>
                  <select
                    value={newItem.tax_preference}
                    onChange={(e) => setNewItem({ ...newItem, tax_preference: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="TAXABLE">Taxable</option>
                    <option value="NON_TAXABLE">Non-Taxable</option>
                    <option value="OUT_OF_SCOPE">Out of Scope</option>
                    <option value="NON_GST">Non-GST</option>
                  </select>
                </div>
              </div>

              {/* Sales & Purchase Pricing */}
              <div className="p-4 bg-[#20202B]/60 rounded-xl border border-gray-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Commercial & Accounts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Selling Price ($ USD) *</label>
                    <input
                      type="number"
                      required
                      value={newItem.selling_price}
                      onChange={(e) => setNewItem({ ...newItem, selling_price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#181B24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Cost Price ($ USD)</label>
                    <input
                      type="number"
                      value={newItem.cost_price}
                      onChange={(e) => setNewItem({ ...newItem, cost_price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#181B24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Sales Description</label>
                  <textarea
                    rows={2}
                    placeholder="Description rendered on Quotes and Invoices..."
                    value={newItem.sales_description}
                    onChange={(e) => setNewItem({ ...newItem, sales_description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181B24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              {/* Inventory toggle for Goods */}
              {newItem.item_type === 'GOODS' && (
                <div className="p-4 bg-[#20202B]/60 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="track_inv"
                      checked={newItem.track_inventory}
                      onChange={(e) => setNewItem({ ...newItem, track_inventory: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-[#181B24] text-[#887DB8]"
                    />
                    <label htmlFor="track_inv" className="text-xs font-medium text-white">
                      Track Inventory for this item
                    </label>
                  </div>
                  {newItem.track_inventory && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Opening Stock Quantity</label>
                        <input
                          type="number"
                          value={newItem.opening_stock}
                          onChange={(e) => setNewItem({ ...newItem, opening_stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#181B24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Reorder Point</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          className="w-full px-3 py-2 bg-[#181B24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
