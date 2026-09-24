'use client';

import * as React from 'react';
import { MessageSquare, Send, Paperclip, User, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupportService } from '@/features/support/support.service';
import { type SupportConversation } from '@henu/shared';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function SupportPage() {
  const [conversations, setConversations] = React.useState<SupportConversation[]>([]);
  const [selectedConv, setSelectedConv] = React.useState<SupportConversation | null>(null);
  const [messageInput, setMessageInput] = React.useState('');
  const { showToast } = useToast();

  React.useEffect(() => {
    SupportService.getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) setSelectedConv(data[0]);
    });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConv) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender_id: 'admin',
      sender_name: 'Aarav Sharma (Admin)',
      sender_role: 'admin' as const,
      message_text: messageInput,
      is_internal_note: false,
      created_at: new Date().toISOString(),
    };

    const updated = {
      ...selectedConv,
      messages: [...selectedConv.messages, newMessage],
      last_message: messageInput,
      last_message_at: new Date().toISOString(),
    };

    setSelectedConv(updated);
    setConversations(conversations.map((c) => (c.id === updated.id ? updated : c)));
    setMessageInput('');
    showToast('success', 'Message Dispatched', 'Client notified in real time.');
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Client Support & Conversations</h1>
          <p className="text-xs text-outline">Real-time negotiations, deliverable discussions, and client support desk.</p>
        </div>
      </div>

      {/* Two-Pane Support Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left Pane: Conversation List (4 cols) */}
        <Card className="lg:col-span-4 flex flex-col overflow-hidden h-full">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wider text-outline">Active Threads</CardTitle>
            <Badge variant="primary">{conversations.length} Open</Badge>
          </CardHeader>
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30">
            {conversations.map((c) => {
              const isSelected = selectedConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-surface-container-high/80 border-l-2 border-primary' : 'hover:bg-surface-container-low/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-on-surface truncate">{c.client_name}</span>
                    <span className="text-[10px] text-outline shrink-0">{formatRelativeTime(c.last_message_at)}</span>
                  </div>
                  <p className="text-xs font-medium text-primary truncate">{c.title}</p>
                  <p className="text-[11px] text-outline truncate">{c.last_message}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Pane: Active Message Thread (8 cols) */}
        <Card className="lg:col-span-8 flex flex-col overflow-hidden h-full">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-space-md border-b border-outline-variant/40 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{selectedConv.title}</h3>
                  <p className="text-xs text-outline">
                    {selectedConv.client_name} ({selectedConv.client_company}) · {selectedConv.ticket_number}
                  </p>
                </div>
                <Badge variant={selectedConv.status === 'open' ? 'warning' : 'success'}>
                  {selectedConv.status.toUpperCase()}
                </Badge>
              </div>

              {/* Message History */}
              <div className="p-space-lg flex-1 overflow-y-auto space-y-4">
                {selectedConv.messages.map((msg) => {
                  const isAdmin = msg.sender_role === 'admin';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-semibold text-outline">{msg.sender_name}</span>
                        <span className="text-[10px] text-outline/60">{formatRelativeTime(msg.created_at)}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg max-w-lg text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-primary text-on-primary rounded-br-none shadow-xs'
                            : 'bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-bl-none'
                        }`}
                      >
                        {msg.message_text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-outline-variant/40 flex items-center gap-2 shrink-0 bg-surface-container-lowest">
                <input
                  type="text"
                  placeholder="Type a response to client..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-primary"
                />
                <Button type="submit" size="sm" variant="primary">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-outline">
              Select a conversation to view thread.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
