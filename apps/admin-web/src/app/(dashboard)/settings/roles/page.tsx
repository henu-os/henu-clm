'use client';

import * as React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PERMISSIONS } from '@henu/shared';

const rolesList = ['super_admin', 'admin', 'sales', 'finance', 'support', 'content_manager'] as const;

export default function RolesSettingsPage() {
  const permissionsList = Object.entries(PERMISSIONS);

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-on-surface">Roles & Permissions Matrix</h1>
        <p className="text-xs text-outline">
          Inspect dynamic PostgreSQL Row Level Security (RLS) and dynamic role permission bindings.
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Identifier</TableHead>
              {rolesList.map((role) => (
                <TableHead key={role} className="text-center">
                  <span className="text-[11px] font-bold uppercase">{role.replace(/_/g, ' ')}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsList.map(([key, code]) => (
              <TableRow key={code}>
                <TableCell className="font-mono text-xs text-on-surface font-medium">{code}</TableCell>
                {rolesList.map((role) => {
                  const isSuper = role === 'super_admin';
                  const isAllowed =
                    isSuper ||
                    (role === 'admin' && !code.includes('system.') && !code.includes('audit.')) ||
                    (role === 'sales' && (code.includes('quotes.') || code.includes('customers.profile.view'))) ||
                    (role === 'finance' && (code.includes('invoices.') || code.includes('payments.') || code.includes('customers.profile.view'))) ||
                    (role === 'support' && code.includes('.view')) ||
                    (role === 'content_manager' && (code.includes('catalog.') || code.includes('cms.')));

                  return (
                    <TableCell key={role} className="text-center">
                      {isAllowed ? (
                        <Check className="w-4 h-4 text-secondary mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-outline/40 mx-auto" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
