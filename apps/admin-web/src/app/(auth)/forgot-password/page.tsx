'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/feedback/toast';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('success', 'Recovery Email Dispatched', 'Check your inbox for password reset instructions.');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">Reset Password</h2>
        <p className="text-xs text-outline mt-0.5">Enter your work email and we will send you a recovery link.</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Work Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Button type="submit" variant="primary" size="md" className="w-full">
            Send Recovery Link
          </Button>

          <div className="text-center pt-2">
            <a href="/login" className="text-xs text-primary hover:underline">
              ← Back to Sign In
            </a>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-center py-4">
          <p className="text-xs text-on-surface">
            Recovery instructions have been sent to <span className="font-semibold text-primary">{email}</span>.
          </p>
          <a href="/login" className="inline-block text-xs text-primary font-semibold hover:underline">
            Return to Sign In
          </a>
        </div>
      )}
    </div>
  );
}
