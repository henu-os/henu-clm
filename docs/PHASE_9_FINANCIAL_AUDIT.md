# HENU OS CLM — PHASE 9: FINANCIAL ENGINE & CALCULATIONS AUDIT

## 1. Financial Engine Architecture
- **Location**: `apps/admin-web/src/lib/finance/calculator.ts`
- **Arithmetic Engine**: Decimal-safe currency calculations with `Number.EPSILON` rounding to 2 decimal places (`roundCurrency`).

---

## 2. Calculation Formulas & Verification

### Line Item Calculation
$$\text{Gross Amount} = \text{round}(\text{Quantity} \times \text{Rate})$$
$$\text{Discount Amount} = \text{round}\left(\frac{\text{Gross Amount} \times \text{Discount}\%}{100}\right)$$
$$\text{Taxable Amount} = \text{Gross Amount} - \text{Discount Amount}$$
$$\text{Tax Amount} = \text{round}\left(\frac{\text{Taxable Amount} \times \text{Tax}\%}{100}\right)$$
$$\text{Total Amount} = \text{Taxable Amount} + \text{Tax Amount}$$

### Verification Benchmark
```
Quantity = 2
Rate = 1250
Discount = 10%
GST = 18%
```
- **Gross Amount**: $2 \times 1250 = 2,500.00$
- **Discount Amount**: $2,500 \times 10\% = 250.00$
- **Taxable Amount**: $2,500 - 250 = 2,250.00$
- **Tax Amount (GST 18%)**: $2,250 \times 18\% = 405.00$
- **Total Line Amount**: $2,250 + 405 = 2,655.00$
- **Verified In Unit Tests**: `apps/admin-web/tests/utils.test.ts` (PASS).

---

## 3. Document Totals Calculation
$$\text{Taxable Subtotal} = \sum \text{Taxable Amounts}$$
$$\text{Total Tax} = \sum \text{Tax Amounts}$$
$$\text{TDS Deduction} = \text{round}\left(\frac{\text{Taxable Subtotal} \times \text{TDS}\%}{100}\right)$$
$$\text{TCS Addition} = \text{round}\left(\frac{(\text{Taxable Subtotal} + \text{Total Tax}) \times \text{TCS}\%}{100}\right)$$
$$\text{Grand Total} = \text{Taxable Subtotal} + \text{Total Tax} + \text{Shipping} + \text{Adjustment} - \text{TDS} + \text{TCS}$$
$$\text{Balance Due} = \max(0, \text{Grand Total} - \text{Paid Amount} - \text{Credit Applied})$$

---

## 4. Number to Words Engine (`number_to_words.ts`)
- Supports Indian Rupee numbering hierarchy (Rupees, Paise, Thousands, Lakhs, Crores up to 999 Crores).
- Supports Western Dollar numbering hierarchy (Dollars, Cents, Thousands, Millions, Billions).
- Verified test cases:
  - `0` -> `"Zero Rupees Only"`
  - `11875` -> `"Eleven Thousand Eight Hundred Seventy Five Rupees Only"`
  - `100000` -> `"One Lakh Rupees Only"`
  - `10000000` -> `"One Crore Rupees Only"`
  - `100000000` -> `"Ten Crore Rupees Only"`
  - `12500.50` -> `"Twelve Thousand Five Hundred Rupees and Fifty Paise Only"`
