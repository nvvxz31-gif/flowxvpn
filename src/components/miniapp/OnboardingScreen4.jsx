import React from 'react';
import { motion } from 'framer-motion';

export default function OnboardingScreen4({ onComplete }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="mb-8"
      >
        <div className="relative w-28 h-28 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(135deg, #0A84FF33, #5E5CE633)' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-3 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
            animate={{ boxShadow: ['0 0 20px rgba(10,132,255,0.3)', '0 0 40px rgba(10,132,255,0.6)', '0 0 20px rgba(10,132,255,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🚀</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-3 tracking-tight"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        Попробуй бесплатно
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm leading-relaxed mb-3"
        style={{ color: '#98989D' }}
      >
        Без привязки карты. Без ограничений.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm leading-relaxed mb-10"
        style={{ color: '#98989D' }}
      >
        Полный доступ ко всем серверам на <span style={{ color: '#F5F5F7', fontWeight: 600 }}>7 дней</span>. Отмена в один клик.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-xs"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={e => { e.stopPropagation(); onComplete(); }}
          className="w-full py-4 rounded-2xl font-semibold text-base text-white"
          style={{
            background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)',
            boxShadow: '0 4px 20px rgba(10,132,255,0.4)',
          }}
        >
          Начать 7 дней бесплатно
        </motion.button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={e => { e.stopPropagation(); onComplete(); }}
        className="mt-4 text-sm px-4 py-2"
        style={{ color: '#98989D' }}
      >
        Пропустить → посмотреть тарифы
      </motion.button>
    </div>
  );
}