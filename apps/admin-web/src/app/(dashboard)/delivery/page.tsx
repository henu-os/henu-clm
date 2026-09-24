'use client';

import * as React from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  CheckSquare, 
  FileText, 
  ArrowUpRight,
  Plus,
  Trash2,
  MoreVertical,
  Download,
  Eye,
  Send,
  Edit3,
  Printer,
  FileSpreadsheet,
  Layers,
  Save,
  Check,
  Paperclip,
  Upload,
  Settings,
  ChevronDown,
  MessageSquare,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'ACCEPTED';
  dueDate: string;
  percentage: number;
}

export interface RemarkAddon {
  id: string;
  title: string;
  type: 'SCOPE_ADDON' | 'DELIVERY_REMARK' | 'TECHNICAL_NOTE';
  amount?: number;
  author: string;
  timestamp: string;
  note: string;
  status: 'APPROVED' | 'PENDING' | 'LOGGED';
}

export interface ProjectDeliveryRecord {
  id: string;
  order_number: string;
  project_title: string;
  client_name: string;
  client_company: string;
  contract_value: number;
  currency: string;
  progress: number;
  linked_invoice_number: string;
  linked_invoice_id: string;
  status: 'IN_PROGRESS' | 'MILESTONE_DELIVERED' | 'UNDER_REVIEW' | 'COMPLETED' | 'BLOCKED';
  target_delivery_date: string;
  milestones: MilestoneItem[];
  remarks_addons: RemarkAddon[];
}

const INITIAL_PROJECT_RECORDS: ProjectDeliveryRecord[] = [
  {
    id: 'prj_001',
    order_number: 'HENU-ORD-2026-000089',
    project_title: 'Custom Global CLM Integration & Multi-Tenancy Architecture',
    client_name: 'Alexander Wright',
    client_company: 'Apex Global Technologies',
    contract_value: 342500,
    currency: 'INR',
    progress: 65,
    linked_invoice_number: 'HENU-INV-2026-000312',
    linked_invoice_id: 'inv_001',
    status: 'IN_PROGRESS',
    target_delivery_date: '2026-10-15',
    milestones: [
      { id: 'm1', title: 'Architecture Blueprint & RLS Schema', description: 'Supabase PostgreSQL multi-tenant isolation', status: 'COMPLETED', dueDate: '2026-09-28', percentage: 25 },
      { id: 'm2', title: 'Admin Web & Accounting Engine', description: 'Full Zoho Books matching line items and invoice workflows', status: 'COMPLETED', dueDate: '2026-10-05', percentage: 25 },
      { id: 'm3', title: 'Flutter Mobile App Client Sync', description: 'Realtime quotes, approvals, and push telemetry', status: 'IN_PROGRESS', dueDate: '2026-10-10', percentage: 25 },
      { id: 'm4', title: 'Automated E2E QA & Docker Deployment', description: 'Production docker compose & multi-region telemetry', status: 'PENDING', dueDate: '2026-10-15', percentage: 25 },
    ],
    remarks_addons: [
      { id: 'ra1', title: 'SAML 2.0 Single Sign-On Add-on', type: 'SCOPE_ADDON', amount: 45000, author: 'Aarav Sharma', timestamp: '2026-09-22 14:30', note: 'Customer requested enterprise Okta/Azure AD SSO federation integration.', status: 'APPROVED' },
      { id: 'ra2', title: 'Telemetry Ingestion Rate Spike Notice', type: 'TECHNICAL_NOTE', author: 'DevOps Lead', timestamp: '2026-09-23 18:10', note: 'Configured Redis queue buffering to ensure zero drop during flash quotes surges.', status: 'LOGGED' }
    ]
  },
  {
    id: 'prj_002',
    order_number: 'HENU-ORD-2026-000090',
    project_title: 'Ethereal Particle Canvas & Live Telemetry Stream',
    client_name: 'Elena Rostova',
    client_company: 'Vanguard Dynamics',
    contract_value: 220000,
    currency: 'INR',
    progress: 40,
    linked_invoice_number: 'HENU-INV-2026-000313',
    linked_invoice_id: 'inv_002',
    status: 'IN_PROGRESS',
    target_delivery_date: '2026-10-20',
    milestones: [
      { id: 'm201', title: 'Canvas Rendering Shaders', description: 'WebGL high-performance 60fps animations', status: 'COMPLETED', dueDate: '2026-10-02', percentage: 40 },
      { id: 'm202', title: 'Telemetry WebSocket Pipe', description: 'Low latency sub-50ms event stream', status: 'IN_PROGRESS', dueDate: '2026-10-12', percentage: 30 },
      { id: 'm203', title: 'Cross-platform Mobile Embedding', description: 'Flutter shader integration for iOS and Android', status: 'PENDING', dueDate: '2026-10-20', percentage: 30 },
    ],
    remarks_addons: [
      { id: 'ra201', title: 'Dedicated NVMe Snapshot Storage', type: 'SCOPE_ADDON', amount: 28000, author: 'Elena Rostova', timestamp: '2026-09-24 09:15', note: 'Added high performance NVMe snapshot storage volume.', status: 'APPROVED' }
    ]
  },
  {
    id: 'prj_003',
    order_number: 'HENU-ORD-2026-000091',
    project_title: 'Logistics Fleet Security Audit & PostgreSQL RLS',
    client_name: 'Vikram Mehta',
    client_company: 'Zenith Logistics Ltd',
    contract_value: 295000,
    currency: 'INR',
    progress: 100,
    linked_invoice_number: 'HENU-INV-2026-000314',
    linked_invoice_id: 'inv_003',
    status: 'COMPLETED',
    target_delivery_date: '2026-09-20',
    milestones: [
      { id: 'm301', title: 'Vulnerability Assessment', description: 'Full static and dynamic pentest audit', status: 'COMPLETED', dueDate: '2026-09-10', percentage: 50 },
      { id: 'm302', title: 'Row Level Security Implementation', description: 'Zero trust tenant partition rules', status: 'COMPLETED', dueDate: '2026-09-18', percentage: 30 },
      { id: 'm303', title: 'Compliance Signoff & Certification', description: 'SOC2 and ISO 27001 readiness audit', status: 'COMPLETED', dueDate: '2026-09-20', percentage: 20 },
    ],
    remarks_addons: [
      { id: 'ra301', title: 'Final Handover Signoff', type: 'DELIVERY_REMARK', author: 'Vikram Mehta', timestamp: '2026-09-21 11:00', note: 'All penetration tests passed with zero high-severity findings.', status: 'APPROVED' }
    ]
  }
];

