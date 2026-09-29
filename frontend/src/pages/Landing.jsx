import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Cinematic title entrance animation
    const loadTimer = setTimeout(() => {
      setHasLoaded(true);
    }, 150);

    // Reveal Enter button & instructions after title settles
    const controlsTimer = setTimeout(() => {
      setShowControls(true);
    }, 1000);

    // Global keyboard listener for Enter key
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        navigate('/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(controlsTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const handleEnter = () => {
    navigate('/login');
  };

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center select-none bg-black"
      style={{
        backgroundImage: `url('/assets/kazam_hero.png')`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Cinematic subtle contrast vignette that preserves background vibrancy */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(4,4,12,0.65)_100%)] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        
        {/* Futuristic Brand Title: K Λ Z Λ M */}
        <div
          className={`transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasLoaded
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-14 scale-95'
          }`}
        >
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[0.22em] sm:tracking-[0.32em] md:tracking-[0.38em] text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.45)] drop-shadow-[0_0_55px_rgba(56,189,248,0.4)] drop-shadow-[0_0_80px_rgba(168,85,247,0.3)] pl-[0.22em] sm:pl-[0.32em] md:pl-[0.38em] flex items-center justify-center"
            style={{
              fontFamily: "'Orbitron', 'Space Grotesk', system-ui, -apple-system, sans-serif",
            }}
          >
            <span>K</span>
            <span className="inline-block transform scale-y-[0.96]">Λ</span>
            <span>Z</span>
            <span className="inline-block transform scale-y-[0.96]">Λ</span>
            <span>M</span>
          </h1>
        </div>

        {/* Minimalist Futuristic ENTER Capsule & Persistent Instruction */}
        <div
          className={`mt-10 sm:mt-12 flex flex-col items-center transition-all duration-700 ease-out ${
            showControls
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          {/* Glowing Gradient Border Capsule Button */}
          <button
            id="kazam-enter-button"
            onClick={handleEnter}
            className="group relative p-[1.5px] rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-[0_0_20px_rgba(56,189,248,0.3),0_0_35px_rgba(236,72,153,0.25)] hover:shadow-[0_0_30px_rgba(56,189,248,0.55),0_0_50px_rgba(236,72,153,0.45)]"
            aria-label="Enter Kazam Platform"
          >
            {/* Neon Gradient Border: Cyan -> Purple -> Pink */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 transition-opacity duration-300" />
            
            {/* Dark Glass Inner Content */}
            <div className="relative px-9 sm:px-12 py-3 sm:py-3.5 rounded-full bg-[#090b1c]/90 backdrop-blur-xl group-hover:bg-[#090b1c]/70 transition-colors duration-300 flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold tracking-[0.35em] text-white/95 uppercase pl-[0.35em]">
                ENTER
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {/* Persistent Keyboard Enter Instruction */}
          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/60 uppercase select-none">
            <span>PRESS</span>
            <kbd className="px-2 py-0.5 rounded bg-white/[0.08] border border-white/25 text-white/90 font-mono text-[10px] sm:text-xs tracking-wider shadow-sm">
              ENTER
            </kbd>
            <span>TO PROCEED</span>
          </div>
        </div>

      </div>

      {/* Ambient bottom tagline */}
      <div 
        className={`absolute bottom-6 z-10 text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-white/35 font-medium transition-opacity duration-1000 delay-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Autonomous Social Intelligence
      </div>
    </main>
  );
}
