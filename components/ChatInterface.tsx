'use client';

import { ChatThread } from './ChatThread';
import { ChatInput } from './ChatInput';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#0A0A0A] border-2 border-[#00FFFF] rounded-lg neon-border-cyan">
      <div className="flex-1 overflow-hidden">
        <ChatThread messages={messages} />
      </div>
      <div className="border-t-2 border-[#00FFFF]/30 p-4">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
