'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

interface SessionContextType {
  sessionId: string | null;
  firstPrompt: string;
  chatHistory: Message[];
  isLoading: boolean;
  setSession: (sessionId: string, firstPrompt: string, chatHistory?: Message[]) => void;
  updateChatHistory: (messages: Message[]) => void;
  clearSession: () => void;
  hasValidSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstPrompt, setFirstPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    console.log('🔄 SessionProvider - Initializing...');
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (stored) {
        try {
          const parsed: SessionData = JSON.parse(stored);
          console.log('✅ SessionProvider - Loaded session:', parsed.sessionId);
          
          setSessionId(parsed.sessionId);
          setFirstPrompt(parsed.firstPrompt);
          setChatHistory(parsed.chatHistory || []);
        } catch (e) {
          console.error('❌ SessionProvider - Failed to parse session:', e);
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } else {
        console.log('ℹ️ SessionProvider - No existing session found');
      }
    }
    
    setIsLoading(false);
  }, []);

  const setSession = useCallback((
    sid: string,
    prompt: string,
    history: Message[] = []
  ) => {
    console.log('💾 SessionProvider - Setting session:', sid);
    
    const initialHistory = history.length > 0 ? history : [{
      id: 'initial',
      content: prompt,
      isUser: false,
      timestamp: new Date().toISOString()
    }];
    
    setSessionId(sid);
    setFirstPrompt(prompt);
    setChatHistory(initialHistory);
    
    if (typeof window !== 'undefined') {
      const sessionData: SessionData = {
        sessionId: sid,
        firstPrompt: prompt,
        chatHistory: initialHistory,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('✅ SessionProvider - Session saved to localStorage');
    }
  }, []);

  const updateChatHistory = useCallback((messages: Message[]) => {
    console.log('💬 SessionProvider - Updating chat history:', messages.length, 'messages');
    
    setChatHistory(messages);
    
    if (typeof window !== 'undefined' && sessionId) {
      const sessionData: SessionData = {
        sessionId,
        firstPrompt,
        chatHistory: messages,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('✅ SessionProvider - Chat history updated in localStorage');
    }
  }, [sessionId, firstPrompt]);

  const clearSession = useCallback(() => {
    console.log('🗑️ SessionProvider - Clearing session...');
    
    setSessionId(null);
    setFirstPrompt('');
    setChatHistory([]);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      console.log('✅ SessionProvider - Session cleared from localStorage');
    }
  }, []);

  const hasValidSession = useCallback(() => {
    const isValid = !!sessionId && sessionId.length > 0;
    console.log('🔍 SessionProvider - Session valid:', isValid);
    return isValid;
  }, [sessionId]);

  const value: SessionContextType = {
    sessionId,
    firstPrompt,
    chatHistory,
    isLoading,
    setSession,
    updateChatHistory,
    clearSession,
    hasValidSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}
