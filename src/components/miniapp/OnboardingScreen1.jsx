import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SUBTITLE = 'Ваше защищённое соединение';

export default function OnboardingScreen1() {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < SUBTITLE.length) {
        setTypedText(SUBTITLE.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-0">
      {/* Animated SVG illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
        className="mb-12 relative"
      >
        <svg width="280" height="180" viewBox="0 0 280 180">
          {/* Device left */}
          <rect x="10" y="65" width="50" height="50" rx="10" fill="rgba(44,44,46,0.8)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x="22" y="77" width="26" height="16" rx="3" fill="rgba(10,132,255,0.3)" />
          <rect x="22" y="99" width="18" height="3" rx="2" fill="rgba(255,255,255,0.2)" />
          <rect x="22" y="106" width="26" height="3" rx="2" fill="rgba(255,255,255,0.1)" />

          {/* Sphere in center */}
          <circle cx="140" cy="90" r="36" fill="rgba(10,132,255,0.08)" stroke="rgba(10,132,255,0.3)" strokeWidth="1" />
          <circle cx="140" cy="90" r="24" fill="rgba(10,132,255,0.12)" stroke="rgba(10,132,255,0.5)" strokeWidth="1" />
          <circle cx="140" cy="90" r="12" fill="rgba(10,132,255,0.4)" />

          {/* Lock icon */}
          <path d="M135 88 L135 84 Q135 80 140 80 Q145 80 145 84 L145 88" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="133" y="88" width="14" height="10" rx="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="140" cy="94" r="1.5" fill="rgba(10,132,255,0.8)" />

          {/* Cloud right */}
          <ellipse cx="245" cy="85" rx="22" ry="16" fill="rgba(44,44,46,0.8)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <ellipse cx="235" cy="92" rx="14" ry="10" fill="rgba(44,44,46,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <ellipse cx="255" cy="92" rx="14" ry="10" fill="rgba(44,44,46,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x="222" y="91" width="46" height="12" rx="0" fill="rgba(44,44,46,0.9)" />

          {/* Flowing data lines */}
          <motion.path
            d="M65 90 Q95 60 104 90"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="60"
            animate={{ strokeDashoffset: [60, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0 }}
          />
          <motion.path
            d="M65 90 Q95 120 104 90"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="60"
            animate={{ strokeDashoffset: [60, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
          />
          <motion.path
            d="M176 90 Q205 65 220 85"
            fill="none"
            stroke="url(#flowGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="60"
            animate={{ strokeDashoffset: [60, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          />
          <motion.path
            d="M176 90 Q205 115 220 95"
            fill="none"
            stroke="url(#flowGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="60"
            animate={{ strokeDashoffset: [60, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
          />

          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5E5CE6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5E5CE6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-3 tracking-tight"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        FlowX VPN
      </motion.h1>

      <div className="h-7 mb-4">
        <span className="text-lg font-medium" style={{ color: '#0A84FF' }}>
          {typedText}<span className="opacity-50 animate-pulse">|</span>
        </span>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-base leading-relaxed max-w-xs"
        style={{ color: '#98989D' }}
      >
        Приватность без компромиссов.<br />Скорость без ограничений.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="mt-10 text-xs"
        style={{ color: '#98989D' }}
      >
        Нажмите, чтобы продолжить
      </motion.p>
    </div>
  );
}