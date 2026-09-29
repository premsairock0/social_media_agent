import React from 'react';

/**
 * FormattedText Component
 * Renders markdown-like formatted text with support for:
 * - Bold text using both `**text**` and `*text*` (ensures asterisks are converted to bold with the active font)
 * - Lists (bulleted `-`, `*`, `•` and numbered `1.`, `2.`)
 * - Subheadings (`#`, `##`, `###`)
 * - Preserves natural spacing and line breaks
 * - Adapts cleanly to both Light Mode and Dark Mode
 */
export default function FormattedText({ text, className = '' }) {
  if (!text) return null;

  // Split into paragraphs / lines
  const lines = String(text).split('\n');

  // Helper to parse inline bold, italic, code, and links
  const renderInline = (lineContent) => {
    if (!lineContent) return null;

    // Tokenize inline elements
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_))/g;
    const parts = lineContent.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Inline code
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-indigo-500/30 text-blue-600 dark:text-blue-400 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Double Asterisk / Underscore Bold (**bold** or __bold__)
      if (
        (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
      ) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Single Asterisk / Underscore (*bold/emphasis* or _text_)
      if (
        (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
      ) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(1, -1)}
          </strong>
        );
      }

      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> paragraph spacer
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Heading 1 / 2 / 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-1">
              {renderInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-1">
              {renderInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="font-bold text-slate-900 dark:text-white text-base mt-3.5 mb-1.5">
              {renderInline(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-blue-500 pl-3 italic text-slate-700 dark:text-slate-300 my-1 bg-blue-50/30 dark:bg-blue-950/20 py-1 rounded-r"
            >
              {renderInline(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }

        // Bullet point list item (e.g. "* item", "- item", "• item")
        const bulletMatch = line.match(/^(\s*)([-*•])\s+(.+)$/);
        if (bulletMatch) {
          const indent = bulletMatch[1].length > 0 ? 'ml-4' : 'ml-1';
          return (
            <div key={idx} className={`flex items-start gap-2 ${indent} my-0.5`}>
              <span className="text-blue-600 dark:text-blue-400 font-bold leading-relaxed shrink-0">•</span>
              <span className="flex-1 leading-relaxed">
                {renderInline(bulletMatch[3])}
              </span>
            </div>
          );
        }

        // Numbered list item (e.g. "1. item", "2) item")
        const numberMatch = line.match(/^(\s*)(\d+[\.\)])\s+(.+)$/);
        if (numberMatch) {
          const indent = numberMatch[1].length > 0 ? 'ml-4' : 'ml-1';
          return (
            <div key={idx} className={`flex items-start gap-2 ${indent} my-0.5`}>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs leading-relaxed shrink-0 min-w-[1.2rem]">
                {numberMatch[2]}
              </span>
              <span className="flex-1 leading-relaxed">
                {renderInline(numberMatch[3])}
              </span>
            </div>
          );
        }

        // Normal paragraph line
        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}
