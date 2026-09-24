'use client';

import * as React from 'react';
import {
  Smartphone,
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/feedback/toast';
import {
  type MobileHomeConfiguration,
  type QuickActionTile,
  type BottomNavItem,
} from '@henu/shared';

const DEFAULT_CONFIG: MobileHomeConfiguration = {
  id: 'default_config_01',
  name: 'Global Default Client Mobile Home',
  is_active: true,
  greeting_config: {
    enabled: true,
    priority: 1,
    title: 'Good Morning',
    sub_title: 'Simple systems. Real progress.',
    show_client_name: true,
    show_avatar: true,
    custom_text: '',
    alignment: 'left',
  },
  hero_banner_config: {
    enabled: true,
    priority: 2,
    heading: 'Your business, managed smarter.',
    description: 'Manage your services, projects and payments from one unified platform.',
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
    badge_text: 'Priority Milestone',
    cta_text: 'Review Deliverables',
    cta_route: '/orders',
    secondary_cta_text: 'View Catalog',
    secondary_cta_route: '/catalog',
    start_date: '2026-01-01',
    expiry_date: '2026-12-31',
    is_active: true,
  },
  primary_cta_config: {
    enabled: true,
    priority: 3,
    label: 'Create Your Quote Now',
    icon: 'request_quote_outlined',
    destination: '/quotes',
    is_external: false,
    button_style: 'primary',
  },
  quick_actions_config: {
    enabled: true,
    priority: 4,
    title: 'Operational Portals',
    actions: [
      { id: 'qa_1', title: 'Quotes', icon: 'quotes', route: '/quotes', is_enabled: true, badge_text: 'New' },
      { id: 'qa_2', title: 'Invoices', icon: 'invoices', route: '/invoices', is_enabled: true },
      { id: 'qa_3', title: 'Payments', icon: 'payments', route: '/payments', is_enabled: true },
      { id: 'qa_4', title: 'Orders', icon: 'orders', route: '/orders', is_enabled: true },
      { id: 'qa_5', title: 'Projects', icon: 'projects', route: '/delivery', is_enabled: true },
      { id: 'qa_6', title: 'Support', icon: 'support', route: '/support', is_enabled: true },
      { id: 'qa_7', title: 'Services', icon: 'services', route: '/catalog', is_enabled: true },
      { id: 'qa_8', title: 'Profile', icon: 'profile', route: '/profile', is_enabled: true },
    ],
  },
  offer_section_config: {
    enabled: true,
    priority: 5,
    title: 'Special Enterprise Offer',
    description: 'Get your digital transformation started today with 15% discount on Q3 advisory packages.',
    badge: '15% DISCOUNT',
    image_url: '',
    cta_text: 'Claim Offer',
    cta_route: '/quotes',
    start_date: '2026-01-01',
    expiry_date: '2026-10-31',
    show_expired: false,
    background_color: '#181A20',
    is_active: true,
  },
  recent_activity_config: {
    enabled: true,
    priority: 6,
    title: 'Audit & Activity Log',
    limit: 4,
    display_type: 'timeline',
    is_active: true,
  },
  upcoming_config: {
    enabled: true,
    priority: 7,
    title: 'Action Schedule',
    limit: 3,
    is_active: true,
  },
  bottom_nav_config: {
    items: [
      { id: 'nav_1', label: 'Home', icon: 'home', route: '/home', is_enabled: true },
      { id: 'nav_2', label: 'Portfolio', icon: 'orders', route: '/orders', is_enabled: true },
      { id: 'nav_3', label: 'Services', icon: 'services', route: '/catalog', is_enabled: true },
      { id: 'nav_4', label: 'Finance', icon: 'invoices', route: '/invoices', is_enabled: true },
      { id: 'nav_5', label: 'Hub', icon: 'profile', route: '/profile', is_enabled: true },
    ],
  },
};

export default function CmsPage() {
  const { showToast } = useToast();
  const [config, setConfig] = React.useState<MobileHomeConfiguration>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = React.useState<string>('greeting');
  const [isNewActionModalOpen, setIsNewActionModalOpen] = React.useState(false);
  const [newActionTitle, setNewActionTitle] = React.useState('');
  const [newActionRoute, setNewActionRoute] = React.useState('');
  const [newActionIcon, setNewActionIcon] = React.useState('quotes');
  const [newActionBadge, setNewActionBadge] = React.useState('');

  const handleSave = () => {
    showToast('success', 'Configuration Published', 'Mobile Home Screen settings updated live across all client devices.');
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    showToast('info', 'Defaults Restored', 'Restored default mobile home configuration.');
  };

  const addQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle || !newActionRoute) return;

    const newTile: QuickActionTile = {
      id: `qa_${Date.now()}`,
      title: newActionTitle,
      route: newActionRoute,
      icon: newActionIcon,
      is_enabled: true,
      badge_text: newActionBadge || undefined,
    };

    setConfig((prev) => ({
      ...prev,
      quick_actions_config: {
        ...prev.quick_actions_config,
        actions: [...prev.quick_actions_config.actions, newTile],
      },
    }));

    setIsNewActionModalOpen(false);
    setNewActionTitle('');
    setNewActionRoute('');
    setNewActionBadge('');
    showToast('success', 'Tile Added', `Added quick action "${newActionTitle}"`);
  };

  const removeQuickAction = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      quick_actions_config: {
        ...prev.quick_actions_config,
        actions: prev.quick_actions_config.actions.filter((a) => a.id !== id),
      },
    }));
    showToast('info', 'Tile Removed', 'Quick action removed.');
  };

  const toggleQuickAction = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      quick_actions_config: {
        ...prev.quick_actions_config,
        actions: prev.quick_actions_config.actions.map((a) =>
          a.id === id ? { ...a, is_enabled: !a.is_enabled } : a
        ),
      },
    }));
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Client Mobile Home CMS Builder</h1>
            <Badge variant="primary">Realtime Synchronized</Badge>
          </div>
          <p className="text-xs text-outline mt-1">
            Configure greeting, hero banners, primary CTAs, quick actions, promotional offers, activities, and bottom navigation live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Defaults</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Save & Publish Live</span>
          </Button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: CMS Section Editors */}
        <div className="lg:col-span-7 space-y-4">
          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
            {[
              { id: 'greeting', label: '1. Greeting' },
              { id: 'hero', label: '2. Hero Banner' },
              { id: 'cta', label: '3. Primary CTA' },
              { id: 'quick_actions', label: '4. Quick Actions' },
              { id: 'offers', label: '5. Offers' },
              { id: 'activity', label: '6. Recent Activity' },
              { id: 'upcoming', label: '7. Upcoming' },
              { id: 'nav', label: '8. Bottom Nav' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. GREETING EDITOR */}
          {activeTab === 'greeting' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Greeting Header Configuration</CardTitle>
                  <p className="text-xs text-outline">Dynamic time-based greeting & personalized client identity.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-on-surface">Section Active</label>
                  <input
                    type="checkbox"
                    checked={config.greeting_config.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        greeting_config: { ...config.greeting_config, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Default Greeting Prefix</label>
                    <Input
                      value={config.greeting_config.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, title: e.target.value },
                        })
                      }
                      placeholder="e.g. Good Morning"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Subtitle Tagline</label>
                    <Input
                      value={config.greeting_config.sub_title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, sub_title: e.target.value },
                        })
                      }
                      placeholder="e.g. Simple systems. Real progress."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Custom Greeting Override (Optional)</label>
                    <Input
                      value={config.greeting_config.custom_text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, custom_text: e.target.value },
                        })
                      }
                      placeholder="Leave empty for dynamic time-of-day"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Display Priority Order</label>
                    <Input
                      type="number"
                      value={config.greeting_config.priority}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, priority: parseInt(e.target.value) || 1 },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.greeting_config.show_client_name}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, show_client_name: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-primary"
                    />
                    <span>Append Client First Name</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.greeting_config.show_avatar}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          greeting_config: { ...config.greeting_config, show_avatar: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-primary"
                    />
                    <span>Show Client Profile Badge</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. HERO BANNER EDITOR */}
          {activeTab === 'hero' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hero Banner & Media Card</CardTitle>
                  <p className="text-xs text-outline">Top high-impact editorial milestone card with CTAs.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-on-surface">Enable Banner</label>
                  <input
                    type="checkbox"
                    checked={config.hero_banner_config.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero_banner_config: { ...config.hero_banner_config, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Badge Pill Text</label>
                    <Input
                      value={config.hero_banner_config.badge_text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          hero_banner_config: { ...config.hero_banner_config, badge_text: e.target.value },
                        })
                      }
                      placeholder="e.g. Priority Milestone"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Banner Priority Order</label>
                    <Input
                      type="number"
                      value={config.hero_banner_config.priority}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          hero_banner_config: { ...config.hero_banner_config, priority: parseInt(e.target.value) || 2 },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface">Main Heading</label>
                  <Input
                    value={config.hero_banner_config.heading}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero_banner_config: { ...config.hero_banner_config, heading: e.target.value },
                      })
                    }
                    placeholder="e.g. Your business, managed smarter."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface">Description Text</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:outline-none"
                    value={config.hero_banner_config.description}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero_banner_config: { ...config.hero_banner_config, description: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Primary CTA Label</label>
                    <Input
                      value={config.hero_banner_config.cta_text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          hero_banner_config: { ...config.hero_banner_config, cta_text: e.target.value },
                        })
                      }
                      placeholder="e.g. Review Deliverables"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Primary CTA Route</label>
                    <Input
                      value={config.hero_banner_config.cta_route}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          hero_banner_config: { ...config.hero_banner_config, cta_route: e.target.value },
                        })
                      }
                      placeholder="/orders"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. PRIMARY CTA */}
          {activeTab === 'cta' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Standout Primary Action Button</CardTitle>
                  <p className="text-xs text-outline">Full-width high-conversion action button.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-on-surface">Active</label>
                  <input
                    type="checkbox"
                    checked={config.primary_cta_config.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        primary_cta_config: { ...config.primary_cta_config, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Button Label</label>
                    <Input
                      value={config.primary_cta_config.label}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          primary_cta_config: { ...config.primary_cta_config, label: e.target.value },
                        })
                      }
                      placeholder="Create Your Quote Now"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Target Destination Route</label>
                    <Input
                      value={config.primary_cta_config.destination}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          primary_cta_config: { ...config.primary_cta_config, destination: e.target.value },
                        })
                      }
                      placeholder="/quotes"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Button Style</label>
                    <select
                      className="w-full px-3 py-2 text-xs rounded border border-outline-variant/50 bg-surface-container-lowest focus:border-primary"
                      value={config.primary_cta_config.button_style}
                      onChange={(e: any) =>
                        setConfig({
                          ...config,
                          primary_cta_config: { ...config.primary_cta_config, button_style: e.target.value },
                        })
                      }
                    >
                      <option value="primary">Solid Primary (Dark)</option>
                      <option value="secondary">Teal Accent (Secondary)</option>
                      <option value="outline">Outlined Porcelain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Priority Order</label>
                    <Input
                      type="number"
                      value={config.primary_cta_config.priority}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          primary_cta_config: { ...config.primary_cta_config, priority: parseInt(e.target.value) || 3 },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. QUICK ACTIONS HUB */}
          {activeTab === 'quick_actions' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Quick Actions Grid (Hubs)</CardTitle>
                  <p className="text-xs text-outline">Manage 4-column dynamic grid tiles visible on client mobile.</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsNewActionModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>+ Add Action Tile</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-on-surface">Section Header Title</label>
                    <Input
                      value={config.quick_actions_config.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          quick_actions_config: { ...config.quick_actions_config, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-medium text-on-surface">Priority</label>
                    <Input
                      type="number"
                      value={config.quick_actions_config.priority}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          quick_actions_config: { ...config.quick_actions_config, priority: parseInt(e.target.value) || 4 },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {config.quick_actions_config.actions.map((action) => (
                    <div
                      key={action.id}
                      className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface text-xs font-bold">
                          {action.title.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-on-surface">{action.title}</span>
                            {action.badge_text && <Badge variant="warning">{action.badge_text}</Badge>}
                          </div>
                          <span className="text-[11px] text-outline">{action.route}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleQuickAction(action.id)}
                          className={`p-1.5 rounded text-xs ${
                            action.is_enabled ? 'text-primary bg-primary/10' : 'text-outline hover:bg-surface-container'
                          }`}
                        >
                          {action.is_enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => removeQuickAction(action.id)}
                          className="p-1.5 rounded text-xs text-error hover:bg-error/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. OFFERS & PROMOTIONS */}
          {activeTab === 'offers' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Offer & Promotional Section</CardTitle>
                  <p className="text-xs text-outline">Configurable client promotional card with automatic expiry.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-on-surface">Enable Section</label>
                  <input
                    type="checkbox"
                    checked={config.offer_section_config.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        offer_section_config: { ...config.offer_section_config, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">Offer Title</label>
                    <Input
                      value={config.offer_section_config.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          offer_section_config: { ...config.offer_section_config, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Badge Pill Text</label>
                    <Input
                      value={config.offer_section_config.badge}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          offer_section_config: { ...config.offer_section_config, badge: e.target.value },
                        })
                      }
                      placeholder="e.g. 15% DISCOUNT"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-on-surface">Offer Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:outline-none"
                    value={config.offer_section_config.description}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        offer_section_config: { ...config.offer_section_config, description: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-on-surface">CTA Button Label</label>
                    <Input
                      value={config.offer_section_config.cta_text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          offer_section_config: { ...config.offer_section_config, cta_text: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">CTA Target Route</label>
                    <Input
                      value={config.offer_section_config.cta_route}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          offer_section_config: { ...config.offer_section_config, cta_route: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface">Expiry Date</label>
                    <Input
                      type="date"
                      value={config.offer_section_config.expiry_date}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          offer_section_config: { ...config.offer_section_config, expiry_date: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="show_expired"
                    checked={config.offer_section_config.show_expired}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        offer_section_config: { ...config.offer_section_config, show_expired: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary"
                  />
                  <label htmlFor="show_expired" className="text-xs text-on-surface cursor-pointer">
                    Show expired offers to clients (Defaults to auto-hiding after expiry date)
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. RECENT ACTIVITY & UPCOMING */}
          {(activeTab === 'activity' || activeTab === 'upcoming') && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'activity' ? 'Recent Activity Stream Settings' : 'Upcoming Action Schedule Settings'}
                </CardTitle>
                <p className="text-xs text-outline">Control data-driven feeds rendered from live CLM records.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTab === 'activity' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-on-surface">Section Header</label>
                        <Input
                          value={config.recent_activity_config.title}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              recent_activity_config: { ...config.recent_activity_config, title: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-on-surface">Max Records Limit (1–10)</label>
                        <Input
                          type="number"
                          value={config.recent_activity_config.limit}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              recent_activity_config: { ...config.recent_activity_config, limit: parseInt(e.target.value) || 4 },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-on-surface">Section Header</label>
                        <Input
                          value={config.upcoming_config.title}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              upcoming_config: { ...config.upcoming_config, title: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-on-surface">Max Records Limit</label>
                        <Input
                          type="number"
                          value={config.upcoming_config.limit}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              upcoming_config: { ...config.upcoming_config, limit: parseInt(e.target.value) || 3 },
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* 8. BOTTOM NAVIGATION */}
          {activeTab === 'nav' && (
            <Card>
              <CardHeader>
                <CardTitle>Bottom Navigation Builder</CardTitle>
                <p className="text-xs text-outline">Configure tabs on the fixed mobile navigation bar.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.bottom_nav_config.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-on-surface">{item.label}</span>
                        <p className="text-[11px] text-outline">Route: {item.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_enabled}
                        onChange={(e) => {
                          const updated = [...config.bottom_nav_config.items];
                          updated[idx] = { ...updated[idx], is_enabled: e.target.checked };
                          setConfig({
                            ...config,
                            bottom_nav_config: { items: updated },
                          });
                        }}
                        className="w-4 h-4 rounded text-primary"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side: Live Interactive Mobile Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] bg-[#181A20] rounded-[36px] p-3.5 shadow-2xl border-4 border-[#2A2D36]">
            {/* Phone Screen Frame */}
            <div className="bg-[#F8F9FC] rounded-[26px] h-[640px] overflow-y-auto flex flex-col justify-between text-[#1A1C20] relative scrollbar-none">
              {/* Dynamic Mobile Top Bar */}
              <div className="sticky top-0 bg-[#F8F9FC]/95 backdrop-blur-md px-4 pt-3 pb-2 z-20 border-b border-gray-200/50">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-1">
                  <span>9:41</span>
                  <span>5G · 100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-gray-900 tracking-tight">HENU OS</h3>
                    <p className="text-[9px] text-gray-400">Client Lifecycle Management</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                    S
                  </div>
                </div>
              </div>

              {/* Dynamic Scrollable Screen Body */}
              <div className="p-3 space-y-3 flex-1">
                {/* 1. Greeting Section */}
                {config.greeting_config.enabled && (
                  <div className="space-y-1">
                    <h2 className="text-sm font-black text-gray-900 leading-tight">
                      {config.greeting_config.custom_text || config.greeting_config.title}
                      {config.greeting_config.show_client_name && ', Siddharth'}
                    </h2>
                    {config.greeting_config.sub_title && (
                      <p className="text-[10px] text-gray-500">{config.greeting_config.sub_title}</p>
                    )}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[9px] font-semibold text-gray-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>HENU-CL-2026-0001</span>
                    </div>
                  </div>
                )}

                {/* 2. Hero Banner */}
                {config.hero_banner_config.enabled && (
                  <div className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-bold">
                        {config.hero_banner_config.badge_text}
                      </span>
                      <span className="text-[9px] text-gray-400">Milestone</span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {config.hero_banner_config.heading}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2">
                      {config.hero_banner_config.description}
                    </p>
                    <button className="w-full py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-semibold flex items-center justify-center gap-1">
                      <span>{config.hero_banner_config.cta_text}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 3. Primary CTA */}
                {config.primary_cta_config.enabled && (
                  <button className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{config.primary_cta_config.label}</span>
                  </button>
                )}

                {/* 4. Quick Actions Grid */}
                {config.quick_actions_config.enabled && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>{config.quick_actions_config.title.toUpperCase()}</span>
                      <span>{config.quick_actions_config.actions.filter((a) => a.is_enabled).length} HUBS</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {config.quick_actions_config.actions
                        .filter((a) => a.is_enabled)
                        .map((act) => (
                          <div
                            key={act.id}
                            className="bg-white p-1.5 rounded-lg border border-gray-200/60 flex flex-col items-center text-center shadow-2xs"
                          >
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 text-[10px] font-bold mb-1">
                              {act.title.charAt(0)}
                            </div>
                            <span className="text-[9px] font-medium text-gray-800 truncate w-full">
                              {act.title}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 5. Offers Section */}
                {config.offer_section_config.enabled && (
                  <div className="bg-white rounded-xl p-3 border-l-4 border-amber-500 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[8px] font-bold">
                        {config.offer_section_config.badge}
                      </span>
                      <span className="text-[8px] font-bold text-amber-700">Limited Time</span>
                    </div>
                    <h5 className="text-[11px] font-bold text-gray-900">{config.offer_section_config.title}</h5>
                    <p className="text-[9px] text-gray-500 line-clamp-2">{config.offer_section_config.description}</p>
                    <button className="px-2.5 py-1 rounded bg-amber-500 text-white text-[9px] font-bold">
                      {config.offer_section_config.cta_text}
                    </button>
                  </div>
                )}

                {/* 6. Recent Activity */}
                {config.recent_activity_config.enabled && (
                  <div className="bg-white rounded-xl p-2.5 border border-gray-200/60 shadow-2xs space-y-2">
                    <div className="flex justify-between text-[9px] font-bold text-gray-400">
                      <span>{config.recent_activity_config.title.toUpperCase()}</span>
                      <span>STREAM</span>
                    </div>
                    <div className="space-y-1.5 text-[9px]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-semibold text-gray-800">Invoice #INV-089 Generated</p>
                          <p className="text-gray-400 text-[8px]">Due in 6 days</p>
                        </div>
                        <span className="text-gray-400 text-[8px]">2h ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Bottom Navigation Mock */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center text-[8px] font-medium text-gray-500 z-20 shadow-sm">
                {config.bottom_nav_config.items
                  .filter((item) => item.is_enabled)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center gap-0.5 ${idx === 0 ? 'text-gray-900 font-bold' : ''}`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${idx === 0 ? 'bg-gray-900' : 'bg-gray-300'}`}
                      ></div>
                      <span>{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Quick Action Modal */}
      <Modal
        isOpen={isNewActionModalOpen}
        onClose={() => setIsNewActionModalOpen(false)}
        title="Add Quick Action Tile"
        description="Create a new one-touch navigation hub tile for client mobile devices."
        maxWidth="md"
      >
        <form onSubmit={addQuickAction} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-on-surface">Tile Label *</label>
            <Input
              required
              placeholder="e.g. Documents, Appointments"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface">Target Route / URL *</label>
            <Input
              required
              placeholder="e.g. /quotes, /support, /custom"
              value={newActionRoute}
              onChange={(e) => setNewActionRoute(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-on-surface">Icon Type</label>
              <select
                className="w-full px-3 py-2 text-xs rounded border border-outline-variant/50 bg-surface-container-lowest focus:border-primary"
                value={newActionIcon}
                onChange={(e) => setNewActionIcon(e.target.value)}
              >
                <option value="quotes">Quotes / Document</option>
                <option value="invoices">Invoices / Billing</option>
                <option value="payments">Payments / Card</option>
                <option value="orders">Orders / Folder</option>
                <option value="projects">Projects / Delivery</option>
                <option value="support">Support / Headset</option>
                <option value="services">Services / Catalog</option>
                <option value="profile">Profile / User</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface">Badge Tag (Optional)</label>
              <Input
                placeholder="e.g. HOT, NEW, 15%"
                value={newActionBadge}
                onChange={(e) => setNewActionBadge(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewActionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Tile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
