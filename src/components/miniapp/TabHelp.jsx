import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Smartphone, Monitor } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const faq = [
  { q: 'Как подключиться к VPN?', a: 'Скачайте приложение Streisand или Hiddify для вашего устройства, скопируйте конфиг в разделе «Подключения» и вставьте его в приложение.' },
  { q: 'Почему VPN медленно работает?', a: 'Попробуйте сменить сервер. Серверы с нагрузкой ниже 50% обычно обеспечивают лучшую скорость. Проверьте пинг с помощью теста скорости.' },
  { q: 'Как работает технология VLESS+Reality?', a: 'Reality маскирует VPN-трафик под обычный HTTPS, используя SNI реального сайта. Это делает блокировку практически невозможной.' },
  { q: 'Что делать, если бот заблокирован?', a: 'Зайдите на my.flowx.com через браузер. Там доступны все функции без Telegram.' },
  { q: 'Как отменить подписку?', a: 'Подписка не продлевается автоматически. Просто не платите следующий месяц — VPN перестанет работать после истечения срока.' },
  { q: 'Логируете ли вы трафик?', a: 'Нет. Мы не сохраняем логи трафика, DNS-запросов или IP-адресов пользователей. Политика строгого no-log.' },
];

const platforms = [
  { name: 'iOS', icon: '🍎', app: 'Streisand' },
  { name: 'Android', icon: '🤖', app: 'Hiddify' },
  { name: 'Windows', icon: '🪟', app: 'Nekoray' },
  { name: 'macOS', icon: '🖥️', app: 'Streisand' },
];

export default function TabHelp() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="px-4 pt-16 pb-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 tracking-tight"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        Помощь
      </motion.h1>

      {/* Platforms */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F5F5F7' }}>Инструкции по настройке</h3>
        <div className="grid grid-cols-2 gap-3">
          {platforms.map((p, i) => (
            <motion.button
              key={p.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              className="glass-card p-4 rounded-2xl text-left"
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <div className="text-sm font-semibold" style={{ color: '#F5F5F7' }}>{p.name}</div>
              <div className="text-xs" style={{ color: '#98989D' }}>через {p.app}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F5F5F7' }}>Частые вопросы</h3>
        <div className="flex flex-col gap-2">
          {faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(28,28,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium pr-3" style={{ color: '#F5F5F7' }}>{item.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={springConfig}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={16} color="#98989D" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springConfig}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: '#98989D' }}>
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support button */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        href="https://t.me/flowxvpn_support"
        target="_blank"
        className="flex items-center justify-center gap-2 p-4 rounded-2xl font-semibold"
        style={{ background: 'rgba(10,132,255,0.12)', border: '1px solid rgba(10,132,255,0.3)', color: '#0A84FF' }}
      >
        <MessageCircle size={16} />
        Написать в поддержку
      </motion.a>
    </div>
  );
}