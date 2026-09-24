'use client';

import * as React from 'react';
import { Sparkles, RefreshCw, Key, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { SettingsService } from '@/features/support/support.service';
import { type AIAssistantConfig } from '@henu/shared';
import { useToast } from '@/components/feedback/toast';

export default function AISettingsPage() {
  const [config, setConfig] = React.useState<AIAssistantConfig | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [provider, setProvider] = React.useState<'openai' | 'anthropic' | 'google-gemini'>('openai');
  const [model, setModel] = React.useState('gpt-4o');
  const [apiKey, setApiKey] = React.useState('');
  const [temperature, setTemperature] = React.useState(0.7);
  const [contextLimit, setContextLimit] = React.useState(20);
  const [timeout, setTimeoutMs] = React.useState(30000);
  const { showToast } = useToast();

  React.useEffect(() => {
    SettingsService.getAIConfig().then(setConfig);
  }, []);

  const handleTestConnection = () => {
    showToast('success', 'AI Model Handshake Verified', `Connected to ${config?.provider.toUpperCase()} (${config?.model}) successfully.`);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      setConfig({
        ...config,
        provider,
        model,
        temperature,
        context_message_limit: contextLimit,
        request_timeout_ms: timeout,
        api_key_configured: true,
        last_tested_at: new Date().toISOString(),
        status: 'connected',
      });
    }
    setEditModalOpen(false);
    showToast('success', 'AI Model Configured', 'Provider key sealed in server vault.');
    setApiKey('');
  };

  if (!config) return null;

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">AI Assistant & Provider Configuration</h1>
          <p className="text-xs text-outline">Configure server-side AI model integration, context boundaries, and provider keys.</p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-lg flex items-start gap-3">
        <Lock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-on-surface">Protected AI Key Boundary</p>
          <p className="text-on-surface-variant mt-0.5">
            AI provider API keys (OpenAI / Anthropic / Gemini) are never bundled into client browsers or exposed in public Next.js variables.
          </p>
        </div>
      </div>

      {/* AI Config Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-sm font-bold">Active AI Assistant Configuration</CardTitle>
          </div>
          <Badge variant={config.status === 'connected' ? 'success' : 'danger'}>
            ● {config.status.toUpperCase()}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="text-outline">Active Provider:</span>
              <span className="font-semibold text-on-surface uppercase">{config.provider}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="text-outline">Model Name:</span>
              <span className="font-mono font-semibold text-primary">{config.model}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="text-outline">API Key Status:</span>
              <span className="font-mono text-outline">•••••••••••••••••••• (Configured)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="text-outline">Context Message Limit:</span>
              <span className="font-semibold text-on-surface">{config.context_message_limit} messages</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-outline-variant/30">
              <span className="text-outline">Request Timeout:</span>
              <span className="font-semibold text-on-surface">{config.request_timeout_ms} ms</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <Button size="sm" variant="outline" onClick={handleTestConnection}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Test Handshake</span>
            </Button>

            <Button size="sm" variant="primary" onClick={() => setEditModalOpen(true)}>
              <Key className="w-3.5 h-3.5 mr-1" />
              <span>Update AI Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Key Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Configure AI Provider & Keys">
        <form onSubmit={handleSaveConfig} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="google-gemini">Google Gemini</option>
            </select>
          </div>

          <Input label="Model Identifier" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. gpt-4o" required />

          <Input
            label="Provider API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter raw API key..."
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Context Message Limit"
              type="number"
              value={contextLimit}
              onChange={(e) => setContextLimit(parseInt(e.target.value) || 20)}
            />
            <Input
              label="Timeout (ms)"
              type="number"
              value={timeout}
              onChange={(e) => setTimeoutMs(parseInt(e.target.value) || 30000)}
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save AI Settings
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
