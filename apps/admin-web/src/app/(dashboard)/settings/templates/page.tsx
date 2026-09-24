'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  FileText, 
  Plus, 
  Search, 
  Check, 
  Edit3, 
  Copy, 
  RotateCcw, 
  Save, 
  X, 
  Eye, 
  Building2, 
  Receipt, 
  FileMinus, 
  CreditCard,
  Sliders,
  Type,
  Layout,
  Table as TableIcon,
  DollarSign,
  AlignLeft,
  CheckCircle2
} from 'lucide-react';
import { numberToWordsIndian } from '@/lib/finance/number_to_words';

interface TemplateConfig {
  id: string;
  name: string;
  type: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE' | 'PAYMENT_RECEIPT';
  style: 'SPREADSHEET' | 'STANDARD' | 'MODERN';
  paperSize: 'A4' | 'A5' | 'Letter';
  orientation: 'Portrait' | 'Landscape';
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  headerBgColor: string;
  headerTextColor: string;
  documentTitle: string;
  showLogo: boolean;
  showAddress: boolean;
  showGstin: boolean;
  showTotalInWords: boolean;
  showSignature: boolean;
  signatureLabel: string;
  isDefault: boolean;
}

export default function TemplateDesignerPage() {
  const [selectedCategory, setSelectedCategory] = useState<'INVOICE' | 'QUOTE' | 'CREDIT_NOTE' | 'PAYMENT_RECEIPT'>('INVOICE');
  const [activeTab, setActiveTab] = useState<'general' | 'header' | 'transaction' | 'table' | 'total' | 'other'>('general');
  const [isEditing, setIsEditing] = useState(false);

  // Template List
  const [templates, setTemplates] = useState<TemplateConfig[]>([
    {
      id: 'tmpl_001',
      name: 'Standard Corporate Invoice',
      type: 'INVOICE',
      style: 'STANDARD',
      paperSize: 'A4',
      orientation: 'Portrait',
      fontFamily: 'Inter',
      fontSize: 10,
      fontColor: '#20202B',
      headerBgColor: '#20202B',
      headerTextColor: '#FFFFFF',
      documentTitle: 'TAX INVOICE',
      showLogo: true,
      showAddress: true,
      showGstin: true,
      showTotalInWords: true,
      showSignature: true,
      signatureLabel: 'Authorized Signatory',
      isDefault: true,
    },
    {
      id: 'tmpl_002',
      name: 'Spreadsheet Grid Template',
      type: 'INVOICE',
      style: 'SPREADSHEET',
      paperSize: 'A4',
      orientation: 'Portrait',
      fontFamily: 'Roboto',
      fontSize: 9,
      fontColor: '#11131A',
      headerBgColor: '#887DB8',
      headerTextColor: '#FFFFFF',
      documentTitle: 'TAX INVOICE',
      showLogo: true,
      showAddress: true,
      showGstin: true,
      showTotalInWords: true,
      showSignature: true,
      signatureLabel: 'Authorized Signatory',
      isDefault: false,
    },
    {
      id: 'tmpl_003',
      name: 'Enterprise Proposal Blueprint',
      type: 'QUOTE',
      style: 'MODERN',
      paperSize: 'A4',
      orientation: 'Portrait',
      fontFamily: 'Inter',
      fontSize: 10,
      fontColor: '#20202B',
      headerBgColor: '#236870',
      headerTextColor: '#FFFFFF',
      documentTitle: 'QUOTATION',
      showLogo: true,
      showAddress: true,
      showGstin: true,
      showTotalInWords: true,
      showSignature: true,
      signatureLabel: 'Accepted & Agreed By',
      isDefault: true,
    },
  ]);

  // Current Editing Template
  const [currentConfig, setCurrentConfig] = useState<TemplateConfig>(templates[0]);

  const filteredTemplates = templates.filter((t) => t.type === selectedCategory);

  const handleEditTemplate = (tmpl: TemplateConfig) => {
    setCurrentConfig({ ...tmpl });
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    setTemplates(templates.map((t) => (t.id === currentConfig.id ? currentConfig : t)));
    setIsEditing(false);
  };

  const handleSetDefault = (id: string) => {
    setTemplates(
      templates.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/settings" className="text-gray-400 hover:text-white text-sm">Settings</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white text-sm font-medium">Templates</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Document & PDF Designer</h1>
          <p className="text-xs text-gray-400">
            Customize visual layouts, table columns, fonts, GST headers, and signatures for Quotes, Invoices, and Receipts
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              const newTmpl: TemplateConfig = {
                id: `tmpl_${Date.now()}`,
                name: `Custom ${selectedCategory} Template`,
                type: selectedCategory,
                style: 'STANDARD',
                paperSize: 'A4',
                orientation: 'Portrait',
                fontFamily: 'Inter',
                fontSize: 10,
                fontColor: '#20202B',
                headerBgColor: '#20202B',
                headerTextColor: '#FFFFFF',
                documentTitle: selectedCategory === 'QUOTE' ? 'QUOTATION' : 'TAX INVOICE',
                showLogo: true,
                showAddress: true,
                showGstin: true,
                showTotalInWords: true,
                showSignature: true,
                signatureLabel: 'Authorized Signatory',
                isDefault: false,
              };
              handleEditTemplate(newTmpl);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        )}
      </div>

      {/* Main Gallery View vs Interactive Designer View */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex border-b border-gray-800 gap-6 text-sm font-medium">
            {[
              { key: 'INVOICE', label: 'Invoices', icon: Receipt },
              { key: 'QUOTE', label: 'Quotes & Estimates', icon: FileText },
              { key: 'CREDIT_NOTE', label: 'Credit Notes', icon: FileMinus },
              { key: 'PAYMENT_RECEIPT', label: 'Payment Receipts', icon: CreditCard },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`flex items-center gap-2 py-3 border-b-2 transition ${
                    isActive
                      ? 'border-[#887DB8] text-[#887DB8]'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Template Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className={`bg-[#181B24] rounded-2xl border overflow-hidden shadow-sm transition hover:border-gray-700 flex flex-col justify-between ${
                  tmpl.isDefault ? 'border-[#887DB8]/60 ring-1 ring-[#887DB8]/40' : 'border-gray-800'
                }`}
              >
                <div>
                  {/* Thumbnail / Mini Preview */}
                  <div className="p-4 bg-[#20202B]/60 border-b border-gray-800 flex items-center justify-center min-h-[160px]">
                    <div className="w-44 bg-white rounded shadow p-2.5 text-[8px] text-gray-800 space-y-1">
                      <div className="flex justify-between items-center border-b pb-1" style={{ borderColor: tmpl.headerBgColor }}>
                        <span className="font-bold text-[9px]" style={{ color: tmpl.headerBgColor }}>HENU OS</span>
                        <span className="font-bold text-[7px] text-gray-500">{tmpl.documentTitle}</span>
                      </div>
                      <div className="space-y-0.5 text-[6px] text-gray-500">
                        <p>Customer: Acme Corp</p>
                        <p>Invoice #: INV-2026-0001</p>
                      </div>
                      <div className="border-t border-b py-0.5 text-[6px] flex justify-between font-semibold">
                        <span>Description</span>
                        <span>Amount</span>
                      </div>
                      <div className="flex justify-between text-[6px] text-gray-600">
                        <span>Architecture Design</span>
                        <span>$11,800.00</span>
                      </div>
                      <div className="text-right font-bold text-[7px] text-black pt-1">
                        Total: $11,800.00
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                      {tmpl.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#887DB8]/20 text-[#887DB8] border border-[#887DB8]/30">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Style: <span className="text-gray-300 font-medium">{tmpl.style}</span> • Size: {tmpl.paperSize} ({tmpl.orientation})
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEditTemplate(tmpl)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#20202B] hover:bg-[#2E2E37] text-xs font-medium text-white transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#887DB8]" />
                    Edit Layout
                  </button>
                  {!tmpl.isDefault && (
                    <button
                      onClick={() => handleSetDefault(tmpl.id)}
                      className="px-3 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-xs font-medium text-gray-400 hover:text-white transition"
                    >
                      Use as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Interactive Visual Template Designer */
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-[#181B24] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{currentConfig.name}</span>
              <span className="px-2.5 py-0.5 rounded text-xs bg-[#887DB8]/15 text-[#887DB8] font-medium border border-[#887DB8]/30">
                {currentConfig.type} Layout
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#20202B] hover:bg-[#2E2E37] text-xs font-medium text-gray-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-xs font-medium text-white transition shadow"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Controls Editor Panel */}
            <div className="lg:col-span-5 bg-[#181B24] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
              {/* Tab Navigation */}
              <div className="grid grid-cols-3 border-b border-gray-800 text-xs font-medium text-gray-400 bg-[#20202B]/40">
                {[
                  { key: 'general', label: 'General', icon: Sliders },
                  { key: 'header', label: 'Header & Title', icon: Building2 },
                  { key: 'table', label: 'Table Columns', icon: TableIcon },
                  { key: 'total', label: 'Totals & Sign', icon: DollarSign },
                  { key: 'transaction', label: 'Labels', icon: Type },
                  { key: 'other', label: 'Terms & Notes', icon: AlignLeft },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 border-b-2 transition ${
                        isActive
                          ? 'border-[#887DB8] text-white bg-[#181B24]'
                          : 'border-transparent hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#887DB8]" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Controls Form Body */}
              <div className="p-5 space-y-4 text-xs text-gray-300 max-h-[680px] overflow-y-auto">
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Template Name *</label>
                      <input
                        type="text"
                        value={currentConfig.name}
                        onChange={(e) => setCurrentConfig({ ...currentConfig, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 font-medium mb-1">Paper Size</label>
                        <select
                          value={currentConfig.paperSize}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, paperSize: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        >
                          <option value="A4">A4 (210 x 297 mm)</option>
                          <option value="A5">A5</option>
                          <option value="Letter">Letter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-1">Orientation</label>
                        <select
                          value={currentConfig.orientation}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, orientation: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        >
                          <option value="Portrait">Portrait</option>
                          <option value="Landscape">Landscape</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 font-medium mb-1">Font Family</label>
                        <select
                          value={currentConfig.fontFamily}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, fontFamily: e.target.value })}
                          className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Arial">Arial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-1">Font Size (pt)</label>
                        <input
                          type="number"
                          value={currentConfig.fontSize}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, fontSize: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Header Background Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentConfig.headerBgColor}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, headerBgColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={currentConfig.headerBgColor}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, headerBgColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-[#20202B] border border-gray-700 rounded-lg text-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'header' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Document Title Text</label>
                      <input
                        type="text"
                        value={currentConfig.documentTitle}
                        onChange={(e) => setCurrentConfig({ ...currentConfig, documentTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentConfig.showLogo}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, showLogo: e.target.checked })}
                          className="rounded border-gray-700 text-[#887DB8]"
                        />
                        <span>Show Organization Logo in Header</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentConfig.showAddress}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, showAddress: e.target.checked })}
                          className="rounded border-gray-700 text-[#887DB8]"
                        />
                        <span>Show Company Registered Address</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentConfig.showGstin}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, showGstin: e.target.checked })}
                          className="rounded border-gray-700 text-[#887DB8]"
                        />
                        <span>Show GSTIN & PAN Details</span>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'total' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentConfig.showTotalInWords}
                        onChange={(e) => setCurrentConfig({ ...currentConfig, showTotalInWords: e.target.checked })}
                        className="rounded border-gray-700 text-[#887DB8]"
                      />
                      <span className="font-medium text-white">Show Total in Words (Indian Currency Format)</span>
                    </label>

                    <div className="pt-3 border-t border-gray-800 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentConfig.showSignature}
                          onChange={(e) => setCurrentConfig({ ...currentConfig, showSignature: e.target.checked })}
                          className="rounded border-gray-700 text-[#887DB8]"
                        />
                        <span className="font-medium text-white">Show Authorized Signature Section</span>
                      </label>

                      {currentConfig.showSignature && (
                        <div>
                          <label className="block text-gray-300 font-medium mb-1">Signature Label Text</label>
                          <input
                            type="text"
                            value={currentConfig.signatureLabel}
                            onChange={(e) => setCurrentConfig({ ...currentConfig, signatureLabel: e.target.value })}
                            className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Live Interactive Visual Document Preview */}
            <div className="lg:col-span-7 bg-[#181B24] p-6 rounded-2xl border border-gray-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold uppercase tracking-wider text-gray-300">Live Document Canvas Preview</span>
                <span>{currentConfig.paperSize} • {currentConfig.orientation}</span>
              </div>

              {/* Document Sheet Canvas */}
              <div
                className="bg-white rounded-lg shadow-2xl p-8 text-black min-h-[580px] space-y-6 transition-all"
                style={{
                  fontFamily: currentConfig.fontFamily,
                  color: currentConfig.fontColor,
                }}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: currentConfig.headerBgColor }}>
                  <div className="space-y-1">
                    {currentConfig.showLogo && (
                      <div className="flex items-center gap-2 font-black text-lg" style={{ color: currentConfig.headerBgColor }}>
                        <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                          H
                        </div>
                        <span>HENU OS PRIVATE LIMITED</span>
                      </div>
                    )}
                    {currentConfig.showAddress && (
                      <div className="text-[10px] text-gray-600 leading-tight">
                        <p>Second Floor, 10b-204, Pali Aasan Home, Bhagesar Road</p>
                        <p>Pali, Rajasthan - 306401, India</p>
                        <p>Phone: +91 8094100513 • contact@henuos.com</p>
                      </div>
                    )}
                    {currentConfig.showGstin && (
                      <p className="text-[10px] font-mono text-gray-700 font-semibold pt-0.5">
                        GSTIN: 08AAICH3195C1ZL • PAN: AAICH3195C
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black tracking-tight" style={{ color: currentConfig.headerBgColor }}>
                      {currentConfig.documentTitle}
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-800 mt-1"># INV-2026-0042</p>
                    <p className="text-[10px] text-gray-500">Date: May 20, 2026</p>
                    <p className="text-[10px] text-gray-500">Due Date: June 05, 2026</p>
                  </div>
                </div>

                {/* Bill To Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Billed To:</p>
                    <p className="font-bold text-gray-900 mt-0.5">Aero Dynamics Inc</p>
                    <p className="text-[11px] text-gray-600">Attn: Siddharth Rao</p>
                    <p className="text-[11px] text-gray-600">Level 4, Aerospace Tech Park, Bengaluru, Karnataka</p>
                    <p className="text-[10px] font-mono font-medium text-gray-700">GSTIN: 29ABCDE1234F2Z5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Place of Supply:</p>
                    <p className="font-bold text-gray-900 mt-0.5">Karnataka (29)</p>
                    <p className="text-[11px] text-gray-600">Payment Terms: Net 15</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-white" style={{ backgroundColor: currentConfig.headerBgColor }}>
                      <th className="py-2 px-2.5 font-bold">#</th>
                      <th className="py-2 px-2.5 font-bold">Item & Description</th>
                      <th className="py-2 px-2.5 font-bold">HSN/SAC</th>
                      <th className="py-2 px-2.5 text-right font-bold">Qty</th>
                      <th className="py-2 px-2.5 text-right font-bold">Rate</th>
                      <th className="py-2 px-2.5 text-right font-bold">Tax</th>
                      <th className="py-2 px-2.5 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    <tr>
                      <td className="py-2.5 px-2.5 font-mono text-[11px]">1</td>
                      <td className="py-2.5 px-2.5">
                        <p className="font-bold text-gray-900">Enterprise Cloud Architecture Topology</p>
                        <p className="text-[10px] text-gray-500">High-availability multi-region cloud topology design</p>
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[11px]">998313</td>
                      <td className="py-2.5 px-2.5 text-right">1</td>
                      <td className="py-2.5 px-2.5 text-right font-mono">$10,000.00</td>
                      <td className="py-2.5 px-2.5 text-right font-mono">18%</td>
                      <td className="py-2.5 px-2.5 text-right font-bold font-mono">$10,000.00</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals & Number in Words */}
                <div className="flex justify-between items-start pt-2">
                  <div className="max-w-xs space-y-2">
                    {currentConfig.showTotalInWords && (
                      <div className="p-2.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                        <span className="font-bold">Total in Words:</span>
                        <p className="italic font-medium">{numberToWordsIndian(11800, 'US Dollar')}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-56 space-y-1.5 text-xs text-right">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-medium">$10,000.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>IGST (18%):</span>
                      <span className="font-mono font-medium">$1,800.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-gray-900 border-t pt-1.5" style={{ borderColor: currentConfig.headerBgColor }}>
                      <span>Total:</span>
                      <span className="font-mono">$11,800.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs text-[#C96F61]">
                      <span>Balance Due:</span>
                      <span className="font-mono">$11,800.00</span>
                    </div>
                  </div>
                </div>

                {/* Signatures & Footer */}
                <div className="pt-6 flex justify-between items-end border-t border-gray-200 text-[10px] text-gray-500">
                  <div>
                    <p className="font-bold text-gray-700">Terms & Conditions:</p>
                    <p>18% GST Applicable • 60% advance to start, 40% before launch.</p>
                  </div>

                  {currentConfig.showSignature && (
                    <div className="text-center space-y-6">
                      <div className="border-b border-gray-400 w-36 mx-auto"></div>
                      <p className="font-bold text-gray-800">{currentConfig.signatureLabel}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