export default function ProjectDeliveryPage() {
  const [projects, setProjects] = React.useState<ProjectDeliveryRecord[]>(INITIAL_PROJECT_RECORDS);
  const [filterStatus, setFilterStatus] = React.useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [selectedProject, setSelectedProject] = React.useState<ProjectDeliveryRecord | null>(null);
  const [activeRemarkModalProject, setActiveRemarkModalProject] = React.useState<ProjectDeliveryRecord | null>(null);
  const [activeMilestoneModalProject, setActiveMilestoneModalProject] = React.useState<ProjectDeliveryRecord | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);

  // New Addon / Remark Form State
  const [newRemarkTitle, setNewRemarkTitle] = React.useState('');
  const [newRemarkType, setNewRemarkType] = React.useState<'SCOPE_ADDON' | 'DELIVERY_REMARK' | 'TECHNICAL_NOTE'>('SCOPE_ADDON');
  const [newRemarkAmount, setNewRemarkAmount] = React.useState<string>('0');
  const [newRemarkNote, setNewRemarkNote] = React.useState('');
  
  const { showToast } = useToast();

  const handleAddRemarkAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRemarkModalProject || !newRemarkTitle || !newRemarkNote) return;

    const newAddon: RemarkAddon = {
      id: `ra_${Date.now()}`,
      title: newRemarkTitle,
      type: newRemarkType,
      amount: newRemarkType === 'SCOPE_ADDON' ? parseFloat(newRemarkAmount) || 0 : undefined,
      author: 'Aarav Sharma (Admin)',
      timestamp: new Date().toLocaleString(),
      note: newRemarkNote,
      status: 'APPROVED'
    };

    const updatedProjects = projects.map(p => {
      if (p.id === activeRemarkModalProject.id) {
        return {
          ...p,
          contract_value: newAddon.amount ? p.contract_value + newAddon.amount : p.contract_value,
          remarks_addons: [newAddon, ...p.remarks_addons]
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setActiveRemarkModalProject(null);
    setNewRemarkTitle('');
    setNewRemarkAmount('0');
    setNewRemarkNote('');
    showToast('success', 'Addon / Remark Logged', `Successfully updated project record with ${newAddon.title}`);
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextStatus: MilestoneItem['status'] = m.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
            return { ...m, status: nextStatus };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.status === 'COMPLETED').length;
        const total = updatedMilestones.length;
        const newProgress = Math.round((completedCount / total) * 100);
        const nextStatus = newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress,
          status: nextStatus as any
        };
      }
      return p;
    });

    setProjects(updated);
    if (activeMilestoneModalProject && activeMilestoneModalProject.id === projectId) {
      const current = updated.find(p => p.id === projectId) || null;
      setActiveMilestoneModalProject(current);
    }
    showToast('success', 'Milestone Updated', 'Project progress recalculated in real-time.');
  };

  const filteredProjects = projects.filter(p => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'IN_PROGRESS') return p.status === 'IN_PROGRESS';
    if (filterStatus === 'COMPLETED') return p.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Project Delivery & Milestones</h1>
          <p className="text-xs text-on-surface-variant">
            Track client delivery progression, milestone certifications, contract values, linked billing, and scope change remark add-ons.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => showToast('info', 'Exporting Delivery Telemetry', 'Generating Excel & PDF progression audit log...')}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Audit Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Active Deliveries</p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {projects.filter(p => p.status === 'IN_PROGRESS').length} Projects
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Contract Portfolio</p>
            <p className="text-2xl font-bold text-primary mt-1">
              ₹{projects.reduce((sum, p) => sum + p.contract_value, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Avg Progression</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Completed / Signed Off</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {projects.filter(p => p.status === 'COMPLETED').length} Finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
            filterStatus === 'ALL'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          All Deliveries ({projects.length})
        </button>
        <button
          onClick={() => setFilterStatus('IN_PROGRESS')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
            filterStatus === 'IN_PROGRESS'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          In Progress ({projects.filter(p => p.status === 'IN_PROGRESS').length})
        </button>
        <button
          onClick={() => setFilterStatus('COMPLETED')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
            filterStatus === 'COMPLETED'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Completed ({projects.filter(p => p.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Main Delivery Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/60">
              <TableHead className="text-xs uppercase font-semibold">Order Number</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Project Title / Client</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Contract Value</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Progress</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Milestones</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Linked Invoice</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
              <TableHead className="text-xs uppercase font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((p) => {
              const completedMilestones = p.milestones.filter(m => m.status === 'COMPLETED').length;
              return (
                <TableRow key={p.id} className="hover:bg-surface-container-low/40 transition">
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {p.order_number}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-xs text-on-surface">{p.project_title}</div>
                    <div className="text-[11px] text-outline">{p.client_name} ({p.client_company})</div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-on-surface font-mono">
                    ₹{p.contract_value.toLocaleString()}
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface mb-1">
                      <span>{p.progress}% Complete</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          p.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                        }`} 
                        style={{ width: `${p.progress}%` }} 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setActiveMilestoneModalProject(p)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container-high hover:bg-primary/10 hover:text-primary transition text-on-surface"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                      <span>{completedMilestones} of {p.milestones.length} Completed</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <a
                      href="/invoices"
                      className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
                    >
                      <span>{p.linked_invoice_number}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {p.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative inline-block text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setActiveRemarkModalProject(p)}
                        >
                          <Tag className="w-3.5 h-3.5 mr-1 text-primary" />
                          <span>Remarks & Addons</span>
                        </Button>
                        <button
                          onClick={() => setActiveActionMenuId(activeActionMenuId === p.id ? null : p.id)}
                          className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {activeActionMenuId === p.id && (
                        <div className="absolute right-0 mt-1 w-52 bg-surface-container-lowest border border-outline-variant/80 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-xs text-left">
                          <button
                            onClick={() => {
                              setActiveMilestoneModalProject(p);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <CheckSquare className="w-3.5 h-3.5 text-secondary" />
                            <span>Certify Milestones</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveRemarkModalProject(p);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <Plus className="w-3.5 h-3.5 text-primary" />
                            <span>Add Scope Change / Addon</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('success', 'PDF Delivery Summary', `Exporting delivery telemetry for ${p.order_number}`);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <Download className="w-3.5 h-3.5 text-outline" />
                            <span>Download Delivery PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('success', 'Notification Sent', `Milestone report emailed to ${p.client_name}`);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <Send className="w-3.5 h-3.5 text-primary" />
                            <span>Email Progress to Client</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* MILESTONE CERTIFICATION MODAL */}
      {activeMilestoneModalProject && (
        <Modal
          isOpen={true}
          onClose={() => setActiveMilestoneModalProject(null)}
          title={`Project Milestones — ${activeMilestoneModalProject.order_number}`}
          description={`Review and certify delivery milestones for ${activeMilestoneModalProject.project_title}`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-surface-container-low p-3.5 rounded-lg flex items-center justify-between border border-outline-variant/50">
              <div>
                <p className="font-semibold text-on-surface">Client: {activeMilestoneModalProject.client_name} ({activeMilestoneModalProject.client_company})</p>
                <p className="text-[11px] text-outline">Target Handover: {activeMilestoneModalProject.target_delivery_date}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">{activeMilestoneModalProject.progress}% Finished</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeMilestoneModalProject.milestones.map((m, idx) => (
                <div 
                  key={m.id}
                  className="p-3 bg-surface-container-lowest border border-outline-variant/60 rounded-lg flex items-start justify-between gap-3 hover:border-primary/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(activeMilestoneModalProject.id, m.id)}
                      className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition ${
                        m.status === 'COMPLETED'
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'border-outline hover:border-primary'
                      }`}
                    >
                      {m.status === 'COMPLETED' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <p className={`font-semibold text-xs ${m.status === 'COMPLETED' ? 'line-through text-outline' : 'text-on-surface'}`}>
                        {idx + 1}. {m.title}
                      </p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{m.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-outline">
                        <span>Due: {m.dueDate}</span>
                        <span>•</span>
                        <span>Weight: {m.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={m.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-outline-variant/40">
              <Button onClick={() => setActiveMilestoneModalProject(null)}>
                Done & Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* REMARKS & ADDONS MODAL */}
      {activeRemarkModalProject && (
        <Modal
          isOpen={true}
          onClose={() => setActiveRemarkModalProject(null)}
          title={`Remarks & Addons — ${activeRemarkModalProject.order_number}`}
          description={`Log scope expansion add-ons, client change requests, and technical engineering notes`}
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Existing Remarks List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <p className="font-semibold text-outline uppercase tracking-wider text-[11px]">Logged Addons & Remarks History</p>
              {activeRemarkModalProject.remarks_addons.length === 0 ? (
                <div className="p-4 text-center text-outline bg-surface-container-low rounded-lg border border-outline-variant/40">
                  No add-on requests or delivery remarks logged yet.
                </div>
              ) : (
                activeRemarkModalProject.remarks_addons.map((ra) => (
                  <div 
                    key={ra.id}
                    className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface flex items-center gap-2">
                        {ra.title}
                        {ra.amount ? (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                            +₹{ra.amount.toLocaleString()}
                          </span>
                        ) : null}
                      </span>
                      <Badge variant="primary">{ra.type.replace(/_/g, ' ')}</Badge>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">{ra.note}</p>
                    <div className="flex items-center justify-between text-[10px] text-outline pt-1">
                      <span>Logged by: {ra.author}</span>
                      <span>{ra.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Log New Addon Form */}
            <form onSubmit={handleAddRemarkAddon} className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl space-y-3">
              <p className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-primary" />
                Add New Scope Addon / Delivery Remark
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-outline mb-1 text-[11px]">Addon / Remark Title *</label>
                  <input
                    type="text"
                    required
                    value={newRemarkTitle}
                    onChange={(e) => setNewRemarkTitle(e.target.value)}
                    placeholder="e.g. Dedicated Staging Server Addon"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-outline mb-1 text-[11px]">Type</label>
                  <select
                    value={newRemarkType}
                    onChange={(e) => setNewRemarkType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="SCOPE_ADDON">Scope Addon (Billable)</option>
                    <option value="DELIVERY_REMARK">Delivery Remark</option>
                    <option value="TECHNICAL_NOTE">Technical Note</option>
                  </select>
                </div>
              </div>

              {newRemarkType === 'SCOPE_ADDON' && (
                <div>
                  <label className="block font-medium text-outline mb-1 text-[11px]">Additional Addon Amount (₹)</label>
                  <input
                    type="number"
                    value={newRemarkAmount}
                    onChange={(e) => setNewRemarkAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium text-outline mb-1 text-[11px]">Remark Notes & Scope Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newRemarkNote}
                  onChange={(e) => setNewRemarkNote(e.target.value)}
                  placeholder="Details regarding the scope change, client approval, and technical considerations..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveRemarkModalProject(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Addon & Update Contract
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
