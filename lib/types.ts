export interface StartSessionResponse {
  session_id: string;
  first_prompt: string;
}

export interface AnswerResponse {
  reply_text: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
}

export interface CompleteResponse {
  readiness_score: number;
  roi_metrics: {
    time_saved_hours: number;
    cost_reduction_percent: number;
    productivity_gain_percent: number;
  };
  html_summary: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
  timestamp: Date;
}
