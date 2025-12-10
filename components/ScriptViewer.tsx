import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, Terminal } from 'lucide-react';

interface ScriptViewerProps {
  script: string;
}

const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [script]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'megacable-bridge.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={18} />
          <span className="font-mono text-sm font-semibold">generated-script.js</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Download JS file"
          >
            <Download size={18} />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
      <div className="relative flex-grow overflow-hidden bg-[#0d1117]">
        <pre className="h-full p-4 overflow-auto text-xs sm:text-sm font-mono leading-relaxed">
          <code className="text-slate-300">
            {script.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none text-slate-600 text-right pr-4 w-8">{i + 1}</span>
                <span className="table-cell whitespace-pre-wrap break-all">
                  {highlightSyntax(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Simple pseudo-highlighting helper
const highlightSyntax = (line: string) => {
  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return <span className="text-slate-500">{line}</span>;
  }
  
  const parts = line.split(/('.*?'|".*?")/g);
  return parts.map((part, index) => {
    if (part.startsWith("'") || part.startsWith('"')) {
      return <span key={index} className="text-green-400">{part}</span>;
    }
    // Simple keywords
    return <span key={index} dangerouslySetInnerHTML={{
      __html: part
        .replace(/\b(var|const|let|function|return|if|else|try|catch)\b/g, '<span class="text-purple-400">$1</span>')
        .replace(/\b(console|alert|\$)\b/g, '<span class="text-yellow-300">$1</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="text-orange-400">$1</span>')
    }} />;
  });
};

export default ScriptViewer;