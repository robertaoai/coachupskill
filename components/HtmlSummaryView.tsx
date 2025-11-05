'use client';

import { useState } from 'react';
import { CyberButton } from './CyberButton';
import { Copy, Download, Check } from 'lucide-react';
import { toast } from 'sonner';

interface HtmlSummaryViewProps {
  summary_html: string;
}

export function HtmlSummaryView({ summary_html }: HtmlSummaryViewProps) {
  const [copied, setCopied] = useState(false);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stripHtml(summary_html));
      setCopied(true);
      toast.success('Summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy summary');
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="bg-[#1B1B1B] border-2 border-[#00FFFF]/30 rounded-lg p-6 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: summary_html }}
      />
      
      <div className="flex gap-3">
        <CyberButton
          onClick={handleCopy}
          variant="secondary"
          className="flex-1"
        >
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </CyberButton>
        
        <CyberButton
          onClick={() => toast.info('PDF download will be implemented server-side')}
          variant="secondary"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </CyberButton>
      </div>
    </div>
  );
}
