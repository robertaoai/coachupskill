'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { CyberButton } from './CyberButton';
import { Send } from 'lucide-react';

interface AnswerFormProps {
  onSubmit: (answer: string) => Promise<void>;
  isFinalQuestion?: boolean;
}

export function AnswerForm({ onSubmit, isFinalQuestion }: AnswerFormProps) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    try {
      await onSubmit(answer);
      setAnswer('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your response..."
        className="bg-[#1B1B1B] border-2 border-[#00FFFF] text-white placeholder:text-gray-500 focus:neon-border-cyan min-h-[100px]"
        disabled={loading}
      />
      <CyberButton
        type="submit"
        loading={loading}
        variant={isFinalQuestion ? 'accent' : 'primary'}
        className="w-full"
        disabled={!answer.trim()}
      >
        <Send className="mr-2 h-4 w-4" />
        {isFinalQuestion ? 'Complete Assessment' : 'Reply Message'}
      </CyberButton>
    </form>
  );
}
