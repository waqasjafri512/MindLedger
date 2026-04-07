'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm prose-neutral max-w-none
      prose-headings:font-serif prose-headings:text-foreground prose-headings:tracking-tight
      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
      prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
      prose-strong:text-foreground prose-strong:font-bold
      prose-li:text-muted-foreground prose-li:font-medium
      prose-ul:space-y-1
      prose-code:text-gold prose-code:bg-gold/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs
      ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
