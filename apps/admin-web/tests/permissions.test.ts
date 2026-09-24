import { describe, it, expect } from 'vitest';
import { hasPermission } from '../src/lib/permissions';
import { PERMISSIONS } from '@henu/shared';

describe('RBAC Permission Checks', () => {
  it('allows super_admin access to all permissions implicitly', () => {
    expect(hasPermission('super_admin', PERMISSIONS.SYSTEM_SETTINGS_MANAGE)).toBe(true);
    expect(hasPermission('super_admin', PERMISSIONS.PAYMENTS_REFUND)).toBe(true);
    expect(hasPermission('super_admin', PERMISSIONS.AUDIT_LOGS_VIEW)).toBe(true);
  });

  it('restricts sales role to sales and customer views', () => {
    expect(hasPermission('sales', PERMISSIONS.QUOTES_VIEW_ALL)).toBe(true);
    expect(hasPermission('sales', PERMISSIONS.QUOTES_MODIFY_PRICING)).toBe(true);
    expect(hasPermission('sales', PERMISSIONS.PAYMENTS_REFUND)).toBe(false);
    expect(hasPermission('sales', PERMISSIONS.SYSTEM_SETTINGS_MANAGE)).toBe(false);
  });

  it('restricts finance role to billing and payments', () => {
    expect(hasPermission('finance', PERMISSIONS.INVOICES_CREATE)).toBe(true);
    expect(hasPermission('finance', PERMISSIONS.PAYMENTS_REFUND)).toBe(true);
    expect(hasPermission('finance', PERMISSIONS.CATALOG_SERVICE_MANAGE)).toBe(false);
  });

  it('denies permissions when role is undefined or client', () => {
    expect(hasPermission(undefined, PERMISSIONS.QUOTES_VIEW_ALL)).toBe(false);
    expect(hasPermission('client', PERMISSIONS.QUOTES_VIEW_ALL)).toBe(false);
  });
});
