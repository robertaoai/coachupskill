'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-3 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00FFFF] flex items-center justify-center neon-border-cyan">
          <Bot className="w-6 h-6 text-black" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[75%] space-y-2',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'px-4 py-3 rounded-lg border-2 font-["Exo_2"]',
          isUser 
            ? 'bg-[#FF0080] border-[#FF0080] text-white neon-border-pink' 
            : 'bg-[#1B1B1B] border-[#00FFFF] text-white neon-border-cyan'
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-['Exo_2']">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF0080] flex items-center justify-center neon-border-pink">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
