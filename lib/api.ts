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
    metadata: Record<string, any>;
    current_state: string;
    created_at: string;
    updated_at: string;
  };
  first_prompt: string;
}

export interface AnswerResponse {
  next_prompt: string;
  is_complete: boolean;
}

export interface CompleteResponse {
  readiness_score: number;
  roi_estimate: string;
  summary_html: string;
}

export async function startSession(): Promise<StartSessionResponse> {
  try {
    console.log('🚀 Starting session...');
    const response = await fetch(`${API_BASE}/webhook/session/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Start session failed:', response.status, errorText);
      throw new Error(`Failed to start session: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Session started:', data);
    
    // Handle array response format
    if (Array.isArray(data) && data.length > 0) {
      const sessionData = data[0];
      return {
        session: sessionData.session,
        first_prompt: sessionData.first_prompt
      };
    }
    
    throw new Error('Invalid response format from start session endpoint');
  } catch (error) {
    console.error('💥 Start session error:', error);
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
    
    // Handle array response format
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
