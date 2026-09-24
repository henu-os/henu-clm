'use client';

import * as React from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Mail, 
  Phone, 
  Building, 
  DollarSign, 
  FileText, 
  ShoppingBag,
  MapPin,
  Users,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Drawer } from '@/components/ui/drawer';
import { Modal } from '@/components/ui/modal';
import { CustomerService } from '@/features/customers/customers.service';
import { type UserProfile, type VIPTier } from '@henu/shared';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

interface ContactPerson {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  work_phone: string;
  mobile: string;
  designation: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<UserProfile[]>([]);
  const [search, setSearch] = React.useState('');
  const [vipFilter, setVipFilter] = React.useState('all');
  const [selectedCustomer, setSelectedCustomer] = React.useState<UserProfile | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // New Customer Form State
  const [activeTab, setActiveTab] = React.useState<'details' | 'address' | 'contacts' | 'remarks'>('details');
  const [customerForm, setCustomerForm] = React.useState({
    customer_type: 'Business' as 'Business' | 'Individual',
    salutation: 'Mr.',
    first_name: '',
    last_name: '',
    company_name: '',
    customer_display_name: '',
    customer_email: '',
    work_phone: '',
    mobile: '',
    gst_treatment: 'Registered Business - Regular',
    gstin: '',
    place_of_supply: 'Rajasthan',
    pan: '',
    currency: 'INR',
    opening_balance: 0,
    payment_terms: 'Net 30',
    enable_portal: true,
    portal_language: 'English',
    // Billing Address
    billing_attention: '',
    billing_country: 'India',
    billing_street1: '',
    billing_street2: '',
    billing_city: '',
    billing_state: 'Rajasthan',
    billing_zip: '',
    billing_phone: '',
    billing_fax: '',
    // Shipping Address
    shipping_attention: '',
    shipping_country: 'India',
    shipping_street1: '',
    shipping_street2: '',
    shipping_city: '',
    shipping_state: 'Rajasthan',
    shipping_zip: '',
    shipping_phone: '',
    shipping_fax: '',
    remarks: '',
  });

  const [contactPersons, setContactPersons] = React.useState<ContactPerson[]>([]);

