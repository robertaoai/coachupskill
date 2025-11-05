'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ValidatedEntryField } from '@/components/ValidatedEntryField';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  personaHint: z.string().min(2, 'Please enter at least 2 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface UserEntryFormProps {
  onSubmit: (email: string, personaHint: string) => Promise<void>;
  disabled?: boolean;
}

export function UserEntryForm({ onSubmit, disabled = false }: UserEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data.email, data.personaHint);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start session');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <ValidatedEntryField
        label="Email Address"
        placeholder="your.email@company.com"
        error={errors.email?.message}
        disabled={isSubmitting || disabled}
        {...register('email')}
      />
      
      <ValidatedEntryField
        label="Your Role"
        placeholder="e.g., Marketing Manager, Software Developer"
        error={errors.personaHint?.message}
        disabled={isSubmitting || disabled}
        {...register('personaHint')}
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
