'use client';

import * as React from 'react';
import { 
  Settings, 
  CreditCard, 
  Sparkles, 
  Shield, 
  Users, 
  FileSpreadsheet, 
  Building2, 
  FileText, 
  Sliders,
  CheckCircle2,
  Save,
  Globe,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/feedback/toast';

const settingsNavCards = [
  {
    title: 'Document Designer & Templates',
    description: 'Customize layout, typography, line-item tables, colors, and signatures for Quotes and Invoices.',
    href: '/settings/templates',
    icon: FileSpreadsheet,
    badge: 'Interactive Designer',
  },
  {
    title: 'Organization & Legal Profile',
    description: 'Legal entity name, GSTIN, PAN, registered addresses, website, and company branding.',
    href: '/settings/organization',
    icon: Building2,
  },
  {
    title: 'Default Notes & Commercial Terms',
    description: 'Global customer notes, add-on pricing policies, and terms & conditions.',
    href: '/settings/document-defaults',
    icon: FileText,
  },
  {
    title: 'Custom Transaction Fields',
    description: 'Custom attributes, dynamic input types, and mandatory/PDF visibility settings.',
    href: '/settings/custom-fields',
    icon: Sliders,
  },
  {
    title: 'Payment Gateway Integration',
    description: 'Razorpay, Cashfree, and Stripe API keys, webhook signatures, and auto-collection.',
    href: '/settings/payments',
    icon: CreditCard,
  },
  {
    title: 'AI Assistant & Automation',
    description: 'Google Gemini & Anthropic provider keys, context limits, and proposal generation prompts.',
    href: '/settings/ai',
    icon: Sparkles,
  },
];

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = React.useState<'ORGANIZATION' | 'PAYMENTS' | 'AI' | 'DEFAULTS'>('ORGANIZATION');

  // Organization Form State
  const [orgForm, setOrgForm] = React.useState({
    name: 'HENU OS CLM Global Enterprise Ltd.',
    trade_name: 'HENU Cloud Solutions',
    gstin: '27ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    email: 'billing@henu.io',
    phone: '+91 98765 43210',
    website: 'https://henu-build.netlify.app',
    address_line1: 'Building 4B, Cyber Gateway',
    address_line2: 'HITEC City, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    country: 'India',
    base_currency: 'INR',
  });

  // Payment Keys State
  const [paymentForm, setPaymentForm] = React.useState({
    razorpay_enabled: true,
    razorpay_key_id: 'rzp_live_984hfsd8f7h32k',
    razorpay_key_secret: '••••••••••••••••••••••••••••••',
    cashfree_enabled: true,
    cashfree_app_id: 'cf_app_live_8746283',
    cashfree_secret_key: '••••••••••••••••••••••••••••••',
    auto_reconcile: true,
  });

  // AI Settings State
  const [aiForm, setAiForm] = React.useState({
    provider: 'gemini',
    gemini_api_key: '••••••••••••••••••••••••••••••',
    temperature: 0.7,
    max_tokens: 4096,
    auto_generate_proposal_terms: true,
  });

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Settings Saved', 'Organization legal profile updated successfully.');
  };

  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Payment Credentials Updated', 'Razorpay and Cashfree environments configured.');
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'AI Configuration Updated', 'Generative model parameters updated.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Platform Settings & Configurations</h1>
          <p className="text-xs text-on-surface-variant">
            Manage organization legal identity, document templates, payment gateways, and generative AI parameters.
          </p>
        </div>
        <a
          href="/settings/templates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold shadow-xs hover:bg-primary-container transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Launch Template Designer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Navigation Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settingsNavCards.map((sec) => {
          const Icon = sec.icon;
          return (
            <a
              key={sec.href}
              href={sec.href}
              className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-xs hover:border-primary/60 hover:shadow-md transition-all flex items-start gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {sec.title}
                  </h3>
                  {sec.badge && (
                    <Badge variant="secondary">
                      {sec.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                  {sec.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* In-Page Settings Workbench */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs overflow-hidden">
        {/* Settings Tab Headers */}
        <div className="flex border-b border-outline-variant/40 bg-surface-container-low/40 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ORGANIZATION')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'ORGANIZATION'
                ? 'border-primary text-primary bg-surface-container-lowest shadow-xs'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Organization Profile
          </button>
          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'PAYMENTS'
                ? 'border-primary text-primary bg-surface-container-lowest shadow-xs'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Payment Gateways
          </button>
          <button
            onClick={() => setActiveTab('AI')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'AI'
                ? 'border-primary text-primary bg-surface-container-lowest shadow-xs'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            AI Assistant Configuration
          </button>
        </div>

        <CardContent className="p-6">
          {/* TAB 1: ORGANIZATION PROFILE */}
          {activeTab === 'ORGANIZATION' && (
            <form onSubmit={handleSaveOrg} className="space-y-6 text-xs text-on-surface">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Legal Entity & Tax Registration</h3>
                <p className="text-outline text-[11px]">Details appear automatically on all dispatched Quotes, Invoices, and Delivery Slips.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Trade / Brand Name</label>
                  <input
                    type="text"
                    value={orgForm.trade_name}
                    onChange={(e) => setOrgForm({ ...orgForm, trade_name: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">GSTIN *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.gstin}
                    onChange={(e) => setOrgForm({ ...orgForm, gstin: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">PAN *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.pan}
                    onChange={(e) => setOrgForm({ ...orgForm, pan: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Billing Email *</label>
                  <input
                    type="email"
                    required
                    value={orgForm.email}
                    onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Official Website</label>
                  <input
                    type="url"
                    value={orgForm.website}
                    onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-outline uppercase tracking-wider mb-2">Registered Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={orgForm.address_line1}
                      onChange={(e) => setOrgForm({ ...orgForm, address_line1: e.target.value })}
                      className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={orgForm.city}
                      onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
                      className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State"
                      value={orgForm.state}
                      onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
                      className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={orgForm.pincode}
                      onChange={(e) => setOrgForm({ ...orgForm, pincode: e.target.value })}
                      className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant/40">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Organization Settings
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: PAYMENT GATEWAYS */}
          {activeTab === 'PAYMENTS' && (
            <form onSubmit={handleSavePayments} className="space-y-6 text-xs text-on-surface">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Automated Payment Collections & Gateways</h3>
                <p className="text-outline text-[11px]">Generate instant UPI QR codes, virtual bank accounts, and checkout links.</p>
              </div>

              {/* Razorpay Section */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-on-surface">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span>Razorpay Live Gateway</span>
                  </div>
                  <Badge variant={paymentForm.razorpay_enabled ? 'success' : 'secondary'}>
                    {paymentForm.razorpay_enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-outline mb-1 text-[11px]">Key ID</label>
                    <input
                      type="text"
                      value={paymentForm.razorpay_key_id}
                      onChange={(e) => setPaymentForm({ ...paymentForm, razorpay_key_id: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-outline mb-1 text-[11px]">Key Secret</label>
                    <input
                      type="password"
                      value={paymentForm.razorpay_key_secret}
                      onChange={(e) => setPaymentForm({ ...paymentForm, razorpay_key_secret: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Cashfree Section */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-on-surface">
                    <Building2 className="w-4 h-4 text-secondary" />
                    <span>Cashfree AutoCollect (UPI & Virtual Bank)</span>
                  </div>
                  <Badge variant={paymentForm.cashfree_enabled ? 'success' : 'secondary'}>
                    {paymentForm.cashfree_enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-outline mb-1 text-[11px]">App ID</label>
                    <input
                      type="text"
                      value={paymentForm.cashfree_app_id}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cashfree_app_id: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-outline mb-1 text-[11px]">Secret Key</label>
                    <input
                      type="password"
                      value={paymentForm.cashfree_secret_key}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cashfree_secret_key: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant/40">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Payment Credentials
                </Button>
              </div>
            </form>
          )}

          {/* TAB 3: AI ASSISTANT */}
          {activeTab === 'AI' && (
            <form onSubmit={handleSaveAI} className="space-y-6 text-xs text-on-surface">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Generative Proposal & Accounting AI Engine</h3>
                <p className="text-outline text-[11px]">Powers auto-drafting of quotation scope breakdowns, client terms, and margin analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">AI Provider Engine</label>
                  <select
                    value={aiForm.provider}
                    onChange={(e) => setAiForm({ ...aiForm, provider: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface"
                  >
                    <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
                    <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
                    <option value="openai">OpenAI GPT-4o</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">API Key</label>
                  <input
                    type="password"
                    value={aiForm.gemini_api_key}
                    onChange={(e) => setAiForm({ ...aiForm, gemini_api_key: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-xs text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Temperature ({aiForm.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiForm.temperature}
                    onChange={(e) => setAiForm({ ...aiForm, temperature: parseFloat(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Max Context Window Tokens</label>
                  <input
                    type="number"
                    value={aiForm.max_tokens}
                    onChange={(e) => setAiForm({ ...aiForm, max_tokens: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-outline-variant/40">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-1.5" />
                  Save AI Configuration
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
