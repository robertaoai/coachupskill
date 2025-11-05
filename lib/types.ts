export interface StartSessionResponse {
  session_id: string;
  first_prompt: string;
}

export interface AnswerResponse {
  reply_text: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
  session_status?: 'answered' | 'in_progress';
}

export interface SessionState {
  status: 'answered' | 'in_progress';
}

export interface CompleteResponse {
  status: string;
  message: string;
  readiness_score: number;
  roi_estimate: {
    estimated_dollars: number;
    annual_hours_saved: number;
    team_efficiency_gain: string;
  };
  summary_html: string;
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
