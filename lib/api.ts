import { StartResponse, AnswerResponse, CompleteResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_N8N_URL;

export async function postStartSession(email: string, persona_hint: string): Promise<StartResponse> {
  const res = await fetch(`${API_BASE}/webhook/session/start`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      persona_hint, 
      metadata: { source: 'web' } 
    }),
  });

  const data = await res.json();
  
  if (!res.ok || data?.[0]?.json?.status === 'error') {
    const errs = data?.[0]?.json?.errors || ['Unknown error'];
    const err = new Error('Validation failed') as any;
    err.validation = errs;
    throw err;
  }

  return data as StartResponse;
}

export async function postAnswer(
  sessionId: string, 
  questionId: string, 
  answerText: string
): Promise<AnswerResponse> {
  const res = await fetch(`${API_BASE}/webhook/session/${sessionId}/answer`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      session_id: sessionId, 
      question_id: questionId, 
      answer_text: answerText 
    }),
  });

  if (!res.ok) {
    throw new Error(`Answer failed: ${res.status}`);
  }

  const data = await res.json();
  return data as AnswerResponse;
}

export async function completeSession(
  sessionId: string, 
  optIn: boolean
): Promise<CompleteResponse> {
  const res = await fetch(`${API_BASE}/webhook/session/complete`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      session_id: sessionId, 
      opt_in_email: optIn 
    }),
  });

  if (!res.ok) {
    throw new Error(`Complete failed: ${res.status}`);
  }

  const data = await res.json();
  return data as CompleteResponse;
}
