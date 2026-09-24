import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatRelativeTime } from '../src/lib/utils';

describe('Utility Formatters', () => {
  it('formats currency correctly for USD', () => {
    expect(formatCurrency(2499, 'USD')).toContain('$2,499.00');
  });

  it('formats currency correctly for INR', () => {
    const formatted = formatCurrency(4825400, 'INR');
    expect(formatted).toContain('48,25,400');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2026-09-24T05:00:00Z');
    expect(formatted).toContain('Sep');
    expect(formatted).toContain('2026');
  });

  it('handles relative time calculations', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('0s ago');
  });
});
