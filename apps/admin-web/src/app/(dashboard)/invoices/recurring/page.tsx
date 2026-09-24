'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Repeat, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PauseCircle, 
  PlayCircle,
  MoreVertical,
  ArrowRight,
  Receipt
} from 'lucide-react';

interface RecurringProfile {
  id: string;
  profile_name: string;
  customer_name: string;
  repeat_every: string;
  repeat_interval: number;
  start_date: string;
  end_condition: string;
  total_amount: number;
  currency: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  next_run_date: string;
  auto_send: boolean;
}

export default function RecurringInvoicesPage() {
  const [profiles, setProfiles] = useState<RecurringProfile[]>([
    {
      id: 'rec_001',
      profile_name: 'Monthly Engineering Retainer',
      customer_name: 'Aero Dynamics Inc',
      repeat_every: 'MONTH',
      repeat_interval: 1,
      start_date: '2026-01-01',
      end_condition: 'NEVER',
      total_amount: 12500.00,
      currency: 'USD',
      status: 'ACTIVE',
      next_run_date: '2026-07-01',
      auto_send: true,
    },
    {
      id: 'rec_002',
      profile_name: 'Cloud Infrastructure Monitoring SLA',
      customer_name: 'Acme Global Ventures',
      repeat_every: 'MONTH',
      repeat_interval: 1,
      start_date: '2026-03-01',
      end_condition: 'AFTER_OCCURRENCES',
      total_amount: 4500.00,
      currency: 'USD',
      status: 'ACTIVE',
      next_run_date: '2026-07-01',
      auto_send: true,
    },
  ]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    profile_name: '',
    customer_name: 'Aero Dynamics Inc',
    repeat_every: 'MONTH',
    repeat_interval: 1,
    start_date: new Date().toISOString().split('T')[0],
    amount: 5000,
    auto_send: true,
  });

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfile.profile_name) return;

    const created: RecurringProfile = {
      id: `rec_${Date.now()}`,
      profile_name: newProfile.profile_name,
      customer_name: newProfile.customer_name,
      repeat_every: newProfile.repeat_every,
      repeat_interval: newProfile.repeat_interval,
      start_date: newProfile.start_date,
      end_condition: 'NEVER',
      total_amount: Number(newProfile.amount),
      currency: 'USD',
      status: 'ACTIVE',
      next_run_date: '2026-08-01',
      auto_send: newProfile.auto_send,
    };

    setProfiles([created, ...profiles]);
    setIsNewModalOpen(false);
    setNewProfile({
      profile_name: '',
      customer_name: 'Aero Dynamics Inc',
      repeat_every: 'MONTH',
      repeat_interval: 1,
      start_date: new Date().toISOString().split('T')[0],
      amount: 5000,
      auto_send: true,
    });
  };

  const toggleStatus = (id: string) => {
    setProfiles(
      profiles.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/invoices" className="text-gray-400 hover:text-white text-sm">Invoices</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white text-sm font-medium">Recurring</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Recurring Invoices</h1>
          <p className="text-xs text-gray-400">Automate recurring billing cycles and scheduled invoice generation</p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Recurring Profile
        </button>
      </div>

      {/* Profiles Table */}
      <div className="bg-[#181B24] rounded-xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recurring profiles..."
              className="w-full pl-9 pr-4 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#887DB8]"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{profiles.length} Total Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#20202B]/40 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Profile Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Frequency</th>
                <th className="py-3.5 px-4">Next Run Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-[#20202B]/50 transition">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{profile.profile_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Auto-send: {profile.auto_send ? 'Enabled' : 'Draft only'}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{profile.customer_name}</td>
                  <td className="py-4 px-4 text-gray-300">
                    Every {profile.repeat_interval} {profile.repeat_every.toLowerCase()}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#887DB8]" />
                      <span>{profile.next_run_date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">
                    ${profile.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        profile.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {profile.status === 'ACTIVE' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <PauseCircle className="w-3 h-3" />
                      )}
                      {profile.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(profile.id)}
                      className="px-2.5 py-1 rounded bg-[#20202B] hover:bg-[#2E2E37] text-xs font-medium text-gray-300 hover:text-white border border-gray-700 transition"
                    >
                      {profile.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Recurring Profile Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#181B24] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#20202B]/40">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Repeat className="w-5 h-5 text-[#887DB8]" />
                <span>Create Recurring Invoice Profile</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Profile Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Dedicated Engineering Retainer"
                  value={newProfile.profile_name}
                  onChange={(e) => setNewProfile({ ...newProfile, profile_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Repeat Every *</label>
                  <select
                    value={newProfile.repeat_every}
                    onChange={(e) => setNewProfile({ ...newProfile, repeat_every: e.target.value })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  >
                    <option value="WEEK">Week</option>
                    <option value="MONTH">Month</option>
                    <option value="YEAR">Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newProfile.amount}
                    onChange={(e) => setNewProfile({ ...newProfile, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Customer</label>
                <select
                  value={newProfile.customer_name}
                  onChange={(e) => setNewProfile({ ...newProfile, customer_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#20202B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#887DB8]"
                >
                  <option value="Aero Dynamics Inc">Aero Dynamics Inc</option>
                  <option value="Acme Global Ventures">Acme Global Ventures</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="auto_send"
                  checked={newProfile.auto_send}
                  onChange={(e) => setNewProfile({ ...newProfile, auto_send: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-[#20202B] text-[#887DB8] focus:ring-0"
                />
                <label htmlFor="auto_send" className="text-xs text-gray-300">
                  Automatically send generated invoice to customer email and mobile portal
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#887DB8] hover:bg-[#776ca7] text-white text-sm font-medium"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