  const loadCustomers = React.useCallback(() => {
    CustomerService.getCustomers({ search }).then(setCustomers);
  }, [search]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCopyBillingToShipping = () => {
    setCustomerForm((prev) => ({
      ...prev,
      shipping_attention: prev.billing_attention,
      shipping_country: prev.billing_country,
      shipping_street1: prev.billing_street1,
      shipping_street2: prev.billing_street2,
      shipping_city: prev.billing_city,
      shipping_state: prev.billing_state,
      shipping_zip: prev.billing_zip,
      shipping_phone: prev.billing_phone,
      shipping_fax: prev.billing_fax,
    }));
    showToast('info', 'Address Copied', 'Billing address duplicated to Shipping address.');
  };

  const handleAddContact = () => {
    setContactPersons([
      ...contactPersons,
      {
        id: `cp_${Date.now()}`,
        first_name: '',
        last_name: '',
        email: '',
        work_phone: '',
        mobile: '',
        designation: '',
      },
    ]);
  };

  const handleRemoveContact = (id: string) => {
    setContactPersons(contactPersons.filter((cp) => cp.id !== id));
  };

  const handleContactChange = (id: string, field: keyof ContactPerson, val: string) => {
    setContactPersons(
      contactPersons.map((cp) => (cp.id === id ? { ...cp, [field]: val } : cp))
    );
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = customerForm.customer_display_name || `${customerForm.first_name} ${customerForm.last_name}` || customerForm.company_name;
    if (!displayName) return;

    const newCustomer: UserProfile = {
      id: `c-${Date.now()}`,
      client_code: `HENU-CL-2026-${String(customers.length + 1).padStart(6, '0')}`,
      first_name: customerForm.first_name,
      last_name: customerForm.last_name,
      company_name: customerForm.company_name,
      email: customerForm.customer_email,
      phone: customerForm.mobile || customerForm.work_phone,
      role: 'client',
      vip_tier: 'Standard',
      is_active: true,
      total_spent: 0,
      active_quotes_count: 0,
      active_orders_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    setCreateModalOpen(false);
    showToast('success', 'Customer Enrolled', `${displayName} enrolled with Client Mobile access.`);
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Customer Lifecycle Management</h1>
          <p className="text-xs text-outline">Manage enterprise client accounts, GST treatments, dual addresses, and contact persons.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="md">
          <UserPlus className="w-4 h-4 mr-1.5" />
          <span>+ Enroll New Customer</span>
        </Button>
      </div>

      {/* Filter HUD */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, company, email, or client code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Code</TableHead>
              <TableHead>Customer / Company</TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>VIP Tier</TableHead>
              <TableHead>Total Invoiced</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs text-primary font-semibold">{c.client_code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface text-xs">{c.company_name || `${c.first_name} ${c.last_name}`}</span>
                    <span className="text-[11px] text-outline">{c.first_name} {c.last_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs text-outline">
                    <span>{c.email}</span>
                    <span>{c.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.vip_tier === 'Enterprise' ? 'secondary' : c.vip_tier === 'Platinum' ? 'primary' : 'outline'}>
                    {c.vip_tier}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-xs text-on-surface">
                  {formatCurrency(c.total_spent || 0, 'INR')}
                </TableCell>
                <TableCell>
                  <Badge variant={c.is_active ? 'success' : 'danger'}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(c)}>
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>360° View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* NEW CUSTOMER MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Enroll New Customer"
        description="Configure client profile, GST taxation, registered addresses, multiple contacts, and automated mobile credentials"
        maxWidth="5xl"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-5 text-xs text-on-surface">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-outline-variant/40 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'details'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Primary & Tax Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('address')}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'address'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Billing & Shipping Address
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'contacts'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Contact Persons ({contactPersons.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('remarks')}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'remarks'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Internal Remarks
            </button>
          </div>

          {/* TAB 1: Primary & Tax Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Customer Type */}
              <div className="flex items-center gap-4">
                <span className="font-semibold uppercase tracking-wider text-outline">Customer Type:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cust_type"
                    checked={customerForm.customer_type === 'Business'}
                    onChange={() => setCustomerForm({ ...customerForm, customer_type: 'Business' })}
                    className="text-primary"
                  />
                  <span>Business</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cust_type"
                    checked={customerForm.customer_type === 'Individual'}
                    onChange={() => setCustomerForm({ ...customerForm, customer_type: 'Individual' })}
                    className="text-primary"
                  />
                  <span>Individual</span>
                </label>
              </div>

              {/* Primary Contact & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Salutation</label>
                  <select
                    value={customerForm.salutation}
                    onChange={(e) => setCustomerForm({ ...customerForm, salutation: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">First Name</label>
                  <input
                    type="text"
                    value={customerForm.first_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Last Name</label>
                  <input
                    type="text"
                    value={customerForm.last_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Company Name</label>
                  <input
                    type="text"
                    value={customerForm.company_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, company_name: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aero Dynamics Inc"
                    value={customerForm.customer_display_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_display_name: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={customerForm.customer_email}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_email: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Mobile</label>
                  <input
                    type="text"
                    value={customerForm.mobile}
                    onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Tax & Financial Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">GST Treatment *</label>
                  <select
                    value={customerForm.gst_treatment}
                    onChange={(e) => setCustomerForm({ ...customerForm, gst_treatment: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="Registered Business - Regular">Registered Business - Regular</option>
                    <option value="Registered Business - Composition">Registered Business - Composition</option>
                    <option value="Unregistered Business">Unregistered Business</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Overseas">Overseas / Export</option>
                    <option value="SEZ">Special Economic Zone (SEZ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">GSTIN / UIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 08AAICH3195C1ZL"
                    value={customerForm.gstin}
                    onChange={(e) => setCustomerForm({ ...customerForm, gstin: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono uppercase text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Place of Supply *</label>
                  <input
                    type="text"
                    value={customerForm.place_of_supply}
                    onChange={(e) => setCustomerForm({ ...customerForm, place_of_supply: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">PAN</label>
                  <input
                    type="text"
                    placeholder="e.g. AAICH3195C"
                    value={customerForm.pan}
                    onChange={(e) => setCustomerForm({ ...customerForm, pan: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono uppercase text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Payment Terms</label>
                  <select
                    value={customerForm.payment_terms}
                    onChange={(e) => setCustomerForm({ ...customerForm, payment_terms: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    value={customerForm.opening_balance}
                    onChange={(e) => setCustomerForm({ ...customerForm, opening_balance: Number(e.target.value) })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Portal Enablement */}
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-bold text-on-surface">Automated Client Portal Account</span>
                    <p className="text-[11px] text-outline">Provision Supabase client credentials and grant access to Flutter Mobile app</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={customerForm.enable_portal}
                  onChange={(e) => setCustomerForm({ ...customerForm, enable_portal: e.target.checked })}
                  className="w-4 h-4 rounded border-outline-variant text-primary"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'address' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-end">
                <Button type="button" size="sm" variant="outline" onClick={handleCopyBillingToShipping}>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Billing Address to Shipping Address
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Billing Address */}
                <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-2.5">
                  <h4 className="font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    Billing Address
                  </h4>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Attention</label>
                    <input
                      type="text"
                      value={customerForm.billing_attention}
                      onChange={(e) => setCustomerForm({ ...customerForm, billing_attention: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Street Address Line 1</label>
                    <input
                      type="text"
                      value={customerForm.billing_street1}
                      onChange={(e) => setCustomerForm({ ...customerForm, billing_street1: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Street Address Line 2</label>
                    <input
                      type="text"
                      value={customerForm.billing_street2}
                      onChange={(e) => setCustomerForm({ ...customerForm, billing_street2: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">City</label>
                      <input
                        type="text"
                        value={customerForm.billing_city}
                        onChange={(e) => setCustomerForm({ ...customerForm, billing_city: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">State</label>
                      <input
                        type="text"
                        value={customerForm.billing_state}
                        onChange={(e) => setCustomerForm({ ...customerForm, billing_state: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">Zip / Postal Code</label>
                      <input
                        type="text"
                        value={customerForm.billing_zip}
                        onChange={(e) => setCustomerForm({ ...customerForm, billing_zip: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">Country</label>
                      <input
                        type="text"
                        value={customerForm.billing_country}
                        onChange={(e) => setCustomerForm({ ...customerForm, billing_country: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-2.5">
                  <h4 className="font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-secondary" />
                    Shipping Address
                  </h4>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Attention</label>
                    <input
                      type="text"
                      value={customerForm.shipping_attention}
                      onChange={(e) => setCustomerForm({ ...customerForm, shipping_attention: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Street Address Line 1</label>
                    <input
                      type="text"
                      value={customerForm.shipping_street1}
                      onChange={(e) => setCustomerForm({ ...customerForm, shipping_street1: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-outline mb-0.5">Street Address Line 2</label>
                    <input
                      type="text"
                      value={customerForm.shipping_street2}
                      onChange={(e) => setCustomerForm({ ...customerForm, shipping_street2: e.target.value })}
                      className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">City</label>
                      <input
                        type="text"
                        value={customerForm.shipping_city}
                        onChange={(e) => setCustomerForm({ ...customerForm, shipping_city: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">State</label>
                      <input
                        type="text"
                        value={customerForm.shipping_state}
                        onChange={(e) => setCustomerForm({ ...customerForm, shipping_state: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">Zip / Postal Code</label>
                      <input
                        type="text"
                        value={customerForm.shipping_zip}
                        onChange={(e) => setCustomerForm({ ...customerForm, shipping_zip: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-outline mb-0.5">Country</label>
                      <input
                        type="text"
                        value={customerForm.shipping_country}
                        onChange={(e) => setCustomerForm({ ...customerForm, shipping_country: e.target.value })}
                        className="w-full p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Contact Persons */}
          {activeTab === 'contacts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <p className="text-xs text-outline">Add executive contact persons, billing admins, and technical leads.</p>
                <Button type="button" size="sm" variant="outline" onClick={handleAddContact}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Contact Person
                </Button>
              </div>

              {contactPersons.length === 0 ? (
                <div className="p-8 text-center text-outline bg-surface-container-low rounded-lg border border-outline-variant/40">
                  No additional contact persons configured.
                </div>
              ) : (
                <div className="space-y-3">
                  {contactPersons.map((cp, idx) => (
                    <div key={cp.id} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={cp.first_name}
                        onChange={(e) => handleContactChange(cp.id, 'first_name', e.target.value)}
                        className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={cp.last_name}
                        onChange={(e) => handleContactChange(cp.id, 'last_name', e.target.value)}
                        className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={cp.email}
                        onChange={(e) => handleContactChange(cp.id, 'email', e.target.value)}
                        className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Mobile"
                        value={cp.mobile}
                        onChange={(e) => handleContactChange(cp.id, 'mobile', e.target.value)}
                        className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Designation"
                        value={cp.designation}
                        onChange={(e) => handleContactChange(cp.id, 'designation', e.target.value)}
                        className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs"
                      />
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(cp.id)}
                          className="text-error/70 hover:text-error transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Remarks */}
          {activeTab === 'remarks' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="block font-semibold uppercase tracking-wider text-outline">Internal Operational Remarks</label>
              <textarea
                rows={6}
                placeholder="Internal notes, discount agreements, special SLA terms..."
                value={customerForm.remarks}
                onChange={(e) => setCustomerForm({ ...customerForm, remarks: e.target.value })}
                className="w-full p-2.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer 360 Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.company_name || `${selectedCustomer?.first_name} ${selectedCustomer?.last_name}` || ''}
        description={selectedCustomer?.client_code}
        width="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-outline uppercase font-semibold">Total Revenue Contributed</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedCustomer.total_spent || 0, 'INR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-outline uppercase font-semibold">Client Status</p>
                  <Badge variant={selectedCustomer.is_active ? 'success' : 'danger'}>
                    {selectedCustomer.is_active ? 'Active Customer' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Customer Overview</h4>
              <div className="p-3 bg-surface-container-lowest rounded border border-outline-variant/40 space-y-2 text-xs">
                <div><span className="text-outline">Email:</span> {selectedCustomer.email}</div>
                <div><span className="text-outline">Phone:</span> {selectedCustomer.phone}</div>
                <div><span className="text-outline">VIP Tier:</span> {selectedCustomer.vip_tier}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
