'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/feedback/toast';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = React.useState('aarav.sharma@henuos.com');
  const [password, setPassword] = React.useState('••••••••••••');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast('success', 'Authenticated Successfully', 'Welcome back to HENU OS CLM.');
      router.push('/dashboard');
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Sign in to your account</h2>
        <p className="text-xs text-outline mt-0.5">Enter your administrative credentials to continue.</p>
      </div>

      <div className="space-y-3 pt-2">
        <Input
          label="Work Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
            <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-0" defaultChecked />
            <span>Remember session</span>
          </label>
          <a href="/forgot-password" className="text-primary hover:underline font-medium">
            Forgot password?
          </a>
        </div>
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={loading}>
        Sign In to Portal
      </Button>
    </form>
  );
}
