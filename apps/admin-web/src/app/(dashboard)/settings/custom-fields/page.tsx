'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  Plus, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Edit3, 
  Power, 
  Check, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface CustomField {
  id: string;
  field_name: string;
  data_type: 'Text Box (Single Line)' | 'Text Box (Multi-line)' | 'Numeric' | 'Dropdown' | 'Date' | 'Checkbox';
  module: 'All' | 'Quotes' | 'Invoices' | 'Customers' | 'Credit Notes';
  mandatory: boolean;
  show_in_pdf: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: 'cf_001',
      field_name: 'Terms & Conditions',
      data_type: 'Text Box (Multi-line)',
      module: 'All',
      mandatory: false,
      show_in_pdf: true,
      status: 'ACTIVE',
    },
    {
      id: 'cf_002',
      field_name: 'Salesperson',
      data_type: 'Text Box (Single Line)',
      module: 'All',
      mandatory: false,
      show_in_pdf: true,
      status: 'ACTIVE',
    },
    {
      id: 'cf_003',
      field_name: 'Subject',
      data_type: 'Text Box (Single Line)',
      module: 'All',
      mandatory: false,
      show_in_pdf: true,
      status: 'ACTIVE',
    },
    {
      id: 'cf_004',
      field_name: 'Purchase Order (PO) Number',
      data_type: 'Text Box (Single Line)',
      module: 'Invoices',
      mandatory: false,
      show_in_pdf: true,
      status: 'ACTIVE',
    },
    {
      id: 'cf_005',
      field_name: 'Delivery Due Date',
      data_type: 'Date',
      module: 'Quotes',
      mandatory: false,
      show_in_pdf: true,
      status: 'ACTIVE',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    field_name: '',
    data_type: 'Text Box (Single Line)' as CustomField['data_type'],
    module: 'All' as CustomField['module'],
    mandatory: false,
    show_in_pdf: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenNew = () => {
    setEditingFieldId(null);
    setFormData({
      field_name: '',
      data_type: 'Text Box (Single Line)',
      module: 'All',
      mandatory: false,
      show_in_pdf: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (field: CustomField) => {
    setEditingFieldId(field.id);
    setFormData({
      field_name: field.field_name,
      data_type: field.data_type,
      module: field.module,
      mandatory: field.mandatory,
      show_in_pdf: field.show_in_pdf,
    });
    setIsModalOpen(true);
  };

  const toggleStatus = (id: string) => {
    setFields(
      fields.map((f) => {
        if (f.id === id) {
          const newStatus = f.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`Field "${f.field_name}" set to ${newStatus}`);
          return { ...f, status: newStatus };
        }
        return f;
      })
    );
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.field_name) return;

    if (editingFieldId) {
      setFields(
        fields.map((f) =>
          f.id === editingFieldId
            ? {
                ...f,
                field_name: formData.field_name,
                data_type: formData.data_type,
                module: formData.module,
                mandatory: formData.mandatory,
                show_in_pdf: formData.show_in_pdf,
              }
            : f
        )
      );
      showToast(`Custom field "${formData.field_name}" updated successfully`);
    } else {
      const newField: CustomField = {
        id: `cf_${Date.now()}`,
        field_name: formData.field_name,
        data_type: formData.data_type,
        module: formData.module,
        mandatory: formData.mandatory,
        show_in_pdf: formData.show_in_pdf,
        status: 'ACTIVE',
      };
      setFields([...fields, newField]);
      showToast(`New custom field "${formData.field_name}" created`);
    }

    setIsModalOpen(false);
  };

  const filteredFields = fields.filter((f) =>
    f.field_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/settings" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Settings
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Custom Fields & Preferences</span>
        </div>
        {toastMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-[#887DB8]" />
            Custom Fields & Preferences
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Define custom transaction attributes and manage visibility across quotes, invoices, and PDF outputs
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#887DB8] hover:bg-[#776ca7] text-white font-semibold text-sm transition shadow-lg shadow-[#887DB8]/20"
        >
          <Plus className="w-4 h-4" />
          + New Custom Field
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#181B24] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4 bg-[#20202B]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search custom fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#20202B] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#887DB8]"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {filteredFields.length} Configured Fields
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/60 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-5">Field Name</th>
                <th className="py-3.5 px-4">Data Type</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4 text-center">Mandatory</th>
                <th className="py-3.5 px-4 text-center">Show in All PDFs</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">More Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredFields.map((f) => (
                <tr key={f.id} className="hover:bg-[#20202B]/40 transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-[#887DB8]" />
                      <span className="font-semibold text-white">{f.field_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300 font-mono text-xs">{f.data_type}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#20202B] border border-gray-700 text-xs text-gray-300">
                      {f.module}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {f.mandatory ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">No</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {f.show_in_pdf ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">No</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        f.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="px-2.5 py-1 rounded-lg bg-[#20202B] hover:bg-[#2E2E37] text-xs font-medium text-gray-300 hover:text-white border border-gray-700 transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(f.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                          f.status === 'ACTIVE'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {f.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New / Edit Custom Field */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#20202B]/40">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sliders className="w-5 h-5 text-[#887DB8]" />
                <span>{editingFieldId ? 'Edit Custom Field' : 'Create Custom Field'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Field Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchase Order (PO) Number"
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Data Type *</label>
                  <select
                    value={formData.data_type}
                    onChange={(e) => setFormData({ ...formData, data_type: e.target.value as CustomField['data_type'] })}
                    className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="Text Box (Single Line)">Text Box (Single Line)</option>
                    <option value="Text Box (Multi-line)">Text Box (Multi-line)</option>
                    <option value="Numeric">Numeric</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Date">Date</option>
                    <option value="Checkbox">Checkbox</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Applicable Module</label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value as CustomField['module'] })}
                    className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="All">All Transactions</option>
                    <option value="Quotes">Quotes & Estimates</option>
                    <option value="Invoices">Invoices</option>
                    <option value="Customers">Customers</option>
                    <option value="Credit Notes">Credit Notes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mandatory"
                    checked={formData.mandatory}
                    onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                  />
                  <label htmlFor="mandatory" className="text-xs text-gray-300 font-medium">
                    Mandatory (Required before saving transaction)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_in_pdf"
                    checked={formData.show_in_pdf}
                    onChange={(e) => setFormData({ ...formData, show_in_pdf: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                  />
                  <label htmlFor="show_in_pdf" className="text-xs text-gray-300 font-medium">
                    Show in PDF exports and printed templates
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-semibold transition"
                >
                  {editingFieldId ? 'Save Changes' : 'Create Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
