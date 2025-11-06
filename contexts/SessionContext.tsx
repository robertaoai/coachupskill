'use client';

import React, { createContext, useContext } from 'react';
import { useSessionStorage } from '@/hooks/useSessionStorage';

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
  isComplete?: boolean;
}

interface SessionContextType {
  sessionId: string | null;
  firstPrompt: string;
  chatHistory: Message[];
  isLoading: boolean;
  isComplete: boolean;
  setSession: (sessionId: string, firstPrompt: string, chatHistory?: Message[]) => void;
  updateChatHistory: (messages: Message[]) => void;
  clearSession: () => void;
  hasValidSession: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { value: storedSession, update, clear, loading } = useSessionStorage('ai_coach_session');

  // Parse session data
  const sessionData: SessionData | null = storedSession 
    ? (() => {
        try {
          return JSON.parse(storedSession);
        } catch {
          return null;
        }
      })()
    : null;

  const setSession = (
    sid: string,
    prompt: string,
    history: Message[] = []
  ) => {
    console.log('💾 SessionContext - Setting session:', sid);
    
    const initialHistory = history.length > 0 ? history : [{
      id: 'initial',
      content: prompt,
      isUser: false,
      timestamp: new Date().toISOString()
    }];
    
    const sessionData: SessionData = {
      sessionId: sid,
      firstPrompt: prompt,
      chatHistory: initialHistory,
      savedAt: new Date().toISOString()
    };
    
    update(JSON.stringify(sessionData));
    console.log('✅ SessionContext - Session updated');
  };

  const updateChatHistory = (messages: Message[]) => {
    console.log('💬 SessionContext - Updating chat history:', messages.length, 'messages');
    
    if (sessionData) {
      const updatedData: SessionData = {
        ...sessionData,
        chatHistory: messages,
        savedAt: new Date().toISOString()
      };
      
      update(JSON.stringify(updatedData));
      console.log('✅ SessionContext - Chat history updated');
    }
  };

  const clearSession = () => {
    console.log('🗑️ SessionContext - Clearing session');
    clear();
  };

  const hasValidSession = () => {
    const isValid = !!sessionData?.sessionId;
    console.log('🔍 SessionContext - Session valid:', isValid);
    return isValid;
  };

  const value: SessionContextType = {
    sessionId: sessionData?.sessionId || null,
    firstPrompt: sessionData?.firstPrompt || '',
    chatHistory: sessionData?.chatHistory || [],
    isLoading: loading,
    isComplete: sessionData?.isComplete || false,
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
