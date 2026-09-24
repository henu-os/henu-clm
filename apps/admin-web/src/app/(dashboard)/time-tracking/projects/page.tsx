'use client';

import * as React from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Download, 
  Search, 
  MoreVertical, 
  Edit3, 
  DollarSign, 
  CheckSquare, 
  FileText,
  Import,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { downloadDocumentFile } from '@/lib/download';

export interface ProjectTaskItem {
  id: string;
  name: string;
  description: string;
  billable: boolean;
  logged_hours: number;
}

export interface AssignedUser {
  id: string;
  name: string;
  email: string;
  hourly_rate?: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  code: string;
  customer_name: string;
  billing_method: 'FIXED_COST' | 'PROJECT_HOURS' | 'TASK_HOURS' | 'STAFF_HOURS';
  description: string;
  cost_budget: number;
  revenue_budget: number;
  watchlist: boolean;
  users: AssignedUser[];
  tasks: ProjectTaskItem[];
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  created_at: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj_101',
    name: 'Enterprise Cloud Security & Zero-Trust RLS',
    code: 'PRJ-2026-001',
    customer_name: 'Apex Global Technologies',
    billing_method: 'FIXED_COST',
    description: 'Complete multi-tenant security architecture and Supabase RLS policies audit.',
    cost_budget: 150000,
    revenue_budget: 342500,
    watchlist: true,
    users: [
      { id: 'u1', name: 'HENU OS PRIVATE LIMITED', email: 'henuosr@gmail.com' },
      { id: 'u2', name: 'Aarav Sharma', email: 'aarav@henu.io', hourly_rate: 1500 }
    ],
    tasks: [
      { id: 't1', name: 'Architecture Blueprinting', description: 'Database schema & RLS matrix design', billable: true, logged_hours: 24.5 },
      { id: 't2', name: 'Automated E2E Pentest Execution', description: 'Vulnerability scan and verification', billable: true, logged_hours: 18.0 }
    ],
    status: 'ACTIVE',
    created_at: '2026-09-01'
  },
  {
    id: 'prj_102',
    name: 'Real-Time Financial Telemetry & Accounting Engine',
    code: 'PRJ-2026-002',
    customer_name: 'Vanguard Dynamics',
    billing_method: 'TASK_HOURS',
    description: 'Zoho Books matching accounting engine with double-entry ledgers and decimal calculations.',
    cost_budget: 120000,
    revenue_budget: 280000,
    watchlist: true,
    users: [
      { id: 'u1', name: 'HENU OS PRIVATE LIMITED', email: 'henuosr@gmail.com' }
    ],
    tasks: [
      { id: 't3', name: 'Ledger Engine Implementation', description: 'PostgreSQL stored procedures & real-time streams', billable: true, logged_hours: 42.0 },
      { id: 't4', name: 'Client Portal Synchronization', description: 'Flutter mobile & web sync', billable: true, logged_hours: 31.5 }
    ],
    status: 'ACTIVE',
    created_at: '2026-09-10'
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = React.useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { showToast } = useToast();

  // New Project Form State
  const [projectForm, setProjectForm] = React.useState({
    name: '',
    code: `PRJ-${Date.now().toString().slice(-4)}`,
    customer_name: 'Apex Global Technologies',
    billing_method: 'FIXED_COST' as ProjectItem['billing_method'],
    description: '',
    cost_budget: 0,
    revenue_budget: 0,
    watchlist: false,
    users: [
      { id: 'def_user', name: 'HENU OS PRIVATE LIMITED', email: 'henuosr@gmail.com' }
    ] as AssignedUser[],
    tasks: [
      { id: 't_def', name: 'Core Deliverables Execution', description: 'Main project milestone deliverables', billable: true, logged_hours: 0 }
    ] as ProjectTaskItem[]
  });

  const handleAddUserRow = () => {
    const newUser: AssignedUser = {
      id: `usr_${Date.now()}`,
      name: 'Team Member',
      email: 'engineer@henu.io'
    };
    setProjectForm({ ...projectForm, users: [...projectForm.users, newUser] });
  };

  const handleRemoveUserRow = (id: string) => {
    if (projectForm.users.length <= 1) return;
    setProjectForm({ ...projectForm, users: projectForm.users.filter(u => u.id !== id) });
  };

  const handleAddTaskRow = () => {
    const newTask: ProjectTaskItem = {
      id: `tsk_${Date.now()}`,
      name: '',
      description: '',
      billable: true,
      logged_hours: 0
    };
    setProjectForm({ ...projectForm, tasks: [...projectForm.tasks, newTask] });
  };

  const handleRemoveTaskRow = (id: string) => {
    if (projectForm.tasks.length <= 1) return;
    setProjectForm({ ...projectForm, tasks: projectForm.tasks.filter(t => t.id !== id) });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.customer_name) {
      showToast('error', 'Required Fields Missing', 'Please provide project name and customer.');
      return;
    }

    const created: ProjectItem = {
      id: `prj_${Date.now()}`,
      name: projectForm.name,
      code: projectForm.code || `PRJ-${Date.now().toString().slice(-4)}`,
      customer_name: projectForm.customer_name,
      billing_method: projectForm.billing_method,
      description: projectForm.description,
      cost_budget: Number(projectForm.cost_budget) || 0,
      revenue_budget: Number(projectForm.revenue_budget) || 0,
      watchlist: projectForm.watchlist,
      users: projectForm.users,
      tasks: projectForm.tasks.filter(t => t.name.trim().length > 0),
      status: 'ACTIVE',
      created_at: new Date().toISOString().split('T')[0]
    };

    setProjects([created, ...projects]);
    setIsNewProjectModalOpen(false);
    showToast('success', 'Project Created', `Project "${created.name}" (${created.code}) initialized successfully.`);
    setProjectForm({
      name: '',
      code: `PRJ-${Date.now().toString().slice(-4)}`,
      customer_name: 'Apex Global Technologies',
      billing_method: 'FIXED_COST',
      description: '',
      cost_budget: 0,
      revenue_budget: 0,
      watchlist: false,
      users: [{ id: 'def_user', name: 'HENU OS PRIVATE LIMITED', email: 'henuosr@gmail.com' }],
      tasks: [{ id: 't_def', name: 'Core Deliverables Execution', description: 'Main project milestone deliverables', billable: true, logged_hours: 0 }]
    });
  };

  const handleDeleteProject = (id: string, name: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setActiveActionMenuId(null);
    showToast('info', 'Project Deleted', `Project "${name}" was removed.`);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Projects (Time Tracking)</h1>
          <p className="text-xs text-on-surface-variant">
            Create projects, assign billing methods, define tasks, track team hours, and manage budgets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={() => setIsNewProjectModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>+ New Project</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Active Projects</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{projects.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Revenue Budget</p>
            <p className="text-2xl font-bold text-primary mt-1">
              ₹{projects.reduce((acc, p) => acc + p.revenue_budget, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Logged Hours</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              {projects.reduce((acc, p) => acc + p.tasks.reduce((sum, t) => sum + t.logged_hours, 0), 0).toFixed(1)} hrs
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Dashboard Watchlist</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {projects.filter(p => p.watchlist).length} Active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl flex items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, code, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-outline">{filteredProjects.length} Projects</span>
      </div>

      {/* Projects Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/60">
              <TableHead className="text-xs uppercase font-semibold">Project Code & Name</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Customer</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Billing Method</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Logged Time</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Budget (Cost / Revenue)</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Assigned Team</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
              <TableHead className="text-xs uppercase font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((proj) => {
              const totalHours = proj.tasks.reduce((acc, t) => acc + t.logged_hours, 0);
              return (
                <TableRow key={proj.id} className="hover:bg-surface-container-low/40 transition">
                  <TableCell>
                    <div className="font-semibold text-xs text-on-surface">{proj.name}</div>
                    <div className="text-[11px] font-mono text-primary">{proj.code}</div>
                  </TableCell>
                  <TableCell className="text-xs text-on-surface font-medium">
                    {proj.customer_name}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                      {proj.billing_method.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-on-surface">
                    {totalHours.toFixed(1)} hrs
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <div className="text-on-surface font-bold">Rev: ₹{proj.revenue_budget.toLocaleString()}</div>
                    <div className="text-outline text-[11px]">Cost: ₹{proj.cost_budget.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <Users className="w-3.5 h-3.5 text-secondary" />
                      {proj.users.length} members
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={proj.status === 'ACTIVE' ? 'success' : 'warning'}>
                      {proj.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative inline-block text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href="/time-tracking/timesheet"
                          className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary/10 hover:text-primary text-xs font-medium transition inline-flex items-center gap-1 text-on-surface"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Log Time</span>
                        </a>
                        <button
                          onClick={() => setActiveActionMenuId(activeActionMenuId === proj.id ? null : proj.id)}
                          className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {activeActionMenuId === proj.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant/80 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-xs text-left">
                          <button
                            onClick={() => {
                              downloadDocumentFile('Project Summary Report', proj.code, {
                                client: proj.customer_name,
                                date: proj.created_at,
                                amount: proj.revenue_budget,
                                status: proj.status,
                                notes: proj.description
                              });
                              showToast('success', 'Download Started', `Exported project summary for ${proj.code}`);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <Download className="w-3.5 h-3.5 text-outline" />
                            <span>Download Summary</span>
                          </button>
                          <a
                            href="/delivery"
                            className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                          >
                            <Layers className="w-3.5 h-3.5 text-secondary" />
                            <span>View Delivery Progress</span>
                          </a>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.name)}
                            className="w-full px-3 py-2 hover:bg-red-500/10 text-red-600 flex items-center gap-2 border-t border-outline-variant/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Project</span>
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

      {/* NEW PROJECT MODAL */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="New Project"
        description="Configure project name, customer, billing method, team members, tasks, and budgets"
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveProject} className="space-y-6 text-xs text-on-surface">
          {/* Header Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div className="md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="e.g. Enterprise Cloud Security Audit"
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Project Code</label>
              <input
                type="text"
                value={projectForm.code}
                onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono text-xs text-on-surface"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Customer Name *</label>
              <select
                value={projectForm.customer_name}
                onChange={(e) => setProjectForm({ ...projectForm, customer_name: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
              >
                <option value="Apex Global Technologies">Apex Global Technologies</option>
                <option value="Vanguard Dynamics">Vanguard Dynamics</option>
                <option value="Zenith Logistics Ltd">Zenith Logistics Ltd</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Billing Method *</label>
              <select
                value={projectForm.billing_method}
                onChange={(e) => setProjectForm({ ...projectForm, billing_method: e.target.value as any })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
              >
                <option value="FIXED_COST">Fixed Cost for Project</option>
                <option value="PROJECT_HOURS">Based on Project Hours</option>
                <option value="TASK_HOURS">Based on Task Hours</option>
                <option value="STAFF_HOURS">Based on Staff Hours</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Description (Max 2000 chars)</label>
              <textarea
                rows={2}
                maxLength={2000}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Scope details and project context..."
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
              />
            </div>
          </div>

          {/* Budget Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Cost Budget (INR ₹)</label>
              <input
                type="number"
                value={projectForm.cost_budget}
                onChange={(e) => setProjectForm({ ...projectForm, cost_budget: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Revenue Budget (INR ₹)</label>
              <input
                type="number"
                value={projectForm.revenue_budget}
                onChange={(e) => setProjectForm({ ...projectForm, revenue_budget: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface font-mono"
              />
            </div>
          </div>

          {/* Assigned Users Section */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Assign Team Users
              </h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddUserRow}>
                + Assign User
              </Button>
            </div>
            <div className="space-y-2">
              {projectForm.users.map((usr, idx) => (
                <div key={usr.id} className="grid grid-cols-12 gap-2 items-center bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/40">
                  <span className="col-span-1 text-center font-mono text-outline">{idx + 1}</span>
                  <input
                    type="text"
                    value={usr.name}
                    onChange={(e) => {
                      const updated = [...projectForm.users];
                      updated[idx].name = e.target.value;
                      setProjectForm({ ...projectForm, users: updated });
                    }}
                    placeholder="User Name"
                    className="col-span-5 p-1.5 bg-surface-container-low border border-outline-variant rounded text-xs"
                  />
                  <input
                    type="email"
                    value={usr.email}
                    onChange={(e) => {
                      const updated = [...projectForm.users];
                      updated[idx].email = e.target.value;
                      setProjectForm({ ...projectForm, users: updated });
                    }}
                    placeholder="Email"
                    className="col-span-5 p-1.5 bg-surface-container-low border border-outline-variant rounded text-xs"
                  />
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveUserRow(usr.id)}
                      className="text-outline hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Tasks Section */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-secondary" />
                Project Tasks
              </h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTaskRow}>
                + Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {projectForm.tasks.map((task, idx) => (
                <div key={task.id} className="grid grid-cols-12 gap-2 items-center bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/40">
                  <span className="col-span-1 text-center font-mono text-outline">{idx + 1}</span>
                  <input
                    type="text"
                    required
                    value={task.name}
                    onChange={(e) => {
                      const updated = [...projectForm.tasks];
                      updated[idx].name = e.target.value;
                      setProjectForm({ ...projectForm, tasks: updated });
                    }}
                    placeholder="Task Name *"
                    className="col-span-4 p-1.5 bg-surface-container-low border border-outline-variant rounded text-xs"
                  />
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => {
                      const updated = [...projectForm.tasks];
                      updated[idx].description = e.target.value;
                      setProjectForm({ ...projectForm, tasks: updated });
                    }}
                    placeholder="Task Description"
                    className="col-span-4 p-1.5 bg-surface-container-low border border-outline-variant rounded text-xs"
                  />
                  <label className="col-span-2 flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.billable}
                      onChange={(e) => {
                        const updated = [...projectForm.tasks];
                        updated[idx].billable = e.target.checked;
                        setProjectForm({ ...projectForm, tasks: updated });
                      }}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Billable</span>
                  </label>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTaskRow(task.id)}
                      className="text-outline hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="watchlistCheck"
              checked={projectForm.watchlist}
              onChange={(e) => setProjectForm({ ...projectForm, watchlist: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <label htmlFor="watchlistCheck" className="text-xs text-on-surface cursor-pointer">
              Add to the watchlist on my dashboard
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
