"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, coy } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
  forceTheme?: 'dark' | 'light';
}

export default function CodeBlock({ code, language, forceTheme }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const theme = forceTheme || resolvedTheme;
  const style = theme === 'light' ? coy : vscDarkPlus;
  const bgColor = theme === 'light' ? '#f8f8f8' : '#1e1e1e';
  const isPlaceholder = code === 'Your code preview will appear here.';

  const copyToClipboard = () => {
    if (isPlaceholder) return;
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative w-full flex-grow">
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-opacity"
          onClick={copyToClipboard}
        >
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          height: '100%',
          width: '100%',
          backgroundColor: bgColor,
          color: isPlaceholder ? '#6b7280' : undefined,
        }}
        showLineNumbers={!isPlaceholder}
        wrapLines={true}
        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
} 