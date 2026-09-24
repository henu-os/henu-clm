/**
 * Client-Side Instant Document Downloader for Invoices, Quotes, Orders, Receipts, and Reports.
 * Generates valid printable HTML/PDF text payloads and triggers instant browser file download.
 */
export function downloadDocumentFile(
  docTitle: string,
  docNumber: string,
  contentPayload: {
    client?: string;
    date?: string;
    amount?: number | string;
    status?: string;
    items?: Array<{ name: string; quantity: number; rate: number; tax?: number; total: number }>;
    notes?: string;
  },
  fileExtension: 'pdf' | 'csv' | 'txt' = 'pdf'
) {
  const filename = `${docNumber || 'document'}_${Date.now()}.${fileExtension}`;
  
  if (fileExtension === 'csv') {
    const csvContent = `Document,Number,Client,Date,Amount,Status\n"${docTitle}","${docNumber}","${contentPayload.client || ''}","${contentPayload.date || ''}","${contentPayload.amount || 0}","${contentPayload.status || 'ACTIVE'}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveBlobFile(blob, filename);
    return;
  }

  // HTML / Printable PDF payload
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docTitle} - ${docNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 2px solid #887DB8; padding-bottom: 20px; display: flex; justify-content: space-between; }
    .org-name { font-size: 20px; font-weight: bold; color: #1f1a24; }
    .doc-type { font-size: 24px; font-weight: 800; color: #887DB8; text-transform: uppercase; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th { background: #f4f2f8; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #ddd; }
    td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    .total-box { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #1f1a24; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="org-name">HENU OS CLM Enterprise Ltd.</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px;">GSTIN: 27ABCDE1234F1Z5 | PAN: ABCDE1234F</div>
    </div>
    <div style="text-align: right;">
      <div class="doc-type">${docTitle}</div>
      <div style="font-size: 14px; font-family: monospace; font-weight: bold; margin-top: 4px;"># ${docNumber}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <strong>Billed / Assigned To:</strong><br>
      ${contentPayload.client || 'Valued Client'}<br>
      Status: <span style="color: #059669; font-weight: bold;">${contentPayload.status || 'CONFIRMED'}</span>
    </div>
    <div style="text-align: right;">
      <strong>Date Issued:</strong> ${contentPayload.date || new Date().toISOString().split('T')[0]}<br>
      <strong>Currency:</strong> INR (₹)
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th style="text-align: right;">Qty</th>
        <th style="text-align: right;">Rate (₹)</th>
        <th style="text-align: right;">Tax</th>
        <th style="text-align: right;">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${
        contentPayload.items && contentPayload.items.length > 0
          ? contentPayload.items
              .map(
                (item) => `<tr>
            <td>${item.name}</td>
            <td style="text-align: right;">${item.quantity}</td>
            <td style="text-align: right;">${Number(item.rate).toLocaleString()}</td>
            <td style="text-align: right;">${item.tax || 18}%</td>
            <td style="text-align: right; font-weight: bold;">₹${Number(item.total).toLocaleString()}</td>
          </tr>`
              )
              .join('')
          : `<tr>
          <td>Commercial Deliverable & Service Execution Contract</td>
          <td style="text-align: right;">1</td>
          <td style="text-align: right;">${Number(contentPayload.amount || 0).toLocaleString()}</td>
          <td style="text-align: right;">18%</td>
          <td style="text-align: right; font-weight: bold;">₹${Number(contentPayload.amount || 0).toLocaleString()}</td>
        </tr>`
      }
    </tbody>
  </table>

  <div class="total-box">
    Grand Total: ₹${Number(contentPayload.amount || 0).toLocaleString()}
  </div>

  ${contentPayload.notes ? `<div style="margin-top: 30px; font-size: 12px; color: #555; background: #fafafa; padding: 12px; border-radius: 6px;"><strong>Customer Notes:</strong><br>${contentPayload.notes}</div>` : ''}

  <div class="footer">
    This is an authorized system-generated commercial document from HENU OS CLM.<br>
    Questions? Contact billing@henu.io | https://henu-build.netlify.app
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  saveBlobFile(blob, `${docNumber || 'document'}_OFFICIAL.html`);
}

function saveBlobFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
