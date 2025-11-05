'use client';

import { useState } from 'react';
import { CyberButton } from './CyberButton';
import { Send, CheckCircle } from 'lucide-react';

interface AnswerFormProps {
  onSubmit: (answer: string) => Promise<void>;
  onComplete?: () => Promise<void>;
  isFinalQuestion?: boolean;
  isAnswered?: boolean;
}

export function AnswerForm({ 
  onSubmit, 
  onComplete,
  isFinalQuestion = false,
  isAnswered = false 
}: AnswerFormProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isAnswered && onComplete) {
        await onComplete();
      } else {
        await onSubmit(answer);
        setAnswer('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = isAnswered ? 'Complete Assessment' : 'Reply Message';
  const ButtonIcon = isAnswered ? CheckCircle : Send;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isAnswered && (
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[120px] p-4 bg-[#0A0A0A] border-2 border-[#00FFFF]/30 rounded-lg 
                     text-white placeholder-gray-500 resize-none
                     focus:outline-none focus:border-[#00FFFF] focus:ring-2 focus:ring-[#00FFFF]/20
                     transition-all duration-300"
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {answer.length} characters
          </div>
        </div>
      )}

      <CyberButton
        type="submit"
        disabled={(!isAnswered && !answer.trim()) || isSubmitting}
        className="w-full"
      >
        <ButtonIcon className="w-5 h-5 mr-2" />
        {isSubmitting ? 'Processing...' : buttonLabel}
      </CyberButton>

      {isFinalQuestion && !isAnswered && (
        <p className="text-sm text-[#00FFFF] text-center">
          ⚡ Final question - Complete your assessment!
        </p>
      )}
    </form>
  );
}
