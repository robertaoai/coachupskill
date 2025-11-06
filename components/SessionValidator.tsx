'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SessionValidatorProps {
  children: React.ReactNode;
  requireSession?: boolean;
}

export function SessionValidator({ children, requireSession = true }: SessionValidatorProps) {
  const router = useRouter();
  const { hasValidSession, isLoading } = useSession();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // CRITICAL: Add grace period for session initialization
    const validateSession = async () => {
      console.log('🔍 SessionValidator - Starting validation...');
      
      // Wait for SessionProvider to finish loading
      if (isLoading) {
        console.log('⏳ SessionValidator - Waiting for SessionProvider...');
        return;
      }
      
      // Add small delay to ensure any in-flight storage operations complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const isValid = hasValidSession();
      console.log('🔍 SessionValidator - Session valid:', isValid);
      
      if (requireSession && !isValid) {
        console.log('⚠️ SessionValidator - No valid session found, redirecting...');
        toast.error('No active session found', {
          description: 'Please start a new assessment'
        });
        router.push('/session-start-flow');
      }
      
      setIsValidating(false);
    };
    
    validateSession();
  }, [isLoading, requireSession, hasValidSession, router]);

  // Show loading state during validation
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF] mx-auto mb-4" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  // Don't render children if session is required but invalid
  if (requireSession && !hasValidSession()) {
    return null;
  }

  return <>{children}</>;
}
