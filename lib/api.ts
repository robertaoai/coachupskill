import { ChatMessage } from './types';

const API_BASE = 'https://robertcoach.app.n8n.cloud';

export interface StartResponse {
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

export interface CompleteResponse {
  html_summary: string;
  readiness_score: number;
  roi_metrics: {
    time_saved_hours: number;
    productivity_gain_percent: number;
    estimated_annual_value: number;
  };
}

export async function postStartSession(email: string, persona_hint: string): Promise<StartResponse> {
  try {
    console.log('Starting session with:', { email, persona_hint });
    
    const res = await fetch(`${API_BASE}/webhook/session/start`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        persona_hint, 
        metadata: { source: 'web' } 
      }),
    });

    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    const text = await res.text();
    console.log('Response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
    }

    if (!res.ok) {
      console.error('Request failed:', data);
      throw new Error(`Request failed with status ${res.status}: ${JSON.stringify(data)}`);
    }

    // Handle array response from N8N
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      
      // Check for error status in response
      if (firstItem?.json?.status === 'error') {
        const errors = firstItem?.json?.errors || ['Unknown error'];
        const err = new Error('Validation failed') as any;
        err.validation = errors;
        throw err;
      }

      // Extract session data from N8N response structure
      if (firstItem?.json) {
        return {
          session_id: firstItem.json.session_id,
          first_prompt: firstItem.json.first_prompt,
          first_question: firstItem.json.first_question || 'q1',
        };
      }
    }

    // Handle direct object response
    if (data?.session_id && data?.first_prompt) {
      return data as StartResponse;
    }

    console.error('Unexpected response structure:', data);
    throw new Error('Invalid response structure from webhook');

  } catch (error) {
    console.error('postStartSession error:', error);
    throw error;
  }
}

export async function postAnswer(
  sessionId: string, 
  questionId: string, 
  answerText: string
): Promise<AnswerResponse> {
  try {
    console.log('Posting answer:', { sessionId, questionId, answerText });

    const res = await fetch(`${API_BASE}/webhook/session/${sessionId}/answer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        session_id: sessionId, 
        question_id: questionId, 
        answer_text: answerText 
      }),
    });

    console.log('Answer response status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('Answer failed:', text);
      throw new Error(`Answer failed: ${res.status} - ${text}`);
    }

    const text = await res.text();
    const data = JSON.parse(text);

    // Handle array response from N8N
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.json || data[0];
    }

    return data as AnswerResponse;

  } catch (error) {
    console.error('postAnswer error:', error);
    throw error;
  }
}

export async function completeSession(
  sessionId: string, 
  optIn: boolean
): Promise<CompleteResponse> {
  try {
    console.log('Completing session:', { sessionId, optIn });

    const res = await fetch(`${API_BASE}/webhook/session/complete`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        session_id: sessionId, 
        opt_in_email: optIn 
      }),
    });

    console.log('Complete response status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('Complete failed:', text);
      throw new Error(`Complete failed: ${res.status} - ${text}`);
    }

    const text = await res.text();
    const data = JSON.parse(text);

    // Handle array response from N8N
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.json || data[0];
    }

    return data as CompleteResponse;

  } catch (error) {
    console.error('completeSession error:', error);
    throw error;
  }
}
