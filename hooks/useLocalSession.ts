'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

const SESSION_STORAGE_KEY = 'ai_coach_session';

export function useLocalSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('📦 Loaded session from localStorage:', parsed);
          setSessionId(parsed.sessionId);
          setChatHistory(parsed.chatHistory || []);
          setCurrentQuestionId(parsed.currentQuestionId || 'q1');
        } catch (e) {
          console.error('❌ Failed to parse session from localStorage:', e);
        }
      }
    }
  }, []);

  const saveSession = (
    sid: string, 
    history: ChatMessage[], 
    qid: string
  ) => {
    console.log('💾 Saving session:', { sessionId: sid, historyLength: history.length, questionId: qid });
    
    setSessionId(sid);
    setChatHistory(history);
    setCurrentQuestionId(qid);
    
    if (typeof window !== 'undefined') {
      const sessionData = {
        sessionId: sid,
        chatHistory: history,
        currentQuestionId: qid,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('✅ Session saved to localStorage');
    }
  };

  const clearSession = () => {
    console.log('🗑️ Clearing session...');
    
    setSessionId(null);
    setChatHistory([]);
    setCurrentQuestionId('q1');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      console.log('✅ Session cleared from localStorage');
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
