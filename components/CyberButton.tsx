'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export function CyberButton({ 
  loading, 
  variant = 'primary', 
  children, 
  className,
  disabled,
  ...props 
}: CyberButtonProps) {
  const variantStyles = {
    primary: 'bg-[#FF0080] hover:bg-[#FF0080]/80 text-white neon-border-pink border-[#FF0080]',
    secondary: 'bg-[#1B1B1B] hover:bg-[#252525] text-[#00FFFF] neon-border-cyan border-[#00FFFF]',
    accent: 'bg-[#8AFF00] hover:bg-[#8AFF00]/80 text-black border-[#8AFF00]',
  };

  return (
    <Button
      className={cn(
        'relative font-["Orbitron"] font-bold uppercase tracking-wider border-2 transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
