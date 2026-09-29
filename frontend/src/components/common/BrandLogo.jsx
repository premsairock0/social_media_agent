import React from 'react';

export function SoundwaveIcon({ className = 'h-7' }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      <span className="w-[3.5px] h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-[3.5px] h-5 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <span className="w-[3.5px] h-7 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      <span className="w-[3.5px] h-5 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
      <span className="w-[3.5px] h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
    </div>
  );
}

export function SocialPulseLogo({ size = 'default' }) {
  return (
    <div className="flex items-center gap-2.5">
      <SoundwaveIcon />
      <span className={`font-bold tracking-tight text-slate-900 ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
        Social<span className="text-indigo-600">Pulse</span>
      </span>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

export function MicrosoftIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}
