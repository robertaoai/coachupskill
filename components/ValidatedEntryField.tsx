'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ValidatedEntryFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'textarea';
  id: string;
  disabled?: boolean;
}

export function ValidatedEntryField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  id,
  disabled = false,
}: ValidatedEntryFieldProps) {
  const errorId = `${id}-error`;
  const isInvalid = !!error;

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-[#00FFFF] font-['Orbitron'] uppercase text-sm tracking-wider"
      >
        {label}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          className={cn(
            'bg-[#1B1B1B] border-2 text-white placeholder:text-gray-500',
            'focus:border-[#00FFFF] focus:neon-border-cyan',
            isInvalid && 'border-[#FF0080] neon-border-pink',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          rows={3}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          className={cn(
            'bg-[#1B1B1B] border-2 text-white placeholder:text-gray-500',
            'focus:border-[#00FFFF] focus:neon-border-cyan',
            isInvalid && 'border-[#FF0080] neon-border-pink',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      )}
      {error && (
        <p id={errorId} className="text-[#FF0080] text-sm font-['Exo_2'] neon-glow-pink">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
