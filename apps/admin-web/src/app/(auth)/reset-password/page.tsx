'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/feedback/toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match', 'Please ensure both password fields match.');
      return;
    }
    showToast('success', 'Password Updated', 'Your administrative password has been updated.');
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Set New Password</h2>
        <p className="text-xs text-outline mt-0.5">Please create a strong password conforming to security policies.</p>
      </div>

      <div className="space-y-3 pt-2">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full mt-2">
        Update Password & Sign In
      </Button>
    </form>
  );
}
