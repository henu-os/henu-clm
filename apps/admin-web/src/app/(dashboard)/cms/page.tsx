'use client';

import * as React from 'react';
import { Globe, Plus, MoveVertical, Edit2, Tag, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CmsService } from '@/features/support/support.service';
import { type QuickActionItem } from '@henu/shared';
import { useToast } from '@/components/feedback/toast';

export default function CmsPage() {
  const [quickActions, setQuickActions] = React.useState<QuickActionItem[]>([]);
  const { showToast } = useToast();

  React.useEffect(() => {
    CmsService.getQuickActions().then(setQuickActions);
  }, []);

  const handleToggle = (id: string) => {
    setQuickActions(
      quickActions.map((qa) => (qa.id === id ? { ...qa, is_active: !qa.is_active } : qa))
    );
    showToast('success', 'CMS Updated', 'Quick Action status updated live on mobile app.');
  };

  return (
    <div className="space-y-space-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Mobile App CMS & Dynamic Content</h1>
          <p className="text-xs text-outline">Manage Mobile Home Quick Actions, promotional banners, and FAQ repositories live.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => showToast('info', 'New Quick Action', 'Modal open.')}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>+ Add Quick Action Tile</span>
        </Button>
      </div>

      {/* Quick Actions Live Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Home Ecosystem Quick Action Tiles</CardTitle>
          <Badge variant="primary">Realtime Synchronized</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-outline mb-3">
            These dynamic tiles appear directly on the client mobile home screen under the 3D particle widget.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((qa) => (
              <div
                key={qa.id}
                className="p-3 bg-surface-container-low rounded border border-outline-variant/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {qa.display_order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">{qa.title}</span>
                      {qa.badge_text && <Badge variant="warning">{qa.badge_text}</Badge>}
                    </div>
                    <p className="text-[11px] text-outline">Route: {qa.target_route}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={qa.is_active ? 'secondary' : 'outline'}
                    onClick={() => handleToggle(qa.id)}
                  >
                    {qa.is_active ? 'Active' : 'Disabled'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
