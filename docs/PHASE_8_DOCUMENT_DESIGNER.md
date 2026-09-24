# HENU OS CLM — PHASE 8 DOCUMENT DESIGNER SPECIFICATION

## 1. Overview
The HENU OS CLM Document Designer (`/settings/templates`) enables administrators to visually customize, preview, and version document templates for Quotes, Tax Invoices, Credit Notes, and Payment Receipts.

---

## 2. Editor Layout & Navigation Tabs
The editor provides top action controls (Refresh Preview, Save Template, Close/Cancel) and 6 structured configuration tabs:

### Tab 1: General (Page Setup & Typography)
- **Template Name**: e.g., `Spreadsheet Template`, `Standard Template`.
- **Paper Size**: A4, A5, Letter.
- **Orientation**: Portrait, Landscape.
- **Margins**: Top, Bottom, Left, Right (in inches).
- **Typography**: Font family (Inter, Roboto, Open Sans, Helvetica), font size (8pt to 14pt), and color picker.
- **Background**: Custom background color and background watermark image upload via Supabase Storage.

### Tab 2: Header & Footer
- **Organization Header**: Company name, full registered address, phone, email, website, and GSTIN toggles.
- **Company Logo**: Upload, replace, or remove with 240x240 @ 72 DPI guidelines.
- **Document Title**: Configurable title (e.g., `TAX INVOICE`, `COMMERCIAL INVOICE`, `QUOTATION`, `ESTIMATE`, `CREDIT NOTE`, `PAYMENT RECEIPT`).
- **Footer**: Dynamic page numbering (`Page 1 of 1`), custom footer disclaimer, and bank details.

### Tab 3: Transaction Details
- Custom field labels for Document Number, Dates (Issue, Due, Expiry), PO / Reference numbers.
- Customer details display controls: Billing address, Shipping address, GSTIN, Place of Supply, PAN.

### Tab 4: Table & Line Items Customization
- **Column Toggles & Custom Labels**:
  - `# / Serial Number`
  - `Item & Description`
  - `HSN / SAC Code`
  - `Quantity & Unit`
  - `Rate / Unit Price`
  - `Discount (%)`
  - `Tax Breakdown (CGST / SGST / IGST)`
  - `Line Total Amount`
- **Table Styling**: Header background color, header text color, gridlines, alternating row shading.

### Tab 5: Total & Signatures
- **Summary Rows**: Subtotal, Tax Breakdown, Discounts, Shipping Charges, Adjustments, Grand Total, Balance Due.
- **Total in Words**: Indian numbering system (`Indian Rupee Eleven Thousand Eight Hundred and Fifty Paise Only`).
- **Authorized Signature**: Toggle signature block, custom signature label (`Authorized Signatory`), and signature image upload.

### Tab 6: Other Details & Presets
- Customer Notes and Terms & Conditions prefilled from Document Defaults.

---

## 3. Live Canvas Preview
- The interactive right-hand canvas dynamically reflects paper size, margins, font styles, colors, column toggles, and financial totals in real-time as administrators adjust controls.

---

## 4. Versioning & Defaults
- Templates support `DRAFT`, `PUBLISHED`, and `ARCHIVED` statuses.
- Only `PUBLISHED` templates can be selected during Quote / Invoice creation.
- Administrators can set any template as `DEFAULT` per document category.
