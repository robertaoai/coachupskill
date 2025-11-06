'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!isLoading && requireSession && !hasValidSession()) {
      console.log('⚠️ SessionValidator - No valid session found');
      toast.error('No active session found', {
        description: 'Please start a new assessment'
      });
      router.push('/session-start-flow');
    }
  }, [isLoading, requireSession, hasValidSession, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF] mx-auto mb-4" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (requireSession && !hasValidSession()) {
    return null;
  }

  return <>{children}</>;
}
