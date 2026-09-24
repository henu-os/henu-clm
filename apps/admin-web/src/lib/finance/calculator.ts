/**
 * HENU OS CLM — Decimal-Safe Financial Calculation Engine
 * Precise monetary math for Quotes, Invoices, Recurring Invoices, and Credit Notes.
 */

export interface LineItemInput {
  quantity: number;
  rate: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
}

export interface CalculatedLineItem {
  quantity: number;
  rate: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface DocumentTotalsInput {
  items: LineItemInput[];
  overallDiscountAmount?: number;
  shippingCharges?: number;
  adjustment?: number;
  tdsPercent?: number;
  tcsPercent?: number;
  paidAmount?: number;
  creditApplied?: number;
}

export interface DocumentTotalsResult {
  subtotal: number;
  totalDiscount: number;
  taxableSubtotal: number;
  totalTax: number;
  shippingCharges: number;
  adjustment: number;
  tdsAmount: number;
  tcsAmount: number;
  grandTotal: number;
  paidAmount: number;
  creditApplied: number;
  balanceDue: number;
  lineItems: CalculatedLineItem[];
}

/**
 * Rounds monetary number safely to 2 decimal places to avoid JS floating-point issues
 */
export function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates a single line item
 */
export function calculateLineItem(item: LineItemInput): CalculatedLineItem {
  const quantity = item.quantity || 0;
  const rate = item.rate || 0;
  const grossAmount = roundCurrency(quantity * rate);

  let discountAmount = 0;
  if (item.discountPercent && item.discountPercent > 0) {
    discountAmount = roundCurrency((grossAmount * item.discountPercent) / 100);
  } else if (item.discountAmount) {
    discountAmount = Math.min(grossAmount, roundCurrency(item.discountAmount));
  }

  const taxableAmount = Math.max(0, roundCurrency(grossAmount - discountAmount));
  const taxPercent = item.taxPercent || 0;
  const taxAmount = roundCurrency((taxableAmount * taxPercent) / 100);
  const totalAmount = roundCurrency(taxableAmount + taxAmount);

  return {
    quantity,
    rate,
    grossAmount,
    discountAmount,
    taxableAmount,
    taxAmount,
    totalAmount,
  };
}

/**
 * Calculates full document totals (Quote, Invoice, Credit Note)
 */
export function calculateDocumentTotals(input: DocumentTotalsInput): DocumentTotalsResult {
  const lineItems = (input.items || []).map(calculateLineItem);

  const subtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.grossAmount, 0));
  const lineDiscounts = roundCurrency(lineItems.reduce((sum, item) => sum + item.discountAmount, 0));
  const overallDiscount = roundCurrency(input.overallDiscountAmount || 0);
  const totalDiscount = roundCurrency(lineDiscounts + overallDiscount);

  const taxableSubtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.taxableAmount, 0));
  const totalTax = roundCurrency(lineItems.reduce((sum, item) => sum + item.taxAmount, 0));

  const shippingCharges = roundCurrency(input.shippingCharges || 0);
  const adjustment = roundCurrency(input.adjustment || 0);

  // TDS / TCS calculation
  const tdsPercent = input.tdsPercent || 0;
  const tdsAmount = roundCurrency((taxableSubtotal * tdsPercent) / 100);

  const tcsPercent = input.tcsPercent || 0;
  const tcsAmount = roundCurrency(((taxableSubtotal + totalTax) * tcsPercent) / 100);

  const grandTotal = Math.max(
    0,
    roundCurrency(taxableSubtotal + totalTax + shippingCharges + adjustment - tdsAmount + tcsAmount)
  );

  const paidAmount = roundCurrency(input.paidAmount || 0);
  const creditApplied = roundCurrency(input.creditApplied || 0);
  const balanceDue = Math.max(0, roundCurrency(grandTotal - paidAmount - creditApplied));

  return {
    subtotal,
    totalDiscount,
    taxableSubtotal,
    totalTax,
    shippingCharges,
    adjustment,
    tdsAmount,
    tcsAmount,
    grandTotal,
    paidAmount,
    creditApplied,
    balanceDue,
    lineItems,
  };
}
