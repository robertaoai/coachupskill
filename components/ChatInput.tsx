'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your response... (Shift+Enter for new line)"
        className="bg-[#1B1B1B] border-2 border-[#00FFFF] text-white placeholder:text-gray-500 focus:neon-border-cyan resize-none min-h-[60px] max-h-[120px] font-['Exo_2']"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="bg-[#FF0080] hover:bg-[#FF0080]/80 text-white font-['Orbitron'] font-bold neon-glow-pink px-6"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
}
