'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { useLocalSession } from '@/hooks/useLocalSession';
import { postAnswer } from '@/lib/api';
import { toast } from 'sonner';
import { Brain, Loader2 } from 'lucide-react';

function AnswerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const { getSession, saveSession } = useLocalSession();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      toast.error('No session ID provided');
      router.push('/');
      return;
    }

    const session = getSession(sessionId);
    if (!session) {
      toast.error('Session not found');
      router.push('/');
      return;
    }

    setMessages(session.messages);
    setCurrentQuestion(session.currentQuestion);
    setIsLoading(false);
  }, [sessionId, getSession, router]);

  const handleSendMessage = async (text: string) => {
    if (!sessionId) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const result = await postAnswer(sessionId, currentQuestion, text);

      if (result.next_prompt) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          text: result.next_prompt,
          timestamp: new Date(),
          recommended_action: result.recommended_action,
          tags: result.tags,
          explainability: result.explainability,
        };
        
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        setCurrentQuestion(result.next_question || '');
        saveSession(sessionId, finalMessages, result.next_question || '');
      } else {
        toast.success('Assessment complete!');
        router.push(`/complete?id=${sessionId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send answer');
      setMessages(messages);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-[#00FFFF] mx-auto mb-4 animate-pulse" />
          <p className="text-[#00FFFF] font-['Orbitron']">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col scan-line">
      <header className="bg-[#1B1B1B] border-b-2 border-[#00FFFF] p-4 neon-border-cyan">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#FF0080]" />
          <h1 className="text-2xl font-['Orbitron'] font-bold text-[#00FFFF] neon-glow-cyan">
            AI SKILLS ASSESSMENT
          </h1>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
        />
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
