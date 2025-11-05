'use client';

interface HtmlSummaryViewProps {
  html_summary: string;
}

export function HtmlSummaryView({ html_summary }: HtmlSummaryViewProps) {
  return (
    <div 
      className="prose prose-invert max-w-none
        prose-headings:font-['Orbitron'] prose-headings:text-[#00FFFF]
        prose-p:text-gray-300 prose-p:font-['Exo_2']
        prose-strong:text-[#8AFF00]
        prose-ul:text-gray-300
        prose-li:marker:text-[#FF0080]"
      dangerouslySetInnerHTML={{ __html: html_summary }}
    />
  );
}
