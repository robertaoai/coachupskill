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
    console.log('=== START SESSION REQUEST ===');
    console.log('API_BASE:', API_BASE);
    console.log('Full URL:', `${API_BASE}/webhook/session/start`);
    console.log('Request payload:', { email, persona_hint });
    
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
    console.log('Response ok:', res.ok);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    const text = await res.text();
    console.log('Response text (raw):', text);

    let data;
    try {
      data = JSON.parse(text);
      console.log('Parsed JSON:', data);
    } catch (e) {
      console.error('JSON parse error:', e);
      console.error('Failed to parse text:', text.substring(0, 500));
      throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
    }

    if (!res.ok) {
      console.error('Request failed with status:', res.status);
      console.error('Error data:', data);
      throw new Error(`Request failed with status ${res.status}: ${JSON.stringify(data)}`);
    }

    // Handle N8N array response with nested session object
    if (Array.isArray(data)) {
      console.log('Response is array, length:', data.length);
      if (data.length > 0) {
        const firstItem = data[0];
        console.log('First item:', firstItem);
        
        // Check for error status in response
        if (firstItem?.status === 'error') {
          const errors = firstItem?.errors || ['Unknown error'];
          console.error('Validation errors:', errors);
          const err = new Error('Validation failed') as any;
          err.validation = errors;
          throw err;
        }

        // Extract session data from N8N response structure
        // N8N returns: [{ session: { id, ... }, first_prompt }]
        if (firstItem?.session?.id && firstItem?.first_prompt) {
          const result = {
            session_id: firstItem.session.id,
            first_prompt: firstItem.first_prompt,
            first_question: 'q1',
          };
          console.log('Extracted result from N8N array response:', result);
          return result;
        }

        // Fallback: check if it's wrapped in json property
        if (firstItem?.json?.session?.id && firstItem?.json?.first_prompt) {
          const result = {
            session_id: firstItem.json.session.id,
            first_prompt: firstItem.json.first_prompt,
            first_question: 'q1',
          };
          console.log('Extracted result from json wrapper:', result);
          return result;
        }
      }
    }

    // Handle direct object response (if N8N changes format)
    if (data?.session?.id && data?.first_prompt) {
      console.log('Direct object response with nested session');
      const result = {
        session_id: data.session.id,
        first_prompt: data.first_prompt,
        first_question: 'q1',
      };
      console.log('Extracted result:', result);
      return result;
    }

    // Legacy format fallback
    if (data?.session_id && data?.first_prompt) {
      console.log('Legacy flat response format');
      return data as StartResponse;
    }

    console.error('Unexpected response structure:', data);
    console.error('Response type:', typeof data);
    console.error('Response keys:', Object.keys(data || {}));
    if (Array.isArray(data) && data.length > 0) {
      console.error('First item keys:', Object.keys(data[0] || {}));
      if (data[0]?.session) {
        console.error('Session keys:', Object.keys(data[0].session || {}));
      }
    }
    throw new Error('Invalid response structure from webhook');

  } catch (error) {
    console.error('=== START SESSION ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    throw error;
  }
}

export async function postAnswer(
  sessionId: string, 
  questionId: string, 
  answerText: string
): Promise<AnswerResponse> {
  try {
    console.log('=== POST ANSWER REQUEST ===');
    console.log('Session ID:', sessionId);
    console.log('Question ID:', questionId);
    console.log('Answer text:', answerText);

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
    console.log('Answer response text:', text);
    const data = JSON.parse(text);

    // Handle array response from N8N
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.json || data[0];
    }

    return data as AnswerResponse;

  } catch (error) {
    console.error('=== POST ANSWER ERROR ===');
    console.error('Error:', error);
    throw error;
  }
}

export async function completeSession(
  sessionId: string, 
  optIn: boolean
): Promise<CompleteResponse> {
  try {
    console.log('=== COMPLETE SESSION REQUEST ===');
    console.log('Session ID:', sessionId);
    console.log('Opt-in:', optIn);

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
    console.log('Complete response text:', text);
    const data = JSON.parse(text);

    // Handle array response from N8N
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.json || data[0];
    }

    return data as CompleteResponse;

  } catch (error) {
    console.error('=== COMPLETE SESSION ERROR ===');
    console.error('Error:', error);
    throw error;
  }
}
