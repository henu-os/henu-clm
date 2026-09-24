'use client';

import * as React from 'react';
import { Bell, Send, CheckCheck, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationService } from '@/features/support/support.service';
import { type AppNotification } from '@henu/shared';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/feedback/toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    NotificationService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    showToast('success', 'Notifications Updated', 'All alerts marked as read.');
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Notifications & Alerts</h1>
          <p className="text-xs text-outline">System alerts, commercial triggers, and multi-channel push dispatch logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            <span>Mark All as Read</span>
          </Button>
          <Button variant="primary" size="md" onClick={() => showToast('info', 'Broadcast Composer', 'Opening push broadcast modal.')}>
            <Send className="w-4 h-4 mr-1.5" />
            <span>+ New Broadcast</span>
          </Button>
        </div>
      </div>

      {/* Notifications Queue */}
      <Card>
        <CardContent className="divide-y divide-outline-variant/30 p-0">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start gap-3 transition-colors ${
                notif.is_read ? 'bg-surface-container-lowest' : 'bg-surface-container-low/60'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-on-surface">{notif.title}</h4>
                  <Badge variant="primary">{notif.category}</Badge>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">{notif.body}</p>
                <span className="text-[10px] text-outline mt-1 block">{formatRelativeTime(notif.created_at)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
