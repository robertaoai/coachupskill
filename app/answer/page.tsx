'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatThread } from '@/components/ChatThread';
import { AnswerForm } from '@/components/AnswerForm';
import { useLocalSession } from '@/hooks/useLocalSession';
import { postAnswer } from '@/lib/api';
import { ChatMessage } from '@/lib/types';
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CyberButton } from '@/components/CyberButton';

function AnswerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const { chatHistory, currentQuestionId, saveSession } = useLocalSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionId, setQuestionId] = useState('q1');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      toast.error('No session ID provided');
      router.push('/');
      return;
    }

    if (chatHistory.length > 0) {
      setMessages(chatHistory);
      setQuestionId(currentQuestionId);
    }
  }, [chatHistory, currentQuestionId, sessionId, router]);

  const handleSubmit = async (answer: string) => {
    if (!sessionId) return;
    
    setError(null);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: answer,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await postAnswer(sessionId, questionId, answer);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response.reply_text,
        recommended_action: response.recommended_action,
        tags: response.tags,
        explainability: response.explainability,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const nextQuestionId = `q${parseInt(questionId.substring(1)) + 1}`;
      setQuestionId(nextQuestionId);
      saveSession(sessionId, finalMessages, nextQuestionId);

      if (parseInt(nextQuestionId.substring(1)) > 9) {
        toast.success('Assessment complete! Proceeding to summary...');
        setTimeout(() => {
          router.push(`/complete?id=${sessionId}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
      toast.error('Failed to submit answer. Please try again.');
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin" />
      </div>
    );
  }

  const currentQuestion = parseInt(questionId.substring(1));
  const isFinalQuestion = currentQuestion >= 9;

  return (
    <main className="h-screen flex flex-col p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between py-4 mb-4 border-b-2 border-[#00FFFF]/20">
        <CyberButton
          variant="secondary"
          onClick={() => router.push('/')}
          className="px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </CyberButton>
        
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <MessageSquare className="w-5 h-5 text-[#00FFFF]" />
            <h1 className="text-2xl font-['Orbitron'] font-bold text-[#00FFFF] neon-glow-cyan">
              ASSESSMENT
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Question {currentQuestion} of 9
          </p>
        </div>
        
        <div className="w-24" />
      </header>

      <div className="flex-1 overflow-hidden mb-4">
        <ChatThread messages={messages} />
      </div>

      <div className="border-t-2 border-[#00FFFF]/20 pt-4">
        {error && (
          <div className="mb-4 p-3 bg-[#FF0080]/10 border-2 border-[#FF0080] rounded-lg">
            <p className="text-[#FF0080] text-sm">⚠ {error}</p>
          </div>
        )}
        <AnswerForm onSubmit={handleSubmit} isFinalQuestion={isFinalQuestion} />
      </div>
    </main>
  );
}

export default function AnswerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin" />
      </div>
    }>
      <AnswerContent />
    </Suspense>
  );
}
