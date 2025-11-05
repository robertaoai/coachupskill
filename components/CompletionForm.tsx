'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CyberButton } from './CyberButton';
import { Label } from '@/components/ui/label';

interface CompletionFormProps {
  onComplete: (optIn: boolean) => Promise<void>;
}

export function CompletionForm({ onComplete }: CompletionFormProps) {
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onComplete(optIn);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-3 bg-[#1B1B1B] border-2 border-[#00FFFF]/30 rounded-lg p-4">
        <Checkbox
          id="opt-in"
          checked={optIn}
          onCheckedChange={(checked) => setOptIn(checked as boolean)}
          className="border-[#00FFFF] data-[state=checked]:bg-[#00FFFF] data-[state=checked]:text-black"
        />
        <Label 
          htmlFor="opt-in" 
          className="text-sm text-gray-300 cursor-pointer"
        >
          I'd like to receive updates and insights about AI skills development
        </Label>
      </div>
      
      <CyberButton
        type="submit"
        loading={loading}
        variant="accent"
        className="w-full"
      >
        {loading ? 'Processing...' : 'Complete Assessment'}
      </CyberButton>
    </form>
  );
}
