'use client';

interface HtmlSummaryViewProps {
  html_summary: string;
}

export function HtmlSummaryView({ html_summary }: HtmlSummaryViewProps) {
  return (
    <div 
      className="prose prose-invert max-w-none
        prose-headings:text-[#00FFFF] prose-headings:font-['Orbitron']
        prose-p:text-gray-300 prose-p:font-['Exo_2']
        prose-strong:text-[#8AFF00] prose-strong:font-bold
        prose-ul:text-gray-300 prose-li:text-gray-300
        prose-a:text-[#00FFFF] prose-a:no-underline hover:prose-a:text-[#8AFF00]"
      dangerouslySetInnerHTML={{ __html: html_summary }}
    />
  );
}
