'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CyberButton } from '@/components/CyberButton';
import { startSession } from '@/lib/api';
import { useLocalSession } from '@/hooks/useLocalSession';
import { Loader2, Sparkles, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const { saveSession } = useLocalSession();
  const [loading, setLoading] = useState(false);

  const handleStartAssessment = async () => {
    setLoading(true);
    try {
      console.log('🎯 Starting new assessment...');
      const response = await startSession();
      
      console.log('📦 Session response:', response);
      console.log('🆔 Session ID:', response.session.id);
      console.log('💬 First prompt:', response.first_prompt);

      // Save session data to localStorage
      saveSession(
        response.session.id,
        response.first_prompt,
        []
      );

      toast.success('Assessment started!');
      router.push('/assessment');
    } catch (error: any) {
      console.error('❌ Failed to start assessment:', error);
      toast.error(error.message || 'Failed to start assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-full px-6 py-2 mb-6 neon-border-cyan">
            <Sparkles className="w-4 h-4 text-[#00FFFF]" />
            <span className="text-sm font-['Exo_2'] text-[#00FFFF]">AI READINESS ASSESSMENT</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-['Orbitron'] font-black text-[#00FFFF] mb-4 neon-glow-cyan">
            DISCOVER YOUR
            <br />
            AI POTENTIAL
          </h1>
          
          <p className="text-xl text-gray-300 font-['Exo_2'] mb-8">
            Take our interactive assessment to unlock personalized insights
            and accelerate your AI transformation journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1B1B1B] border-2 border-[#00FFFF]/30 rounded-lg p-6 hover:border-[#00FFFF] transition-all neon-border-cyan-subtle">
            <Zap className="w-8 h-8 text-[#00FFFF] mb-3" />
            <h3 className="font-['Orbitron'] text-[#00FFFF] mb-2">9 Questions</h3>
            <p className="text-sm text-gray-400 font-['Exo_2']">Quick assessment designed for busy professionals</p>
          </div>
          
          <div className="bg-[#1B1B1B] border-2 border-[#8AFF00]/30 rounded-lg p-6 hover:border-[#8AFF00] transition-all neon-border-green-subtle">
            <Target className="w-8 h-8 text-[#8AFF00] mb-3" />
            <h3 className="font-['Orbitron'] text-[#8AFF00] mb-2">Personalized</h3>
            <p className="text-sm text-gray-400 font-['Exo_2']">Tailored recommendations based on your responses</p>
          </div>
          
          <div className="bg-[#1B1B1B] border-2 border-[#FF00FF]/30 rounded-lg p-6 hover:border-[#FF00FF] transition-all neon-border-magenta-subtle">
            <Sparkles className="w-8 h-8 text-[#FF00FF] mb-3" />
            <h3 className="font-['Orbitron'] text-[#FF00FF] mb-2">Instant Results</h3>
            <p className="text-sm text-gray-400 font-['Exo_2']">Get your readiness score and ROI estimate immediately</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-8 neon-border-cyan">
          <h2 className="text-2xl font-['Orbitron'] text-[#00FFFF] mb-4 text-center">
            Ready to Begin?
          </h2>
          <p className="text-gray-300 font-['Exo_2'] mb-6 text-center">
            Start your assessment now and discover how AI can transform your business
          </p>
          
          <CyberButton
            onClick={handleStartAssessment}
            disabled={loading}
            className="w-full"
            variant="primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Start Assessment</span>
              </>
            )}
          </CyberButton>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-['Exo_2']">
            🔒 Your data is secure • ⚡ Takes less than 5 minutes • 🎯 100% personalized
          </p>
        </div>
      </div>
    </main>
  );
}
