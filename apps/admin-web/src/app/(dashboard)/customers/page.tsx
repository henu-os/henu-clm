'use client';

import * as React from 'react';
import { UserPlus, Search, Filter, Eye, Edit2, Mail, Phone, Building, DollarSign, FileText, ShoppingBag } from 'lucide-react';
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

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<UserProfile[]>([]);
  const [search, setSearch] = React.useState('');
  const [vipFilter, setVipFilter] = React.useState('all');
  const [selectedCustomer, setSelectedCustomer] = React.useState<UserProfile | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // Form states for creating customer
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [vipTier, setVipTier] = React.useState<VIPTier>('Standard');

  const loadCustomers = React.useCallback(() => {
    CustomerService.getCustomers({ search, vipTier }).then(setCustomers);
  }, [search, vipFilter]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: UserProfile = {
      id: `c-${Date.now()}`,
      client_code: `HENU-CL-2026-${String(customers.length + 1).padStart(6, '0')}`,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      email,
      phone,
      role: 'client',
      vip_tier: vipTier,
      is_active: true,
      total_spent: 0,
      active_quotes_count: 0,
      active_orders_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    setCreateModalOpen(false);
    showToast('success', 'Customer Created', `${firstName} ${lastName} has been enrolled.`);
    // Reset form
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Customer Lifecycle Management</h1>
          <p className="text-xs text-outline">Manage enterprise client accounts, tiers, and commercial histories.</p>
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All VIP Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Code</TableHead>
              <TableHead>Customer / Company</TableHead>
              <TableHead>VIP Tier</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Active Pipelines</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-outline">
                  No customers found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-primary font-semibold">{c.client_code}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface text-xs">
                        {c.first_name} {c.last_name}
                      </span>
                      <span className="text-[11px] text-outline">{c.company_name || c.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.vip_tier === 'Enterprise' ? 'warning' : c.vip_tier === 'Platinum' ? 'primary' : 'neutral'}>
                      {c.vip_tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-on-surface">{formatCurrency(c.total_spent, 'INR')}</TableCell>
                  <TableCell className="text-xs text-on-surface-variant">
                    {c.active_quotes_count} Quotes · {c.active_orders_count} Orders
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.is_active ? 'success' : 'danger'}>{c.is_active ? 'Active' : 'Suspended'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(c)}>
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>View 360</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Customer 360 Flyout Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : ''}
        description={selectedCustomer?.client_code}
        width="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Quick Metrics Header */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low rounded border border-outline-variant/40 text-center">
              <div>
                <p className="text-[10px] text-outline uppercase font-semibold">Total Spend</p>
                <p className="text-sm font-bold text-on-surface">{formatCurrency(selectedCustomer.total_spent, 'INR')}</p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-semibold">Active Quotes</p>
                <p className="text-sm font-bold text-primary">{selectedCustomer.active_quotes_count}</p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-semibold">Orders In Progress</p>
                <p className="text-sm font-bold text-secondary">{selectedCustomer.active_orders_count}</p>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Account Metadata</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Building className="w-3.5 h-3.5 text-outline" />
                  <span>Company: {selectedCustomer.company_name || 'Individual Client'}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Mail className="w-3.5 h-3.5 text-outline" />
                  <span>Email: {selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Phone className="w-3.5 h-3.5 text-outline" />
                  <span>Phone: {selectedCustomer.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <DollarSign className="w-3.5 h-3.5 text-outline" />
                  <span>VIP Tier: {selectedCustomer.vip_tier}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-outline-variant/40 flex gap-2">
              <Button size="sm" variant="primary" className="flex-1" onClick={() => showToast('info', 'Opening Quote Wizard', 'Creating quote for client.')}>
                <FileText className="w-3.5 h-3.5 mr-1" />
                <span>+ Create Quote</span>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => showToast('info', 'Opening Support Desk', 'Starting conversation thread.')}>
                <span>Message Client</span>
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Customer Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Enroll New Enterprise Customer">
        <form onSubmit={handleCreateCustomer} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>

          <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">VIP Tier</label>
            <select
              value={vipTier}
              onChange={(e) => setVipTier(e.target.value as VIPTier)}
              className="w-full h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="Standard">Standard</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Enroll Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
