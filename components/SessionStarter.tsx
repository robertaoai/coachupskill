'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { startSession } from '@/lib/api';
import { toast } from 'sonner';

interface SessionStarterProps {
  email: string;
  personaHint: string;
  disabled?: boolean;
  onSessionReady: (sessionId: string, firstPrompt: string) => void;
}

export function SessionStarter({ 
  email, 
  personaHint, 
  disabled,
  onSessionReady 
}: SessionStarterProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = async () => {
    console.log('🚀 SessionStarter - Starting session...');
    console.log('📧 Email:', email);
    console.log('👤 Persona:', personaHint);
    
    setIsLoading(true);
    
    try {
      // Call webhook
      console.log('📞 SessionStarter - Calling webhook...');
      const response = await startSession(email, personaHint);
      
      console.log('✅ SessionStarter - Webhook response:', response);
      console.log('🆔 Session ID:', response.session.id);
      console.log('💬 First prompt:', response.first_prompt);
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        const sessionData = {
          sessionId: response.session.id,
          firstPrompt: response.first_prompt,
          chatHistory: [{
            id: 'initial',
            content: response.first_prompt,
            isUser: false,
            timestamp: new Date().toISOString()
          }],
          savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('ai_coach_session', JSON.stringify(sessionData));
        console.log('✅ SessionStarter - Session stored in localStorage');
      }
      
      // Trigger callback to update UI
      console.log('🎯 SessionStarter - Triggering onSessionReady callback');
      onSessionReady(response.session.id, response.first_prompt);
      
    } catch (error) {
      console.error('❌ SessionStarter - Error:', error);
      
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
    <Button
      onClick={handleStartSession}
      disabled={disabled || isLoading}
      className="w-full bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-['Orbitron'] font-bold py-6 text-lg neon-glow-cyan transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Initializing Assessment...
        </>
      ) : (
        'Start Assessment'
      )}
    </Button>
  );
}
