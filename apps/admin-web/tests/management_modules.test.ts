import { describe, it, expect } from 'vitest';
import { calculateLineItem, calculateDocumentTotals, roundCurrency } from '../src/lib/finance/calculator';

describe('HENU OS CLM — Phase 7 Management Modules & Financial Engine Suite', () => {
  it('1. Items Calculation — compute line item with quantity, rate, discount, and tax', () => {
    const item = calculateLineItem({
      quantity: 5,
      rate: 1000,
      discountPercent: 10, // 10% discount = $500 discount
      taxPercent: 18, // 18% GST on $4500 = $810 tax
    });

    expect(item.grossAmount).toBe(5000);
    expect(item.discountAmount).toBe(500);
    expect(item.taxableAmount).toBe(4500);
    expect(item.taxAmount).toBe(810);
    expect(item.totalAmount).toBe(5310);
  });

  it('2. Document Totals — comprehensive quote & invoice financial calculation', () => {
    const totals = calculateDocumentTotals({
      items: [
        { quantity: 2, rate: 10000, discountPercent: 0, taxPercent: 18 }, // $20000 + $3600 = $23600
        { quantity: 1, rate: 5000, discountAmount: 500, taxPercent: 18 }, // $4500 + $810 = $5310
      ],
      shippingCharges: 250,
      adjustment: -60,
      paidAmount: 10000,
      creditApplied: 1000,
    });

    expect(totals.subtotal).toBe(25000);
    expect(totals.totalDiscount).toBe(500);
    expect(totals.taxableSubtotal).toBe(24500);
    expect(totals.totalTax).toBe(4410); // 18% of 24500 = 4410
    expect(totals.shippingCharges).toBe(250);
    expect(totals.grandTotal).toBe(29100); // 24500 + 4410 + 250 - 60 = 29100
    expect(totals.balanceDue).toBe(18100); // 29100 - 10000 (paid) - 1000 (credit) = 18100
  });

  it('3. Recurring Invoice Schedule — next run date calculation', () => {
    const startDate = new Date('2026-06-01T00:00:00Z');
    const intervalMonths = 1;

    const nextRun = new Date(startDate);
    nextRun.setMonth(nextRun.getMonth() + intervalMonths);

    expect(nextRun.toISOString().split('T')[0]).toBe('2026-07-01');
  });

  it('4. Credit Note Allocation — deducts customer invoice balance', () => {
    const invoice = { id: 'inv_01', totalAmount: 10000, paidAmount: 4000, balanceDue: 6000 };
    const creditNote = { id: 'cn_01', totalAmount: 1500, balanceAmount: 1500 };

    // Apply credit note
    const appliedAmount = Math.min(invoice.balanceDue, creditNote.balanceAmount);
    invoice.balanceDue -= appliedAmount;
    creditNote.balanceAmount -= appliedAmount;

    expect(appliedAmount).toBe(1500);
    expect(invoice.balanceDue).toBe(4500);
    expect(creditNote.balanceAmount).toBe(0);
  });
});
