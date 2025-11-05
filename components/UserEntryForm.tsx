'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ValidatedEntryField } from '@/components/ValidatedEntryField';
import { toast } from 'sonner';

interface UserEntryFormProps {
  onSubmit: (email: string, personaHint: string) => Promise<void>;
  disabled?: boolean;
}

export function UserEntryForm({ onSubmit, disabled = false }: UserEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');
  const [errors, setErrors] = useState<{ email?: string; personaHint?: string }>({});

  const validateEmail = (value: string): string | undefined => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePersonaHint = (value: string): string | undefined => {
    if (!value) return 'Role is required';
    if (value.length < 2) return 'Please enter at least 2 characters';
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT ===');
    console.log('Email:', email);
    console.log('Persona hint:', personaHint);
    
    const emailError = validateEmail(email);
    const personaError = validatePersonaHint(personaHint);
    
    if (emailError || personaError) {
      console.log('Validation errors:', { emailError, personaError });
      setErrors({
        email: emailError,
        personaHint: personaError,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      console.log('Calling parent onSubmit...');
      await onSubmit(email, personaHint);
      console.log('Parent onSubmit completed successfully');
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Full error:', error);
      
      if (error && typeof error === 'object' && 'validation' in error) {
        const validationError = error as { validation: string[] };
        toast.error(validationError.validation.join(', '));
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to start session. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ValidatedEntryField
        id="email"
        label="Email Address"
        placeholder="your.email@company.com"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        disabled={isSubmitting || disabled}
      />
      
      <ValidatedEntryField
        id="personaHint"
        label="Your Role"
        placeholder="e.g., Marketing Manager, Software Developer"
        value={personaHint}
        onChange={setPersonaHint}
        error={errors.personaHint}
        disabled={isSubmitting || disabled}
      />

      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-['Orbitron'] font-bold uppercase tracking-wider neon-glow-cyan"
      >
        {isSubmitting ? 'Initializing...' : 'Start Assessment'}
      </Button>
    </form>
  );
}
