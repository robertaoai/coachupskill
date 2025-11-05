'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserEntryForm } from '@/components/UserEntryForm';
import { startSession } from '@/lib/api';
import { useLocalSession } from '@/hooks/useLocalSession';
import { toast } from 'sonner';

export default function SessionStartFlow() {
  const router = useRouter();
  const { saveSession } = useLocalSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = async (email: string, personaHint: string) => {
    console.log('=== SESSION START HANDLER ===');
    console.log('Email:', email);
    console.log('Persona hint:', personaHint);
    
    setIsLoading(true);
    
    try {
      console.log('📞 Calling startSession API...');
      const response = await startSession(email, personaHint);
      
      console.log('✅ API Response received:', response);
      console.log('✅ Session ID:', response.session.id);
      console.log('✅ First prompt:', response.first_prompt);
      
      // Save session data to localStorage
      console.log('💾 Saving session to localStorage...');
      saveSession(
        response.session.id,
        response.first_prompt,
        [{
          id: 'initial',
          content: response.first_prompt,
          isUser: false,
          timestamp: new Date()
        }]
      );
      
      console.log('✅ Session saved successfully');
      console.log('🚀 Navigating to /answer-flow...');
      
      // Navigate to answer flow
      router.push('/answer-flow');
      
    } catch (error) {
      console.error('=== SESSION START ERROR ===');
      console.error('Error:', error);
      
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to start session. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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

          <UserEntryForm 
            onSubmit={handleStartSession}
            disabled={isLoading}
          />

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your data is secure and will only be used for assessment purposes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
