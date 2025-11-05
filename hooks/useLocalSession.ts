'use client';

import { useState, useEffect } from 'react';

const SESSION_STORAGE_KEY = 'ai_coach_session';

interface SessionData {
  sessionId: string;
  firstPrompt: string;
  chatHistory: Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
  }>;
  savedAt: string;
}

export function useLocalSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstPrompt, setFirstPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<SessionData['chatHistory']>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        try {
          const parsed: SessionData = JSON.parse(stored);
          console.log('📦 useLocalSession - Loaded from localStorage:', parsed);
          setSessionId(parsed.sessionId);
          setFirstPrompt(parsed.firstPrompt);
          setChatHistory(parsed.chatHistory || []);
        } catch (e) {
          console.error('❌ useLocalSession - Failed to parse:', e);
        }
      }
    }
  }, []);

  const saveSession = (
    sid: string,
    prompt: string,
    history: SessionData['chatHistory']
  ) => {
    console.log('💾 useLocalSession - Saving session:', { 
      sessionId: sid, 
      firstPrompt: prompt,
      historyLength: history.length 
    });
    
    setSessionId(sid);
    setFirstPrompt(prompt);
    setChatHistory(history);
    
    if (typeof window !== 'undefined') {
      const sessionData: SessionData = {
        sessionId: sid,
        firstPrompt: prompt,
        chatHistory: history,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('✅ useLocalSession - Session saved to localStorage');
    }
  };

  const clearSession = () => {
    console.log('🗑️ useLocalSession - Clearing session...');
    
    setSessionId(null);
    setFirstPrompt('');
    setChatHistory([]);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      console.log('✅ useLocalSession - Session cleared from localStorage');
    }
  };

  return {
    sessionId,
    firstPrompt,
    chatHistory,
    saveSession,
    clearSession,
  };
}
