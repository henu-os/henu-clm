'use client';

import * as React from 'react';
import { Settings, CreditCard, Sparkles, Shield, Users, FileSpreadsheet, Building2, FileText, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const settingsSections = [
  {
    title: 'Document Designer & Templates',
    description: 'Customize layout, typography, line-item tables, and authorized signatures for Quotes and Invoices.',
    href: '/settings/templates',
    icon: FileSpreadsheet,
  },
  {
    title: 'Organization Profile',
    description: 'Manage legal entity name, GSTIN, PAN, registered addresses, website, and company logo branding.',
    href: '/settings/organization',
    icon: Building2,
  },
  {
    title: 'Default Notes & Terms',
    description: 'Set global default customer notes, add-on pricing tables, and commercial terms & conditions.',
    href: '/settings/document-defaults',
    icon: FileText,
  },
  {
    title: 'Custom Fields & Preferences',
    description: 'Configure custom transaction attributes, input types, and mandatory/PDF visibility settings.',
    href: '/settings/custom-fields',
    icon: Sliders,
  },
  {
    title: 'Payment Gateways',
    description: 'Configure Razorpay and Cashfree API keys, webhook secrets, and auto-collect environments.',
    href: '/settings/payments',
    icon: CreditCard,
  },
  {
    title: 'AI Assistant',
    description: 'Configure OpenAI / Anthropic / Gemini provider keys, context limits, and temperature.',
    href: '/settings/ai',
    icon: Sparkles,
  },
  {
    title: 'Roles & Permissions',
    description: 'Inspect dynamic RBAC matrix, assign team permissions, and configure access policies.',
    href: '/settings/roles',
    icon: Shield,
  },
  {
    title: 'Team & Staff',
    description: 'Manage internal administrative operators, invite staff, and assign operational roles.',
    href: '/customers',
    icon: Users,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-on-surface">Platform Settings & Configurations</h1>
        <p className="text-xs text-outline">Manage payment gateway credentials, AI models, and access control policies.</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {settingsSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <a
              key={sec.href}
              href={sec.href}
              className="p-5 bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-xs hover:border-primary/60 hover:shadow-md transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{sec.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{sec.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
