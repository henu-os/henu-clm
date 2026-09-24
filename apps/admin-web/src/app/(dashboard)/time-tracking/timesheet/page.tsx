'use client';

import * as React from 'react';
import { 
  Clock, 
  Play, 
  Square, 
  Plus, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  CheckCircle2, 
  MoreVertical, 
  Layers, 
  User, 
  Check, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';
import { downloadDocumentFile } from '@/lib/download';

export interface TimesheetEntry {
  id: string;
  project_name: string;
  project_code: string;
  task_name: string;
  user_name: string;
  date: string;
  hours: number;
  billable: boolean;
  rate_per_hour?: number;
  notes: string;
  status: 'LOGGED' | 'APPROVED' | 'INVOICED';
}

const INITIAL_TIMESHEETS: TimesheetEntry[] = [
  {
    id: 'ts_001',
    project_name: 'Enterprise Cloud Security & Zero-Trust RLS',
    project_code: 'PRJ-2026-001',
    task_name: 'Architecture Blueprinting',
    user_name: 'Aarav Sharma',
    date: '2026-09-24',
    hours: 4.5,
    billable: true,
    rate_per_hour: 1500,
    notes: 'Configured Supabase multi-tenant isolation rules and JWT claims verification.',
    status: 'APPROVED'
  },
  {
    id: 'ts_002',
    project_name: 'Real-Time Financial Telemetry & Accounting Engine',
    project_code: 'PRJ-2026-002',
    task_name: 'Ledger Engine Implementation',
    user_name: 'HENU OS PRIVATE LIMITED',
    date: '2026-09-23',
    hours: 6.0,
    billable: true,
    rate_per_hour: 1800,
    notes: 'Built double-entry ledger settlement pipelines and real-time balance aggregators.',
    status: 'LOGGED'
  },
  {
    id: 'ts_003',
    project_name: 'Enterprise Cloud Security & Zero-Trust RLS',
    project_code: 'PRJ-2026-001',
    task_name: 'Automated E2E Pentest Execution',
    user_name: 'Security Lead',
    date: '2026-09-22',
    hours: 3.5,
    billable: true,
    rate_per_hour: 2000,
    notes: 'Executed automated vulnerability suite with zero high-severity CVE findings.',
    status: 'INVOICED'
  }
];

export default function TimesheetPage() {
  const [timesheets, setTimesheets] = React.useState<TimesheetEntry[]>(INITIAL_TIMESHEETS);
  const [viewBy, setViewBy] = React.useState<'ALL' | 'DAY' | 'WEEK' | 'MONTH'>('ALL');
  const [periodFilter, setPeriodFilter] = React.useState<'ALL' | 'THIS_WEEK' | 'THIS_MONTH'>('ALL');
  const [activeActionMenuId, setActiveActionMenuId] = React.useState<string | null>(null);
  
  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [timerProject, setTimerProject] = React.useState('Enterprise Cloud Security & Zero-Trust RLS');
  const [timerTask, setTimerTask] = React.useState('Architecture Blueprinting');

  // Single Day Entry Modal
  const [isSingleModalOpen, setIsSingleModalOpen] = React.useState(false);
  const [singleForm, setSingleForm] = React.useState({
    project_name: 'Enterprise Cloud Security & Zero-Trust RLS',
    task_name: 'Architecture Blueprinting',
    log_type: 'DURATION' as 'DURATION' | 'START_END',
    hours: 2,
    minutes: 30,
    start_time: '09:00',
    end_time: '11:30',
    date: new Date().toISOString().split('T')[0],
    user_name: 'HENU OS PRIVATE LIMITED',
    billable: true,
    rate_per_hour: 1500,
    notes: ''
  });

  // Weekly Entry Modal
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = React.useState(false);
  const [weeklyProject, setWeeklyProject] = React.useState('Enterprise Cloud Security & Zero-Trust RLS');
  const [weeklyTask, setWeeklyTask] = React.useState('Architecture Blueprinting');
  const [weeklyHours, setWeeklyHours] = React.useState<number[]>([4, 6, 5.5, 4, 3, 0, 0]);

  const { showToast } = useToast();

  // Stopwatch Interval Effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimerTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      // Stopping timer -> auto-create timesheet entry
      const loggedHours = Math.max(0.1, Number((timerSeconds / 3600).toFixed(2)));
      const newEntry: TimesheetEntry = {
        id: `ts_${Date.now()}`,
        project_name: timerProject,
        project_code: 'PRJ-2026-001',
        task_name: timerTask,
        user_name: 'Aarav Sharma (Timer)',
        date: new Date().toISOString().split('T')[0],
        hours: loggedHours,
        billable: true,
        rate_per_hour: 1500,
        notes: `Recorded via live timer (${formatTimerTime(timerSeconds)})`,
        status: 'LOGGED'
      };

      setTimesheets([newEntry, ...timesheets]);
      setIsTimerRunning(false);
      setTimerSeconds(0);
      showToast('success', 'Timer Saved', `Logged ${loggedHours} hours to ${timerProject}`);
    } else {
      setIsTimerRunning(true);
      showToast('info', 'Timer Started', `Tracking time for ${timerProject}`);
    }
  };

  const handleSaveSingleTime = (e: React.FormEvent) => {
    e.preventDefault();
    const totalHours = singleForm.log_type === 'DURATION' 
      ? Number(singleForm.hours) + Number(singleForm.minutes) / 60
      : 2.5;

    const newEntry: TimesheetEntry = {
      id: `ts_${Date.now()}`,
      project_name: singleForm.project_name,
      project_code: 'PRJ-2026-001',
      task_name: singleForm.task_name,
      user_name: singleForm.user_name,
      date: singleForm.date,
      hours: Number(totalHours.toFixed(2)),
      billable: singleForm.billable,
      rate_per_hour: singleForm.rate_per_hour,
      notes: singleForm.notes || 'Direct timesheet entry',
      status: 'LOGGED'
    };

    setTimesheets([newEntry, ...timesheets]);
    setIsSingleModalOpen(false);
    showToast('success', 'Time Logged', `Recorded ${newEntry.hours} hrs for ${newEntry.task_name}`);
  };

  const handleSaveWeeklyTime = (e: React.FormEvent) => {
    e.preventDefault();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalWeek = weeklyHours.reduce((acc, h) => acc + (Number(h) || 0), 0);

    const newEntry: TimesheetEntry = {
      id: `ts_${Date.now()}`,
      project_name: weeklyProject,
      project_code: 'PRJ-2026-001',
      task_name: weeklyTask,
      user_name: 'HENU OS PRIVATE LIMITED',
      date: new Date().toISOString().split('T')[0],
      hours: totalWeek,
      billable: true,
      rate_per_hour: 1500,
      notes: `Weekly timesheet batch (${weeklyHours.join('/')} hrs)`,
      status: 'LOGGED'
    };

    setTimesheets([newEntry, ...timesheets]);
    setIsWeeklyModalOpen(false);
    showToast('success', 'Weekly Timesheet Saved', `Recorded ${totalWeek} hours across the week.`);
  };

  const handleDeleteEntry = (id: string) => {
    setTimesheets(timesheets.filter(t => t.id !== id));
    setActiveActionMenuId(null);
    showToast('info', 'Timesheet Deleted', 'Time log entry removed.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Timesheet & Time Tracking</h1>
          <p className="text-xs text-on-surface-variant">
            Log billable hours, record live stopwatch sessions, review weekly batches, and dispatch for billing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Running Timer Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/60 shadow-xs">
            <button
              onClick={handleToggleTimer}
              className={`p-1.5 rounded-lg flex items-center justify-center transition font-semibold text-xs ${
                isTimerRunning 
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isTimerRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <div className="font-mono font-bold text-xs text-on-surface">
              {formatTimerTime(timerSeconds)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsWeeklyModalOpen(true)}>
              + Log Weekly Time
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsSingleModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              <span>+ Log Time</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Total Recorded Hours</p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {timesheets.reduce((acc, t) => acc + t.hours, 0).toFixed(1)} hrs
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Billable Ratio</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {Math.round((timesheets.filter(t => t.billable).reduce((acc, t) => acc + t.hours, 0) / (timesheets.reduce((acc, t) => acc + t.hours, 0) || 1)) * 100)}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Billable Amount Value</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              ₹{timesheets.reduce((acc, t) => acc + (t.billable ? t.hours * (t.rate_per_hour || 1500) : 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-container-lowest border-outline-variant/50 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Pending Invoice Sync</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {timesheets.filter(t => t.status !== 'INVOICED').length} Logs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Filter Bar */}
      <div className="p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewBy('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewBy === 'ALL'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All Timesheets
          </button>
          <button
            onClick={() => setViewBy('DAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewBy === 'DAY'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewBy('WEEK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewBy === 'WEEK'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewBy('MONTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewBy === 'MONTH'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Month View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as any)}
            className="p-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface"
          >
            <option value="ALL">All Periods</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
          </select>
          <span className="text-xs text-outline">{timesheets.length} Entries</span>
        </div>
      </div>

      {/* Timesheet Entries Table */}
      <Card className="bg-surface-container-lowest border-outline-variant/50 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low/60">
              <TableHead className="text-xs uppercase font-semibold">Date</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Project & Task</TableHead>
              <TableHead className="text-xs uppercase font-semibold">User</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Hours</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Billable</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Notes / Context</TableHead>
              <TableHead className="text-xs uppercase font-semibold">Status</TableHead>
              <TableHead className="text-xs uppercase font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheets.map((ts) => (
              <TableRow key={ts.id} className="hover:bg-surface-container-low/40 transition">
                <TableCell className="text-xs font-medium text-on-surface font-mono">
                  {ts.date}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-on-surface">{ts.project_name}</div>
                  <div className="text-[11px] text-primary font-medium">{ts.task_name}</div>
                </TableCell>
                <TableCell className="text-xs text-on-surface-variant">
                  {ts.user_name}
                </TableCell>
                <TableCell className="text-xs font-mono font-bold text-on-surface">
                  {ts.hours} hrs
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    ts.billable 
                      ? 'bg-secondary/10 text-secondary border-secondary/20' 
                      : 'bg-surface-container-high text-outline border-outline-variant'
                  }`}>
                    {ts.billable ? 'Billable' : 'Non-billable'}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-on-surface-variant max-w-xs truncate">
                  {ts.notes}
                </TableCell>
                <TableCell>
                  <Badge variant={ts.status === 'INVOICED' ? 'success' : ts.status === 'APPROVED' ? 'primary' : 'warning'}>
                    {ts.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setActiveActionMenuId(activeActionMenuId === ts.id ? null : ts.id)}
                      className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeActionMenuId === ts.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant/80 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 text-xs text-left">
                        <button
                          onClick={() => {
                            downloadDocumentFile('Timesheet Log Record', ts.id, {
                              client: ts.project_name,
                              date: ts.date,
                              amount: ts.hours * (ts.rate_per_hour || 1500),
                              status: ts.status,
                              notes: ts.notes
                            });
                            showToast('success', 'Download Started', `Exported time log ${ts.id}`);
                            setActiveActionMenuId(null);
                          }}
                          className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                        >
                          <Download className="w-3.5 h-3.5 text-outline" />
                          <span>Download Log PDF</span>
                        </button>
                        <a
                          href="/invoices"
                          className="w-full px-3 py-2 hover:bg-surface-container-high flex items-center gap-2 text-on-surface"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          <span>Convert to Invoice</span>
                        </a>
                        <button
                          onClick={() => handleDeleteEntry(ts.id)}
                          className="w-full px-3 py-2 hover:bg-red-500/10 text-red-600 flex items-center gap-2 border-t border-outline-variant/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Entry</span>
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* SINGLE DAY TIME LOG MODAL */}
      <Modal
        isOpen={isSingleModalOpen}
        onClose={() => setIsSingleModalOpen(false)}
        title="Log Time"
        description="Log individual project task hours, rates, and detailed engineering notes"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveSingleTime} className="space-y-4 text-xs text-on-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Project Name *</label>
              <select
                value={singleForm.project_name}
                onChange={(e) => setSingleForm({ ...singleForm, project_name: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              >
                <option value="Enterprise Cloud Security & Zero-Trust RLS">Enterprise Cloud Security & Zero-Trust RLS</option>
                <option value="Real-Time Financial Telemetry & Accounting Engine">Real-Time Financial Telemetry & Accounting Engine</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Task Name *</label>
              <select
                value={singleForm.task_name}
                onChange={(e) => setSingleForm({ ...singleForm, task_name: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              >
                <option value="Architecture Blueprinting">Architecture Blueprinting</option>
                <option value="Ledger Engine Implementation">Ledger Engine Implementation</option>
                <option value="Automated E2E Pentest Execution">Automated E2E Pentest Execution</option>
                <option value="Client Mobile Synchronization">Client Mobile Synchronization</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Date *</label>
              <input
                type="date"
                required
                value={singleForm.date}
                onChange={(e) => setSingleForm({ ...singleForm, date: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">User *</label>
              <input
                type="text"
                required
                value={singleForm.user_name}
                onChange={(e) => setSingleForm({ ...singleForm, user_name: e.target.value })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 space-y-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <input
                  type="radio"
                  name="logType"
                  checked={singleForm.log_type === 'DURATION'}
                  onChange={() => setSingleForm({ ...singleForm, log_type: 'DURATION' })}
                />
                <span>Enter Duration (HH:MM)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <input
                  type="radio"
                  name="logType"
                  checked={singleForm.log_type === 'START_END'}
                  onChange={() => setSingleForm({ ...singleForm, log_type: 'START_END' })}
                />
                <span>Enter Start & End Time</span>
              </label>
            </div>

            {singleForm.log_type === 'DURATION' ? (
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <div>
                  <label className="block text-[11px] text-outline mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={singleForm.hours}
                    onChange={(e) => setSingleForm({ ...singleForm, hours: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-outline mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={singleForm.minutes}
                    onChange={(e) => setSingleForm({ ...singleForm, minutes: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <div>
                  <label className="block text-[11px] text-outline mb-1">Start Time</label>
                  <input
                    type="time"
                    value={singleForm.start_time}
                    onChange={(e) => setSingleForm({ ...singleForm, start_time: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-outline mb-1">End Time</label>
                  <input
                    type="time"
                    value={singleForm.end_time}
                    onChange={(e) => setSingleForm({ ...singleForm, end_time: e.target.value })}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={singleForm.billable}
                onChange={(e) => setSingleForm({ ...singleForm, billable: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="font-semibold text-xs text-on-surface">Billable Time Entry</span>
            </label>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Rate per Hour (INR ₹)</label>
              <input
                type="number"
                value={singleForm.rate_per_hour}
                onChange={(e) => setSingleForm({ ...singleForm, rate_per_hour: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Notes / Description</label>
            <textarea
              rows={2}
              value={singleForm.notes}
              onChange={(e) => setSingleForm({ ...singleForm, notes: e.target.value })}
              placeholder="What did you work on during this period?"
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsSingleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Time Log
            </Button>
          </div>
        </form>
      </Modal>

      {/* LOG WEEKLY TIME MODAL */}
      <Modal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        title="Log Weekly Time"
        description="Bulk record weekly task hours across Monday through Sunday"
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveWeeklyTime} className="space-y-5 text-xs text-on-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Project Name *</label>
              <select
                value={weeklyProject}
                onChange={(e) => setWeeklyProject(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              >
                <option value="Enterprise Cloud Security & Zero-Trust RLS">Enterprise Cloud Security & Zero-Trust RLS</option>
                <option value="Real-Time Financial Telemetry & Accounting Engine">Real-Time Financial Telemetry & Accounting Engine</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-outline mb-1">Task Name *</label>
              <select
                value={weeklyTask}
                onChange={(e) => setWeeklyTask(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              >
                <option value="Architecture Blueprinting">Architecture Blueprinting</option>
                <option value="Ledger Engine Implementation">Ledger Engine Implementation</option>
                <option value="Automated E2E Pentest Execution">Automated E2E Pentest Execution</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 space-y-3">
            <h4 className="font-bold text-on-surface text-xs">Weekly Days (Hours Worked)</h4>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day}>
                  <label className="block font-semibold text-outline text-[11px] mb-1">{day}</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={weeklyHours[idx]}
                    onChange={(e) => {
                      const updated = [...weeklyHours];
                      updated[idx] = parseFloat(e.target.value) || 0;
                      setWeeklyHours(updated);
                    }}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-mono text-center text-xs"
                  />
                </div>
              ))}
            </div>
            <div className="text-right pt-2 font-bold text-xs text-primary">
              Total Week Hours: {weeklyHours.reduce((acc, h) => acc + (Number(h) || 0), 0)} hrs
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/40">
            <Button type="button" variant="outline" onClick={() => setIsWeeklyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Weekly Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
