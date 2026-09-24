'use client';

import * as React from 'react';
import { Layers, Plus, Edit2, Tag, Clock, DollarSign, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { CatalogService } from '@/features/catalog/catalog.service';
import { type ServiceItem, type ServiceAddon } from '@henu/shared';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function CatalogPage() {
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [expandedService, setExpandedService] = React.useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { showToast } = useToast();

  // Form states
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [category, setCategory] = React.useState('Engineering');
  const [basePrice, setBasePrice] = React.useState('2499');
  const [turnaround, setTurnaround] = React.useState('2-3 weeks');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    CatalogService.getServices().then(setServices);
  }, []);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: ServiceItem = {
      id: `s-${Date.now()}`,
      slug,
      title,
      tagline: 'Custom engineered solution',
      description,
      category,
      icon_name: 'hub',
      base_price: parseFloat(basePrice) || 0,
      currency: 'USD',
      turnaround_time: turnaround,
      is_featured: true,
      display_order: services.length + 1,
      status: 'published',
      addons: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setServices([...services, newService]);
    setCreateModalOpen(false);
    showToast('success', 'Service Created', `${title} is now published live to mobile catalog.`);
    setTitle('');
    setSlug('');
    setDescription('');
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Service & Add-on Catalog</h1>
          <p className="text-xs text-outline">Configure tiered commercial packages and add-on pricing consumed by mobile clients.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>+ New Service Tier</span>
        </Button>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {services.map((service) => {
          const isExpanded = expandedService === service.id;
          return (
            <Card key={service.id} className="overflow-hidden">
              <div className="p-space-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-on-surface">{service.title}</h3>
                      <Badge variant="primary">{service.category}</Badge>
                      {service.is_featured && <Badge variant="warning">Featured</Badge>}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl">{service.description}</p>
                    <div className="flex items-center gap-4 text-xs text-outline mt-2">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="w-3.5 h-3.5" />
                        Base: {formatCurrency(service.base_price, service.currency)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Turnaround: {service.turnaround_time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                  >
                    <span>{service.addons?.length || 0} Add-ons</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                </div>
              </div>

              {/* Add-ons Accordion Panel */}
              {isExpanded && service.addons && service.addons.length > 0 && (
                <div className="p-space-md bg-surface-container-low border-t border-outline-variant/40 space-y-2">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Configured Add-on Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.addons.map((addon) => (
                      <div key={addon.id} className="p-2.5 bg-surface-container-lowest rounded border border-outline-variant/40 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-on-surface">{addon.title}</p>
                          <p className="text-[11px] text-outline">{addon.description}</p>
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0 ml-2">
                          +{formatCurrency(addon.price, addon.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* New Service Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Service Offering">
        <form onSubmit={handleCreateService} className="space-y-3">
          <Input label="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Enterprise Cloud Migration" required />
          <Input label="URL Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. enterprise-cloud-migration" required />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Engineering">Engineering</option>
                <option value="Creative Design">Creative Design</option>
                <option value="Security & DevOps">Security & DevOps</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <Input label="Base Price ($)" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
          </div>

          <Input label="Turnaround Time" value={turnaround} onChange={(e) => setTurnaround(e.target.value)} placeholder="e.g. 2-3 weeks" required />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
              placeholder="Detailed description of scope and deliverables..."
              required
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
