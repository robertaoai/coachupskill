'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  type: 'user' | 'ai';
  message: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
}

export function ChatBubble({ 
  type, 
  message, 
  recommended_action, 
  tags, 
  explainability 
}: ChatBubbleProps) {
  const isUser = type === 'user';

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
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        
        {!isUser && recommended_action && (
          <div className="bg-[#8AFF00]/10 border-2 border-[#8AFF00] rounded-lg px-3 py-2 neon-border-green">
            <p className="text-xs text-[#8AFF00] font-['Orbitron'] uppercase tracking-wider mb-1">
              💡 Recommended Action
            </p>
            <p className="text-sm text-white font-['Exo_2']">{recommended_action}</p>
          </div>
        )}
        
        {!isUser && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 text-xs bg-[#1B1B1B] border border-[#FCEE09] text-[#FCEE09] rounded font-['Orbitron'] uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {!isUser && explainability && (
          <details className="bg-[#1B1B1B] border border-[#00FFFF]/30 rounded-lg px-3 py-2">
            <summary className="text-xs text-[#00FFFF] font-['Orbitron'] uppercase cursor-pointer hover:text-[#00FFFF]/80">
              🔍 Explainability
            </summary>
            <p className="text-sm text-gray-300 mt-2 font-['Exo_2']">{explainability}</p>
          </details>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF0080] flex items-center justify-center neon-border-pink">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
