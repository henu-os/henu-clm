'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Upload, 
  Save, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Trash2,
  ArrowLeft
} from 'lucide-react';

export default function OrganizationSettingsPage() {
  const [formData, setFormData] = useState({
    name: 'HENU OS PRIVATE LIMITED',
    industry: 'Technology',
    street1: 'Second Floor, 10b-204',
    street2: 'Pali Aasan Home, Bhagesar Road',
    city: 'Pali',
    state: 'Rajasthan',
    postalCode: '306401',
    country: 'India',
    phone: '8094100513',
    fax: '',
    email: 'contact@henuos.com',
    website: 'https://henu-build.netlify.app/',
    gstin: '08AAICH3195C1ZL',
    pan: 'AAICH3195C',
    logoUrl: '/logo.svg',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logoUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/settings" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Settings
          </Link>
          <span>/</span>
          <span className="text-white font-medium">Organization Profile</span>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            Organization profile saved successfully!
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#887DB8]" />
            Organization Profile
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure legal entity details, tax identification, and branding for invoices and quotes
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#887DB8] hover:bg-[#776ca7] text-white font-semibold text-sm transition shadow-lg shadow-[#887DB8]/20"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Logo & Branding */}
        <div className="space-y-6">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#887DB8]" />
              Company Logo
            </h3>
            
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 hover:border-[#887DB8] rounded-xl bg-[#20202B]/50 transition text-center group relative">
              {logoPreview ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="w-32 h-32 bg-white/5 rounded-xl p-2 border border-gray-700 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Organization Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium py-1 px-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#887DB8]/10 text-[#887DB8] flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <label htmlFor="logo-upload" className="cursor-pointer text-sm font-semibold text-[#887DB8] hover:underline">
                      Upload Logo
                    </label>
                    <input 
                      id="logo-upload" 
                      type="file" 
                      accept="image/png, image/jpeg, image/gif, image/svg+xml" 
                      className="hidden" 
                      onChange={handleLogoUpload} 
                    />
                    <p className="text-[11px] text-gray-500 mt-1">240 x 240 px @ 72 DPI, Max 1MB</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              This logo will automatically appear on Tax Invoices, Quotations, and Payment Receipts.
            </p>
          </div>

          {/* Tax Identification Card */}
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#887DB8]" />
              Tax Identification
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">GSTIN / UIN *</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="e.g. 08AAICH3195C1ZL"
                className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-[#887DB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Permanent Account Number (PAN) *</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="e.g. AAICH3195C"
                className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-[#887DB8]"
              />
            </div>
          </div>
        </div>

        {/* Right Columns: Primary Details & Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-800">
              <Building2 className="w-4 h-4 text-[#887DB8]" />
              Entity Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Organization Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Consulting">Consulting & Professional Services</option>
                  <option value="Creative">Creative Agency & Media</option>
                  <option value="Manufacturing">Manufacturing & Industrial</option>
                  <option value="Retail">Retail & E-commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registered Address */}
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-800">
              <MapPin className="w-4 h-4 text-[#887DB8]" />
              Registered Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address Line 1 *</label>
                <input
                  type="text"
                  name="street1"
                  required
                  value={formData.street1}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address Line 2</label>
                <input
                  type="text"
                  name="street2"
                  value={formData.street2}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">State / Province *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Postal / Zip Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Country *</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#20202B] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#887DB8]"
                />
              </div>
            </div>
          </div>

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
              Save Organization Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
