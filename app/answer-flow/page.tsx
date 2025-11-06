'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SessionStarter } from '@/components/SessionStarter';
import { SessionResetter } from '@/components/SessionResetter';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { submitAnswer } from '@/lib/api';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export default function AnswerFlow() {
  const { value: storedSessionId, loading: sessionLoading } = useSessionStorage('ai_coach_session');
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session from localStorage
  useEffect(() => {
    if (storedSessionId && !sessionLoading) {
      try {
        const parsed = JSON.parse(storedSessionId);
        console.log('📦 AnswerFlow - Loaded session:', parsed.sessionId);
        setSessionId(parsed.sessionId);
        setChatHistory(parsed.chatHistory || []);
        setSessionReady(true);
      } catch (e) {
        console.error('❌ AnswerFlow - Failed to parse session:', e);
      }
    }
  }, [storedSessionId, sessionLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSessionReady = (newSessionId: string, firstPrompt: string) => {
    console.log('🎯 AnswerFlow - Session ready callback triggered');
    setSessionId(newSessionId);
    setChatHistory([{
      id: 'initial',
      content: firstPrompt,
      isUser: false,
      timestamp: new Date().toISOString()
    }]);
    setSessionReady(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAnswer.trim() || !sessionId) {
      return;
    }

    console.log('📤 AnswerFlow - Submitting answer...');
    console.log('🆔 Session ID:', sessionId);
    console.log('💬 Answer:', currentAnswer);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: currentAnswer,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatHistory, userMessage];
    setChatHistory(updatedMessages);
    setCurrentAnswer('');
    setIsSubmitting(true);

    try {
      const response = await submitAnswer(sessionId, currentAnswer);
      
      console.log('✅ AnswerFlow - Response received:', response);

      if (response.is_complete) {
        console.log('🏁 AnswerFlow - Assessment complete!');
        // Store completion state
        if (typeof window !== 'undefined') {
          const sessionData = JSON.parse(localStorage.getItem('ai_coach_session') || '{}');
          sessionData.isComplete = true;
          localStorage.setItem('ai_coach_session', JSON.stringify(sessionData));
        }
        // Navigate to results
        window.location.href = '/results';
        return;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.next_prompt,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setChatHistory(finalMessages);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const sessionData = JSON.parse(localStorage.getItem('ai_coach_session') || '{}');
        sessionData.chatHistory = finalMessages;
        localStorage.setItem('ai_coach_session', JSON.stringify(sessionData));
      }
      
    } catch (error) {
      console.error('❌ AnswerFlow - Error:', error);
      
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit answer. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin mx-auto mb-4" />
          <p className="text-[#00FFFF] font-['Orbitron'] text-lg">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  // No session - show starter
  if (!sessionReady || !sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/40 backdrop-blur-xl border-2 border-[#00FFFF]/20 rounded-2xl p-8">
          <h1 className="text-3xl font-bold font-['Orbitron'] text-[#00FFFF] neon-text-cyan mb-6 text-center">
            AI Skills Assessment
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            Start your personalized AI readiness assessment
          </p>
          <SessionStarter
            email="user@example.com"
            personaHint="Software Manager"
            onSessionReady={handleSessionReady}
          />
        </div>
      </div>
    );
  }

  // Session active - show chat
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-[#00FFFF]/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-['Orbitron'] text-[#00FFFF] neon-text-cyan">
              AI Skills Assessment
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Session: {sessionId.slice(0, 8)}...
            </p>
          </div>
          <SessionResetter variant="ghost" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {chatHistory.map((message) => (
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
