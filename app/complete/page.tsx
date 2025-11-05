'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CompletionForm } from '@/components/CompletionForm';
import { SummaryCard } from '@/components/SummaryCard';
import { HtmlSummaryView } from '@/components/HtmlSummaryView';
import { completeSession } from '@/lib/api';
import { CompleteResponse } from '@/lib/types';
import { useLocalSession } from '@/hooks/useLocalSession';
import { Loader2, Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { CyberButton } from '@/components/CyberButton';

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const { clearSession } = useLocalSession();
  
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<CompleteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      toast.error('No session ID provided');
      router.push('/');
    }
  }, [sessionId, router]);

  const handleComplete = async (optIn: boolean) => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('Starting complete session with optIn:', optIn);
      const result = await completeSession(sessionId, optIn);
      console.log('Complete session result:', result);
      
      setSummary(result);
      toast.success('Assessment completed successfully!');
    } catch (err: any) {
      console.error('Complete session error:', err);
      setError(err.message || 'Failed to complete assessment');
      toast.error('Failed to complete assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAssessment = () => {
    console.log('🔄 Starting new assessment...');
    clearSession();
    toast.success('Session reset! Starting new assessment...');
    router.push('/');
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin mx-auto mb-4" />
          <p className="text-[#00FFFF] font-['Orbitron']">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between py-6 mb-8 border-b-2 border-[#00FFFF]/20">
        <CyberButton
          variant="secondary"
          onClick={handleNewAssessment}
          className="px-3 py-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Assessment
        </CyberButton>
        
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <Trophy className="w-6 h-6 text-[#8AFF00]" />
            <h1 className="text-3xl font-['Orbitron'] font-black text-[#8AFF00] neon-glow-green">
              RESULTS
            </h1>
          </div>
        </div>
        
        <div className="w-32" />
      </header>

      <div className="flex-1 space-y-8">
        {!summary && !loading && (
          <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-6 neon-border-cyan">
            <h2 className="text-xl font-['Orbitron'] text-[#00FFFF] mb-4">
              Finalize Your Assessment
            </h2>
            <CompletionForm onComplete={handleComplete} />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin mb-4" />
            <p className="text-[#00FFFF] font-['Orbitron'] text-lg">
              Analyzing your responses...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-[#FF0080]/10 border-2 border-[#FF0080] rounded-lg p-6 neon-border-pink">
            <p className="text-[#FF0080] text-center">⚠ {error}</p>
            <CyberButton
              onClick={() => setError(null)}
              variant="primary"
              className="w-full mt-4"
            >
              Try Again
            </CyberButton>
          </div>
        )}

        {summary && (
          <div className="space-y-8">
            <SummaryCard
              readiness_score={summary.readiness_score}
              roi_estimate={summary.roi_estimate}
            />
            
            <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-6 neon-border-cyan">
              <h2 className="text-2xl font-['Orbitron'] font-bold text-[#00FFFF] mb-6">
                Detailed Summary
              </h2>
              <HtmlSummaryView html_summary={summary.summary_html} />
            </div>

            <div className="flex justify-center pb-8">
              <CyberButton
                variant="primary"
                onClick={handleNewAssessment}
                className="px-8 py-4 text-lg"
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                Next Assessment
              </CyberButton>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 mt-8 border-t border-[#00FFFF]/20">
        <p className="text-xs text-gray-500 font-['Exo_2']">
          Your data is secure and confidential • Built with ChatAndBuild
        </p>
      </footer>
    </main>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#00FFFF] animate-spin" />
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
