import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';
import OnboardingScreen4 from './OnboardingScreen4';

const springConfig = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 };

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const screenComponents = [
    OnboardingScreen1,
    OnboardingScreen2,
    OnboardingScreen3,
    OnboardingScreen4,
  ];

  const goNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: '#0D0D0F' }}
      onClick={step < 3 ? goNext : undefined}
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0A84FF 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #5E5CE6 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      {/* Back button */}
      {step > 0 && step < 3 && (
        <button
          className="absolute top-14 left-6 text-sm font-medium z-10"
          style={{ color: '#98989D' }}
          onClick={e => { e.stopPropagation(); goPrev(); }}
        >
          ← Назад
        </button>
      )}

      {/* Content area — leaves room for dots at bottom */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={springConfig}
          className="absolute inset-0 flex flex-col"
          style={{ paddingBottom: '72px' }}
        >
          {React.createElement(screenComponents[step], step === 3 ? { onComplete } : {})}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 24 : 6,
              opacity: i === step ? 1 : 0.35,
              background: i === step ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : 'rgba(255,255,255,0.4)',
            }}
            transition={springConfig}
            style={{ height: 6, borderRadius: 100 }}
          />
        ))}
      </div>
    </div>
  );
}