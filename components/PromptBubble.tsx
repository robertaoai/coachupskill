'use client';

import { useSession } from '@/contexts/SessionContext';

interface PromptBubbleProps {
  className?: string;
}

export function PromptBubble({ className = '' }: PromptBubbleProps) {
  const { firstPrompt } = useSession();

  if (!firstPrompt) {
    return null;
  }

  return (
    <div className={`flex justify-start ${className}`}>
      <div className="max-w-[80%] rounded-2xl p-4 bg-black/40 backdrop-blur-xl border border-[#00FFFF]/20 text-gray-200 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/40 flex items-center justify-center flex-shrink-0">
            <span className="text-[#00FFFF] text-sm font-bold">AI</span>
          </div>
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{firstPrompt}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
