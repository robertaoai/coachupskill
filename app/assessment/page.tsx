'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { submitAnswer } from '@/lib/api';
import { useLocalSession } from '@/hooks/useLocalSession';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { CyberButton } from '@/components/CyberButton';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssessmentPage() {
  const router = useRouter();
  const { sessionId, firstPrompt, clearSession } = useLocalSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId || !firstPrompt) {
      toast.error('No active session found');
      router.push('/');
      return;
    }

    setMessages([{
      id: '1',
      content: firstPrompt,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [sessionId, firstPrompt, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (answer: string) => {
    if (!sessionId || !answer.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: answer,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      console.log('Submitting answer for session:', sessionId);
      const response = await submitAnswer(sessionId, answer);
      console.log('Answer response:', response);

      if (response.is_complete) {
        setIsComplete(true);
        const completeMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.next_prompt || 'Assessment complete! Click below to view your results.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, completeMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.next_prompt,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      console.error('Submit answer error:', error);
      toast.error(error.message || 'Failed to submit answer');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your response. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (!sessionId) return;
    router.push(`/complete?id=${sessionId}`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <header className="bg-[#1B1B1B] border-b-2 border-[#00FFFF] py-4 px-4 neon-border-cyan">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-['Orbitron'] font-black text-[#00FFFF] neon-glow-cyan">
            AI SKILLS ASSESSMENT
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#8AFF00] rounded-full animate-pulse" />
            <span className="text-xs text-[#8AFF00] font-['Exo_2']">ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4 pb-32">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {loading && (
            <div className="flex items-center gap-3 text-[#00FFFF] p-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-['Exo_2']">Processing your response...</span>
            </div>
          )}

          {isComplete && (
            <div className="bg-[#1B1B1B] border-2 border-[#8AFF00] rounded-lg p-6 neon-border-green">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-[#8AFF00]" />
                <h3 className="text-xl font-['Orbitron'] text-[#8AFF00]">
                  Assessment Complete!
                </h3>
              </div>
              <p className="text-gray-300 font-['Exo_2'] mb-6">
                Great job! You've completed all the questions. Click below to view your personalized results and recommendations.
              </p>
              <CyberButton
                onClick={handleComplete}
                variant="accent"
                className="w-full"
              >
                View Results
              </CyberButton>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent pt-8 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSubmit={handleSubmit}
            disabled={loading || isComplete}
            placeholder={isComplete ? "Assessment complete!" : "Type your answer..."}
          />
        </div>
      </div>
    </main>
  );
}
