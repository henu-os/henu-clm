'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const DEFAULT_QUOTE_NOTES = `Optional Add-Ons
| Add-On                        |        Price |
| ----------------------------- | -----------: |
| Standard Graphic              |         ₹189 |
| AI Graphic                    |          ₹79 |
| Premium Carousel              |    ₹249–₹399 |
| AI Video 15–30 sec            |         ₹397 |
| AI Video 30–67 sec            |         ₹578 |
| Client Footage Edit 15–65 sec |         ₹479 |
| Extended Video Edit           |         ₹659 |
| Standalone Shoot Guidance     |   ₹260/video |
| YouTube Management            | ₹5,829/month |
| YouTube Editing               | ₹6,500/month |
| Google Maps – Urban           | ₹2,649/28 days |
| Google Maps – Rural           |   ₹979/28 days |`;

const DEFAULT_QUOTE_TERMS = `Scope: Work, features, and timelines are as defined in this approved quotation only.
Taxes: All prices are exclusive of tax; 18% GST applicable.
Payment: 60% advance to start, 40% before final handover/launch. Hosting, domain & maintenance billed separately.
Revisions: Limited revisions included as per scope; extra changes/features charged additionally.
Client Content: Client must provide accurate text/images/logos. HENU OS bears no responsibility for copyright issues in client-supplied content.
Timelines: Estimated only; may shift due to client delay or third-party (domain/hosting/payment gateway) issues.
Hosting & Maintenance: Best-effort uptime/performance. Maintenance covers only listed tasks; extra work is chargeable.
IP Rights: Client owns final content after full payment (excludes third-party tools/templates). HENU OS may showcase the project in its portfolio unless client requests otherwise in writing.
Third-Party Services: Governed by their own terms; HENU OS is not liable for their downtime/changes/issues.
Support: Limited post-launch bug-fix support as per proposal. New features/changes are paid separately.
Cancellation: Advance is non-refundable if client cancels after work starts. Additional completed work beyond advance is billed.
Liability: HENU OS is not liable for direct/indirect loss (data, revenue, reputation) from website use.
Jurisdiction: Terms may be updated for new projects. Disputes subject to courts of Rajasthan, India.`;

export default function DocumentDefaultsPage() {
  const [docType, setDocType] = useState<'quote' | 'invoice' | 'credit_note'>('quote');
  
  const [quoteDefaults, setQuoteDefaults] = useState({
    notes: DEFAULT_QUOTE_NOTES,
    terms: DEFAULT_QUOTE_TERMS,
    applyFuture: true,
  });

  const [invoiceDefaults, setInvoiceDefaults] = useState({
    notes: 'Thank you for your business! Please remit payment within the specified terms.',
    terms: '1. Payment is due strictly according to agreed payment terms.\n2. Interest @ 18% per annum will be charged on overdue payments.\n3. All disputes subject to jurisdiction of local courts.',
    applyFuture: true,
  });

  const [creditNoteDefaults, setCreditNoteDefaults] = useState({
    notes: 'This credit note can be adjusted against future invoices or refunded as agreed.',
    terms: 'Credit notes must be utilized within 180 days from the date of issue.',
    applyFuture: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    if (docType === 'quote') {
      setQuoteDefaults({
        notes: DEFAULT_QUOTE_NOTES,
        terms: DEFAULT_QUOTE_TERMS,
        applyFuture: true,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/settings" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Settings
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Document Defaults</span>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            Document defaults saved successfully!
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#887DB8]" />
            Default Notes, Terms & Conditions
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Set standardized notes and legal clauses that automatically prefill when creating transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 font-medium text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Standard
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#887DB8] hover:bg-[#776ca7] text-white font-semibold text-sm transition shadow-lg shadow-[#887DB8]/20"
          >
            <Save className="w-4 h-4" />
            Save Defaults
          </button>
        </div>
      </div>

      {/* Document Type Selector Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setDocType('quote')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            docType === 'quote'
              ? 'bg-[#887DB8] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#20202B]'
          }`}
        >
          Quotes & Estimates
        </button>
        <button
          onClick={() => setDocType('invoice')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            docType === 'invoice'
              ? 'bg-[#887DB8] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#20202B]'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setDocType('credit_note')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            docType === 'credit_note'
              ? 'bg-[#887DB8] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#20202B]'
          }`}
        >
          Credit Notes
        </button>
      </div>

      {/* Main Configuration Body */}
      <form onSubmit={handleSave} className="space-y-6">
        {docType === 'quote' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Customer Notes */}
            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#887DB8]" />
                    Default Customer Notes
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Visible to the customer on the proposal page and PDF quote
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Supports Markdown Tables
                </div>
              </div>

              <textarea
                rows={12}
                value={quoteDefaults.notes}
                onChange={(e) => setQuoteDefaults({ ...quoteDefaults, notes: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#887DB8] leading-relaxed resize-y"
              />

              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <input
                  type="checkbox"
                  id="quote_notes_future"
                  checked={quoteDefaults.applyFuture}
                  onChange={(e) => setQuoteDefaults({ ...quoteDefaults, applyFuture: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                />
                <label htmlFor="quote_notes_future" className="text-xs text-gray-300 font-medium">
                  Use this in future for all quotes of all customers
                </label>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#887DB8]" />
                    Default Terms & Conditions
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Standard commercial, revision, payment, and legal clauses
                  </p>
                </div>
              </div>

              <textarea
                rows={14}
                value={quoteDefaults.terms}
                onChange={(e) => setQuoteDefaults({ ...quoteDefaults, terms: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#887DB8] leading-relaxed resize-y"
              />

              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <input
                  type="checkbox"
                  id="quote_terms_future"
                  checked={quoteDefaults.applyFuture}
                  onChange={(e) => setQuoteDefaults({ ...quoteDefaults, applyFuture: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                />
                <label htmlFor="quote_terms_future" className="text-xs text-gray-300 font-medium">
                  Use this in future for all quotes of all customers
                </label>
              </div>
            </div>
          </div>
        )}

        {docType === 'invoice' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white">Default Invoice Customer Notes</h3>
              <textarea
                rows={4}
                value={invoiceDefaults.notes}
                onChange={(e) => setInvoiceDefaults({ ...invoiceDefaults, notes: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
              />
              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <input
                  type="checkbox"
                  id="inv_notes_future"
                  checked={invoiceDefaults.applyFuture}
                  onChange={(e) => setInvoiceDefaults({ ...invoiceDefaults, applyFuture: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                />
                <label htmlFor="inv_notes_future" className="text-xs text-gray-300">
                  Use this in future for all invoices of all customers
                </label>
              </div>
            </div>

            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white">Default Invoice Terms & Conditions</h3>
              <textarea
                rows={6}
                value={invoiceDefaults.terms}
                onChange={(e) => setInvoiceDefaults({ ...invoiceDefaults, terms: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#887DB8]"
              />
            </div>
          </div>
        )}

        {docType === 'credit_note' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white">Default Credit Note Customer Notes</h3>
              <textarea
                rows={4}
                value={creditNoteDefaults.notes}
                onChange={(e) => setCreditNoteDefaults({ ...creditNoteDefaults, notes: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
              />
            </div>

            <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white">Default Credit Note Terms</h3>
              <textarea
                rows={4}
                value={creditNoteDefaults.terms}
                onChange={(e) => setCreditNoteDefaults({ ...creditNoteDefaults, terms: e.target.value })}
                className="w-full px-4 py-3 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#887DB8]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/settings"
            className="px-5 py-2.5 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 font-medium text-sm transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#887DB8] hover:bg-[#776ca7] text-white font-semibold text-sm transition shadow-lg shadow-[#887DB8]/20"
          >
            <Save className="w-4 h-4" />
            Save Document Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
