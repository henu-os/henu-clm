import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatRelativeTime } from '../src/lib/utils';
import { calculateLineItem, calculateDocumentTotals, roundCurrency } from '../src/lib/finance/calculator';
import { numberToWords, numberToWordsIndian, numberToWordsWestern, formatCurrencyWords } from '../src/lib/finance/number_to_words';

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

describe('Financial Calculation Engine', () => {
  it('correctly calculates single line item with discount and tax (Qty=2, Rate=1250, Disc=10%, Tax=18%)', () => {
    const result = calculateLineItem({
      quantity: 2,
      rate: 1250,
      discountPercent: 10,
      taxPercent: 18,
    });

    expect(result.grossAmount).toBe(2500);
    expect(result.discountAmount).toBe(250);
    expect(result.taxableAmount).toBe(2250);
    expect(result.taxAmount).toBe(405);
    expect(result.totalAmount).toBe(2655);
  });

  it('correctly calculates full document totals with shipping, adjustment, TDS and payments', () => {
    const docTotals = calculateDocumentTotals({
      items: [
        { quantity: 2, rate: 1250, discountPercent: 10, taxPercent: 18 },
        { quantity: 1, rate: 5000, discountPercent: 0, taxPercent: 18 },
      ],
      shippingCharges: 200,
      adjustment: -5,
      tdsPercent: 2,
      paidAmount: 1000,
      creditApplied: 500,
    });

    // Item 1: gross 2500, disc 250, taxable 2250, tax 405, total 2655
    // Item 2: gross 5000, disc 0, taxable 5000, tax 900, total 5900
    // Subtotal = 7500
    // Total Discount = 250
    // Taxable Subtotal = 7250
    // Total Tax = 1305
    // TDS (2% on 7250) = 145
    // Grand Total = 7250 + 1305 + 200 - 5 - 145 = 8605
    // Balance Due = 8605 - 1000 - 500 = 7105
    expect(docTotals.subtotal).toBe(7500);
    expect(docTotals.totalDiscount).toBe(250);
    expect(docTotals.taxableSubtotal).toBe(7250);
    expect(docTotals.totalTax).toBe(1305);
    expect(docTotals.tdsAmount).toBe(145);
    expect(docTotals.grandTotal).toBe(8605);
    expect(docTotals.balanceDue).toBe(7105);
  });

  it('handles zero values and edge rounding decimals safely', () => {
    const zeroItem = calculateLineItem({ quantity: 0, rate: 0 });
    expect(zeroItem.totalAmount).toBe(0);

    const fractional = roundCurrency(0.1 + 0.2);
    expect(fractional).toBe(0.3);
  });
});

describe('Number to Words Engine', () => {
  it('converts zero amount correctly', () => {
    expect(numberToWordsIndian(0)).toBe('Zero Rupees Only');
    expect(numberToWordsWestern(0)).toBe('Zero Dollars Only');
  });

  it('converts standard single, double and three digit numbers', () => {
    expect(numberToWordsIndian(1)).toBe('One Rupees Only');
    expect(numberToWordsIndian(10)).toBe('Ten Rupees Only');
    expect(numberToWordsIndian(100)).toBe('One Hundred Rupees Only');
    expect(numberToWordsIndian(999)).toBe('Nine Hundred Ninety Nine Rupees Only');
  });

  it('converts thousands, lakhs and crores accurately', () => {
    expect(numberToWordsIndian(1000)).toBe('One Thousand Rupees Only');
    expect(numberToWordsIndian(11875)).toBe('Eleven Thousand Eight Hundred Seventy Five Rupees Only');
    expect(numberToWordsIndian(100000)).toBe('One Lakh Rupees Only');
    expect(numberToWordsIndian(1000000)).toBe('Ten Lakh Rupees Only');
    expect(numberToWordsIndian(10000000)).toBe('One Crore Rupees Only');
    expect(numberToWordsIndian(100000000)).toBe('Ten Crore Rupees Only');
    expect(numberToWordsIndian(999999999)).toBe('Ninety Nine Crore Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine Rupees Only');
  });

  it('handles fractional paise and cents with formal formatting', () => {
    expect(numberToWordsIndian(12500.50)).toBe('Twelve Thousand Five Hundred Rupees and Fifty Paise Only');
    expect(formatCurrencyWords(11875.75, 'INR')).toBe('Indian Rupee Eleven Thousand Eight Hundred Seventy Five and Seventy Five Paise Only');
    expect(numberToWordsWestern(1500000.25)).toBe('One Million Five Hundred Thousand Dollars and Twenty Five Cents Only');
  });
});

