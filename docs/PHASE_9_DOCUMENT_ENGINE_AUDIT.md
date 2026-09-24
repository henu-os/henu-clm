# HENU OS CLM — PHASE 9: DOCUMENT DESIGNER & PDF ENGINE AUDIT

## 1. Document Designer Implementation (`/settings/templates`)
The document template configuration engine is implemented in `apps/admin-web/src/app/(dashboard)/settings/templates/page.tsx` and backed by the database table `document_templates`.

### Six Configuration Tabs
1. **General**: Template Name, Document Type (`invoice` / `quote` / `credit_note`), Base Layout (`spreadsheet`, `classic`, `modern`, `minimal`), Paper Size (`A4`, `A5`, `Letter`), Orientation (`Portrait`, `Landscape`), Margins, Primary Accent Color, Font Family.
2. **Header & Footer**: Company Logo URL, Organization Title, Subtitle, Header Background, Footer Notes, Terms & Conditions, Page Numbering.
3. **Transaction Details**: Field Labels (`Invoice#`, `Date`, `Due Date`, `PO Number`, `Salesperson`), Field Visibility Toggles, Custom Meta Fields.
4. **Table**: Column Names (`Item`, `Description`, `HSN/SAC`, `Qty`, `Rate`, `Discount`, `Tax`, `Amount`), Column Widths, Alternate Row Striping.
5. **Total**: Subtotal, Discount, Shipping, Taxes (CGST/SGST/IGST breakdown), TDS/TCS, Total in Words, Paid Amount, Balance Due.
6. **Other / Custom Fields**: Bank Account Details for NEFT/RTGS, UPI QR Code display toggle, Authorized Signatory Box, Digital Seal.

---

## 2. Instant Client-Side & Server-Side Document Generation
- **Client-Side Generator** (`apps/admin-web/src/lib/download.ts`):
  - Builds a complete, standalone, high-fidelity printable HTML document with embedded CSS styles matching the active template colors and layout.
  - Generates a `Blob([htmlContent], { type: 'text/html;charset=utf-8' })` and triggers instant native browser download.
- **Server-Side Edge Generator** (`backend/functions/generate-invoice-pdf/index.ts`):
  - Fetches structured invoice and customer data from Supabase.
  - Prepares the storage manifest and generates signed download URLs (`documents/invoices/:id.pdf`).
