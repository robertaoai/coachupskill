import { ChatMessage } from './types';

const API_BASE = 'https://robertcoach.app.n8n.cloud';
const WEBHOOK_UUID = '6a535534-b0e8-48b5-9bbe-c5b72c35b895';

export interface StartResponse {
  session_id: string;
  first_prompt: string;
  first_question: string;
}

export interface AnswerResponse {
  reply_text: string;
  next_prompt?: string;
  next_question?: string;
  recommended_action?: string;
  tags?: string[];
  explainability?: string;
  session_status?: 'answered' | 'in_progress';
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

    // CORRECT URL FORMAT: /webhook/{UUID}/session/{session_id}/answer
    const url = `${API_BASE}/webhook/${WEBHOOK_UUID}/session/${sessionId}/answer`;
    console.log('Full answer URL:', url);

    const res = await fetch(url, {
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
      const firstItem = data[0];
      console.log('Answer response first item:', firstItem);
      
      // Parse current_state JSON string to extract status
      let sessionStatus: 'answered' | 'in_progress' = 'in_progress';
      if (firstItem?.current_state) {
        try {
          console.log('Raw current_state:', firstItem.current_state);
          const currentState = JSON.parse(firstItem.current_state);
          console.log('Parsed current_state:', currentState);
          sessionStatus = currentState.status || 'in_progress';
          console.log('Extracted session status:', sessionStatus);
        } catch (e) {
          console.error('Failed to parse current_state:', e);
        }
      }

      const response: AnswerResponse = {
        reply_text: firstItem?.json?.reply_text || firstItem?.reply_text || 'No response',
        recommended_action: firstItem?.json?.recommended_action || firstItem?.recommended_action,
        tags: firstItem?.json?.tags || firstItem?.tags,
        explainability: firstItem?.json?.explainability || firstItem?.explainability,
        session_status: sessionStatus,
      };

      console.log('Final answer response:', response);
      return response;
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

    const url = `${API_BASE}/webhook/session/complete`;
    console.log('Full complete URL:', url);

    const res = await fetch(url, {
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
    console.log('Complete response text (raw):', text);
    
    const data = JSON.parse(text);
    console.log('Complete response parsed:', data);

    // Handle array response from N8N - extract first element
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      console.log('Complete response first item:', firstItem);
      
      // Validate required fields
      if (!firstItem.readiness_score || !firstItem.roi_estimate || !firstItem.summary_html) {
        console.error('Missing required fields in response:', firstItem);
        throw new Error('Invalid response structure - missing required fields');
      }

      const result: CompleteResponse = {
        status: firstItem.status || 'success',
        message: firstItem.message || 'Assessment complete',
        readiness_score: firstItem.readiness_score,
        roi_estimate: {
          estimated_dollars: firstItem.roi_estimate.estimated_dollars,
          annual_hours_saved: firstItem.roi_estimate.annual_hours_saved,
          team_efficiency_gain: firstItem.roi_estimate.team_efficiency_gain,
        },
        summary_html: firstItem.summary_html,
      };

      console.log('Final complete response:', result);
      return result;
    }

    // Fallback for direct object response
    if (data?.readiness_score && data?.roi_estimate && data?.summary_html) {
      console.log('Direct object response format');
      return data as CompleteResponse;
    }

    console.error('Unexpected complete response structure:', data);
    throw new Error('Invalid response structure from complete endpoint');

  } catch (error) {
    console.error('=== COMPLETE SESSION ERROR ===');
    console.error('Error:', error);
    throw error;
  }
}
