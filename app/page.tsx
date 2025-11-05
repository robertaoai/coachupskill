'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserEntryForm } from '@/components/UserEntryForm';
import { ChatBubble } from '@/components/ChatBubble';
import { postStartSession } from '@/lib/api';
import { useLocalSession } from '@/hooks/useLocalSession';
import { Zap, Brain, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const { saveSession } = useLocalSession();
  const [firstPrompt, setFirstPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, personaHint: string) => {
    setIsLoading(true);
    try {
      const result = await postStartSession(email, personaHint);
      
      const initialMessage = {
        id: '1',
        type: 'ai' as const,
        text: result.first_prompt,
        timestamp: new Date(),
      };
      
      saveSession(result.session_id, [initialMessage], 'q1');
      setFirstPrompt(result.first_prompt);
      
      toast.success('Session initialized successfully!');
      
      setTimeout(() => {
        router.push(`/answer/${result.session_id}`);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto scan-line">
      <header className="text-center py-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-[#FF0080]" />
          <h1 className="text-5xl font-['Orbitron'] font-black text-[#00FFFF] neon-glow-cyan glitch">
            AI SKILLS COACH
          </h1>
        </div>
        <p className="text-gray-400 text-lg font-['Exo_2']">
          Assess your AI readiness • Unlock your potential
        </p>
      </header>

      <div className="flex-1 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1B1B1B] border-2 border-[#FF0080] rounded-lg p-4 text-center neon-border-pink">
            <Zap className="w-8 h-8 text-[#FF0080] mx-auto mb-2" />
            <h3 className="text-sm font-['Orbitron'] text-[#FF0080] uppercase">Fast</h3>
            <p className="text-xs text-gray-400 mt-1">5-minute assessment</p>
          </div>
          <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-4 text-center neon-border-cyan">
            <Brain className="w-8 h-8 text-[#00FFFF] mx-auto mb-2" />
            <h3 className="text-sm font-['Orbitron'] text-[#00FFFF] uppercase">Smart</h3>
            <p className="text-xs text-gray-400 mt-1">AI-powered insights</p>
          </div>
          <div className="bg-[#1B1B1B] border-2 border-[#8AFF00] rounded-lg p-4 text-center neon-border-green">
            <Target className="w-8 h-8 text-[#8AFF00] mx-auto mb-2" />
            <h3 className="text-sm font-['Orbitron'] text-[#8AFF00] uppercase">Actionable</h3>
            <p className="text-xs text-gray-400 mt-1">Clear next steps</p>
          </div>
        </div>

        <div className="bg-[#1B1B1B] border-2 border-[#00FFFF] rounded-lg p-6 neon-border-cyan">
          <UserEntryForm onSubmit={handleSubmit} disabled={isLoading} />
        </div>

        {firstPrompt && (
          <div className="mt-6">
            <ChatBubble type="ai" message={firstPrompt} />
          </div>
        )}
      </div>

      <footer className="text-center py-6 mt-8 border-t border-[#00FFFF]/20">
        <p className="text-xs text-gray-500 font-['Exo_2']">
          Powered by advanced AI • Secure & confidential
        </p>
      </footer>
    </main>
  );
}
