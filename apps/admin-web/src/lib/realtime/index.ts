import { supabase } from '../supabase/client';
import type { QueryClient } from '@tanstack/react-query';

export type RealtimeCallback<T = any> = (payload: { event: string; new: T; old?: T }) => void;

// Active channel registry to prevent duplicate subscriptions
const activeChannels = new Map<string, ReturnType<typeof supabase.channel>>();

/**
 * Realtime channel subscription helper with deduplication and clean disposal.
 */
export function subscribeToChannel<T = any>(
  channelName: string,
  table: string,
  callback: RealtimeCallback<T>
) {
  // If an active channel already exists with this exact name, remove it first to avoid duplicates
  if (activeChannels.has(channelName)) {
    const existing = activeChannels.get(channelName);
    if (existing) {
      supabase.removeChannel(existing);
      activeChannels.delete(channelName);
    }
  }

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
      },
      (payload) => {
        callback({
          event: payload.eventType,
          new: payload.new as T,
          old: payload.old as T,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Channel connected successfully
      }
    });

  activeChannels.set(channelName, channel);

  return () => {
    supabase.removeChannel(channel);
    activeChannels.delete(channelName);
  };
}

/**
 * Hook helper for auto-invalidating TanStack Query keys on realtime updates.
 * Implements debounced invalidation to prevent waterfall refetches.
 */
export function setupRealtimeQuerySync(
  queryClient: QueryClient,
  table: string,
  queryKeyPrefix: string[]
) {
  let debounceTimeout: NodeJS.Timeout | null = null;
  const channelName = `sync_${table}_${queryKeyPrefix.join('_')}`;

  return subscribeToChannel(channelName, table, () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix });
    }, 150);
  });
}
