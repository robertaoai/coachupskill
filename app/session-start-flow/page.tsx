'use client';

import { useState } from 'react';
import { UserEntryForm } from '@/components/UserEntryForm';
import { SessionStarter } from '@/components/SessionStarter';

export default function SessionStartFlow() {
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = (newEmail: string, newPersonaHint: string, isValid: boolean) => {
    setEmail(newEmail);
    setPersonaHint(newPersonaHint);
    setIsFormValid(isValid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-[#00FFFF]/20 rounded-2xl p-8 shadow-2xl neon-glow-cyan">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-['Orbitron'] text-[#00FFFF] mb-2 neon-text-cyan">
              AI Skills Assessment
            </h1>
            <p className="text-gray-400 text-sm">
              Discover your AI readiness in 9 quick questions
            </p>
          </div>

          <div className="space-y-6">
            <UserEntryForm 
              onFormChange={handleFormChange}
            />

            <SessionStarter
              email={email}
              personaHint={personaHint}
              disabled={!isFormValid}
            />
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your data is secure and will only be used for assessment purposes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
