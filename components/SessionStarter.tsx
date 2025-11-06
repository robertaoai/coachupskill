'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { startSession } from '@/lib/api';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';

interface SessionStarterProps {
  email: string;
  personaHint: string;
  disabled?: boolean;
}

export function SessionStarter({ email, personaHint, disabled }: SessionStarterProps) {
  const router = useRouter();
  const { setSession } = useSession();
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
      
      // Store session in context (which also saves to localStorage)
      setSession(response.session.id, response.first_prompt);
      
      // Small delay to ensure state updates complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🎯 SessionStarter - Navigating to /answer-flow...');
      router.push('/answer-flow');
      
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
