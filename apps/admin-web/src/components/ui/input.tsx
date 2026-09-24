import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full h-9 px-3 bg-surface-container-low border border-outline-variant rounded text-sm font-normal text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-error">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-outline">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
