export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
}

export interface SessionData {
  sessionId: string;
  messages: ChatMessage[];
  currentQuestion: string;
  createdAt: Date;
}

export interface StartSessionResponse {
  session_id: string;
  first_prompt: string;
  first_question: string;
}

export interface AnswerResponse {
  next_prompt?: string;
  next_question?: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
}

export interface CompletionResponse {
  html_summary: string;
  readiness_score: number;
  roi_metrics: {
    time_saved_hours: number;
    productivity_gain_percent: number;
    estimated_annual_value: number;
  };
}
