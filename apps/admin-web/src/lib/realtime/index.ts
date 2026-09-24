import { supabase } from '../supabase/client';

export type RealtimeCallback<T = any> = (payload: { event: string; new: T; old?: T }) => void;

/**
 * Realtime channel subscription helper.
 * When Supabase Realtime is running, subscribes to CDC postgres_changes events.
 */
export function subscribeToChannel<T = any>(
  channelName: string,
  table: string,
  callback: RealtimeCallback<T>
) {
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
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
