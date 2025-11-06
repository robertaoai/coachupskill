'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserEntryFormProps {
  onFormChange: (email: string, personaHint: string, isValid: boolean) => void;
}

export function UserEntryForm({ onFormChange }: UserEntryFormProps) {
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Validate email
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPersonaValid = personaHint.trim().length > 0;
    
    if (email && !isEmailValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }

    const isFormValid = isEmailValid && isPersonaValid;
    onFormChange(email, personaHint, isFormValid);
  }, [email, personaHint, onFormChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black/60 border-[#00FFFF]/20 text-white placeholder:text-gray-500 focus:border-[#00FFFF]"
        />
        {emailError && (
          <p className="text-xs text-red-400">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="persona" className="text-gray-300">
          Your Role
        </Label>
        <Input
          id="persona"
          type="text"
          placeholder="e.g., Software Manager, Developer, CTO"
          value={personaHint}
          onChange={(e) => setPersonaHint(e.target.value)}
          className="bg-black/60 border-[#00FFFF]/20 text-white placeholder:text-gray-500 focus:border-[#00FFFF]"
        />
      </div>
    </div>
  );
}
