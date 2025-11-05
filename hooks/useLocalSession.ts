'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

export function useLocalSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ai_coach_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSessionId(parsed.sessionId);
          setChatHistory(parsed.chatHistory || []);
          setCurrentQuestionId(parsed.currentQuestionId || 'q1');
        } catch (e) {
          console.error('Failed to parse session', e);
        }
      }
    }
  }, []);

  const saveSession = (
    sid: string, 
    history: ChatMessage[], 
    qid: string
  ) => {
    setSessionId(sid);
    setChatHistory(history);
    setCurrentQuestionId(qid);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_coach_session', JSON.stringify({
        sessionId: sid,
        chatHistory: history,
        currentQuestionId: qid,
      }));
    }
  };

  const clearSession = () => {
    setSessionId(null);
    setChatHistory([]);
    setCurrentQuestionId('q1');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_coach_session');
    }
  };

  return {
    sessionId,
    chatHistory,
    currentQuestionId,
    saveSession,
    clearSession,
  };
}
