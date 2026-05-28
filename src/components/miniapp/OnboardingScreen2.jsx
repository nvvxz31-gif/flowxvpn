import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { label: 'Ваше устройство', icon: '📱', delay: 0 },
  { label: 'Шифрование', icon: '🔐', delay: 0.3 },
  { label: 'Сервер FlowX', icon: '🌐', delay: 0.6 },
  { label: 'Интернет', icon: '☁️', delay: 0.9 },
];

export default function OnboardingScreen2() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-3 tracking-tight"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        Как это работает?
      </motion.h2>

      {/* Flow diagram */}
      <div className="flex items-center gap-2 my-10">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: step.delay }}
              className="flex flex-col items-center gap-2 w-14"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl glass-card flex-shrink-0"
                style={{ background: 'rgba(28,28,30,0.8)' }}
              >
                {step.icon}
              </div>
              <span className="text-xs text-center leading-tight" style={{ color: '#98989D', width: '60px' }}>{step.label}</span>
            </motion.div>

            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: step.delay + 0.2, duration: 0.4 }}
                className="flex flex-col gap-1 flex-shrink-0"
                style={{ marginBottom: '20px' }}
              >
                {[0, 1].map(j => (
                  <motion.div
                    key={j}
                    className="h-0.5 w-6 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #0A84FF, #5E5CE6)' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.3 }}
                  />
                ))}
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="glass-card p-5 rounded-2xl max-w-sm text-left"
      >
        <p className="text-sm leading-relaxed" style={{ color: '#98989D' }}>
          Твой трафик <span style={{ color: '#F5F5F7' }}>шифруется на устройстве</span>, проходит через защищённый сервер FlowX и только потом попадает в интернет.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: '#98989D' }}>
          Никто не видит, что ты делаешь онлайн — ни провайдер, ни сайты, <span style={{ color: '#F5F5F7' }}>ни государство</span>.
        </p>
      </motion.div>
    </div>
  );
}