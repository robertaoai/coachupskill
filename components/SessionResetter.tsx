'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { RotateCcw } from 'lucide-react';

interface SessionResetterProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function SessionResetter({ variant = 'outline', className = '' }: SessionResetterProps) {
  const router = useRouter();
  const { clearSession } = useSession();

  const handleReset = () => {
    console.log('🔄 SessionResetter - Resetting session...');
    clearSession();
    router.push('/session-start-flow');
  };

  return (
    <Button
      onClick={handleReset}
      variant={variant}
      className={`border-[#00FFFF]/40 text-[#00FFFF] hover:bg-[#00FFFF]/10 ${className}`}
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      New Assessment
    </Button>
  );
}
