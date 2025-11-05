'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitAnswer } from '@/lib/api';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';

const SESSION_STORAGE_KEY = 'ai_coach_session';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface SessionData {
  sessionId: string;
  firstPrompt: string;
  chatHistory: Message[];
  savedAt: string;
}

export default function AnswerFlow() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstPrompt, setFirstPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('=== ANSWER FLOW MOUNTED ===');
    
    // Load session from localStorage
    const loadSession = () => {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      console.log('📦 Raw localStorage data:', stored);
      
      if (!stored) {
        console.error('❌ No session data in localStorage');
        toast.error('No active session found');
        router.push('/session-start-flow');
        return;
      }

      try {
        const parsed: SessionData = JSON.parse(stored);
        console.log('✅ Parsed session data:', parsed);
        console.log('✅ Session ID:', parsed.sessionId);
        console.log('✅ First prompt:', parsed.firstPrompt);
        console.log('✅ Chat history:', parsed.chatHistory);

        if (!parsed.sessionId) {
          console.error('❌ No session ID in parsed data');
          toast.error('Invalid session data');
          router.push('/session-start-flow');
          return;
        }

        setSessionId(parsed.sessionId);
        setFirstPrompt(parsed.firstPrompt);
        setMessages(parsed.chatHistory || []);
        setIsLoading(false);
        
        console.log('✅ Session loaded successfully');
      } catch (e) {
        console.error('❌ Failed to parse session from localStorage:', e);
        toast.error('Failed to load session');
        router.push('/session-start-flow');
      }
    };

    loadSession();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAnswer.trim() || !sessionId) {
      return;
    }

    console.log('=== SUBMITTING ANSWER ===');
    console.log('Session ID:', sessionId);
    console.log('Answer:', currentAnswer);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: currentAnswer,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentAnswer('');
    setIsSubmitting(true);

    try {
      console.log('📤 Calling submitAnswer API...');
      const response = await submitAnswer(sessionId, currentAnswer);
      
      console.log('✅ Response received:', response);

      if (response.is_complete) {
        console.log('🏁 Assessment complete, navigating to results...');
        router.push('/results');
        return;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.next_prompt,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Save updated chat history
      console.log('💾 Saving updated chat history...');
      const sessionData: SessionData = {
        sessionId,
        firstPrompt,
        chatHistory: finalMessages,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      
    } catch (error) {
      console.error('=== SUBMIT ANSWER ERROR ===');
      console.error('Error:', error);
      
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit answer. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF] mx-auto mb-4" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-[#00FFFF]/20 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold font-['Orbitron'] text-[#00FFFF] neon-text-cyan">
            AI Skills Assessment
          </h1>
          <p className="text-xs text-gray-400 mt-1">Session: {sessionId.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.isUser
                    ? 'bg-[#00FFFF]/20 border border-[#00FFFF]/40 text-white'
                    : 'bg-black/40 backdrop-blur-xl border border-[#00FFFF]/20 text-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-black/40 backdrop-blur-xl border-t border-[#00FFFF]/20 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={isSubmitting}
              className="flex-1 bg-black/60 border-[#00FFFF]/20 text-white placeholder:text-gray-500 focus:border-[#00FFFF] resize-none"
              rows={3}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !currentAnswer.trim()}
              className="bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-['Orbitron'] font-bold neon-glow-cyan"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
