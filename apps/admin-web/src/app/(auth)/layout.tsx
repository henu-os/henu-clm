import * as React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            H
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">HENU OS CLM</h1>
          <p className="text-xs text-outline">Executive & Operational Control Plane</p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-lg p-space-lg">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-outline">
          <p>© 2026 HENU OS. Protected by Zero-Trust Supabase Security.</p>
        </div>
      </div>
    </div>
  );
}
