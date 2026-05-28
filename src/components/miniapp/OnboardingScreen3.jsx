import React from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    icon: '🔒',
    title: 'Не отличить от HTTPS',
    desc: 'Твой VPN-трафик выглядит как обычный просмотр сайтов. Даже Deep Packet Inspection не видит разницы.',
    color: '#0A84FF',
  },
  {
    icon: '🛡️',
    title: 'Не блокируется DPI',
    desc: 'Технология Reality обходит блокировки на уровне протокола. Работает даже в странах с жёсткой цензурой.',
    color: '#5E5CE6',
  },
  {
    icon: '🌍',
    title: 'Работает везде',
    desc: 'iOS, Android, Windows, macOS, роутеры. Одна подписка — все твои устройства.',
    color: '#30D158',
  },
];

export default function OnboardingScreen3() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-2 tracking-tight text-center"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        Почему VLESS+Reality?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm mb-8 text-center"
        style={{ color: '#98989D' }}
      >
        Следующее поколение VPN-протоколов
      </motion.p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 + i * 0.15 }}
            className="glass-card p-4 rounded-2xl flex items-start gap-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${card.color}22`, border: `1px solid ${card.color}44` }}
            >
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#F5F5F7' }}>{card.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#98989D' }}>{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}