const API_BASE = 'https://robertcoach.app.n8n.cloud';

export interface StartSessionResponse {
  session: {
    id: string;
    user_id: string;
    persona_hint: string;
    started_at: string;
    completed_at: string | null;
    readiness_score: number | null;
    urgency_level: string | null;
    tone_score: number | null;
    roi_estimate: string | null;
    paid_annex: boolean;
    brief_url: string | null;
    pdf_url: string | null;
    metadata: Record<string, any> | null;
    current_state: string;
    created_at: string;
    updated_at: string;
  };
  first_prompt: string;
}

export interface AnswerResponse {
  reply_text: string;
  recommended_action: string | null;
  tags: string[] | null;
  explainability: string | null;
  session_status: string;
  next_prompt: string;
  is_complete: boolean;
}

export interface CompleteResponse {
  readiness_score: number;
  roi_estimate: string;
  summary_html: string;
}

export async function startSession(email: string, personaHint: string): Promise<StartSessionResponse> {
  try {
    console.log('🚀 Starting session with:', { email, personaHint });
    const response = await fetch(`${API_BASE}/webhook/session/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        persona_hint: personaHint,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Start session failed:', response.status, errorText);
      throw new Error(`Failed to start session: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Raw response received:', data);
    console.log('✅ Response type:', typeof data);
    console.log('✅ Is array:', Array.isArray(data));
    
    // Validate response is an object with required properties
    if (typeof data !== 'object' || data === null) {
      console.error('❌ Response is not an object:', typeof data);
      throw new Error('Invalid response format: expected object');
    }

    // Validate session object exists
    if (!data.session) {
      console.error('❌ Missing session object in response:', data);
      throw new Error('Invalid response: missing session object');
    }

    // Validate session.id exists
    if (!data.session.id) {
      console.error('❌ Missing session.id:', data.session);
      throw new Error('Invalid response: missing session ID');
    }
    
    // Validate first_prompt exists
    if (!data.first_prompt) {
      console.error('❌ Missing first_prompt:', data);
      throw new Error('Invalid response: missing first prompt');
    }
    
    console.log('✅ Session ID:', data.session.id);
    console.log('✅ First prompt:', data.first_prompt);
    console.log('✅ Validation passed, returning data');
    
    return {
      session: data.session,
      first_prompt: data.first_prompt
    };
  } catch (error) {
    console.error('💥 Start session error:', error);
    console.error('💥 Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('💥 Error message:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to start session');
  }
}

// CRITICAL: Export postAnswer function
export async function postAnswer(
  sessionId: string,
  questionId: string,
  answer: string
): Promise<AnswerResponse> {
  try {
    console.log('📤 Posting answer for session:', sessionId, 'question:', questionId);
    const response = await fetch(
      `${API_BASE}/webhook/6a535534-b0e8-48b5-9bbe-c5b72c35b895/session/${sessionId}/answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question_id: questionId,
          answer 
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Post answer failed:', response.status, errorText);
      throw new Error(`Failed to post answer: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Answer posted:', data);
    return data;
  } catch (error) {
    console.error('💥 Post answer error:', error);
    throw error;
  }
}

export async function submitAnswer(
  sessionId: string,
  answer: string
): Promise<AnswerResponse> {
  try {
    console.log('📤 Submitting answer for session:', sessionId);
    const response = await fetch(
      `${API_BASE}/webhook/6a535534-b0e8-48b5-9bbe-c5b72c35b895/session/${sessionId}/answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Submit answer failed:', response.status, errorText);
      throw new Error(`Failed to submit answer: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Answer submitted:', data);
    return data;
  } catch (error) {
    console.error('💥 Submit answer error:', error);
    throw error;
  }
}

export async function completeSession(
  sessionId: string,
  optIn: boolean
): Promise<CompleteResponse> {
  try {
    console.log('🏁 Completing session:', sessionId, 'optIn:', optIn);
    const response = await fetch(`${API_BASE}/webhook/session/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        opt_in: optIn,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Complete session failed:', response.status, errorText);
      throw new Error(`Failed to complete session: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Session completed:', data);
    
    // Handle array response format if needed
    if (Array.isArray(data) && data.length > 0) {
      const result = data[0];
      return {
        readiness_score: result.readiness_score,
        roi_estimate: result.roi_estimate,
        summary_html: result.summary_html
      };
    }
    
    return data;
  } catch (error) {
    console.error('💥 Complete session error:', error);
    throw error;
  }
}
