import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useSubscription } from '@/hooks/useSubscription';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const PAYMENT_METHODS = [
  {
    id: 'sbp',
    label: 'СБП',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/a31556e00_profit1.webp',
  },
  {
    id: 'card',
    label: 'Карта РФ',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/db345e8fb_i.webp',
  },
  {
    id: 'crypto',
    label: 'Крипта',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/be135aa88_generated_image.png',
  },
  {
    id: 'cryptobot',
    label: 'CryptoBot',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/1eeef1c58_5278656051538499167.jpg',
  },
  {
    id: 'stars',
    label: 'Telegram Stars',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/8177385e9_img_2337.jpg',
  },
];

export default function BalanceCapsule() {
  const { theme } = useApp();
  const { data: sub } = useSubscription();
  const balance = sub?.balance_rub || 0;
  const isLight = theme === 'light';

  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('sbp');
  const amounts = [200, 500, 1000, 2000];

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const modalBg = isLight ? 'rgba(242,242,247,0.99)' : 'rgba(28,28,30,0.98)';
  const modalBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)';
  const amountInactiveBg = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(44,44,46,0.6)';
  const amountInactiveBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';
  const methodInactiveBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.5)';
  const methodInactiveBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)';
  const inputBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.6)';
  const inputBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(28,28,30,0.85)',
          backdropFilter: isLight ? 'none' : 'blur(20px)',
          border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-xs font-semibold" style={{ color: primaryText }}>₽ {balance.toLocaleString('ru')}</span>
        <Plus size={10} color="#0A84FF" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={springConfig}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl overflow-y-auto"
              style={{ background: modalBg, backdropFilter: isLight ? 'none' : 'blur(24px)', border: modalBorder, maxHeight: '90vh' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold" style={{ color: primaryText }}>Пополнить баланс</h3>
                <button onClick={() => setOpen(false)}><X size={20} color={secondaryText} /></button>
              </div>

              <p className="text-sm mb-4" style={{ color: secondaryText }}>
                Текущий баланс: <span style={{ color: primaryText, fontWeight: 600 }}>₽ {balance.toLocaleString('ru')}</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {amounts.map(a => (
                  <motion.button key={a} whileTap={{ scale: 0.96 }}
                    onClick={() => { setSelectedAmount(a); setCustomAmount(''); }}
                    className="p-3 rounded-2xl font-semibold text-sm"
                    style={{
                      background: selectedAmount === a && !customAmount ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : amountInactiveBg,
                      border: selectedAmount === a && !customAmount ? '1px solid transparent' : amountInactiveBorder,
                      color: selectedAmount === a && !customAmount ? 'white' : primaryText,
                    }}
                  >
                    ₽ {a}
                  </motion.button>
                ))}
              </div>

              <div className="mb-5">
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="Своя сумма (₽)"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none font-medium"
                  style={{
                    background: customAmount ? 'rgba(10,132,255,0.12)' : inputBg,
                    border: customAmount ? '1px solid rgba(10,132,255,0.4)' : inputBorder,
                    color: primaryText,
                  }}
                />
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold mb-3" style={{ color: secondaryText }}>Способ оплаты</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(m => (
                    <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setSelectedMethod(m.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                      style={{
                        background: selectedMethod === m.id ? 'rgba(10,132,255,0.12)' : methodInactiveBg,
                        border: selectedMethod === m.id ? '1px solid rgba(10,132,255,0.4)' : methodInactiveBorder,
                      }}
                    >
                      <img src={m.icon} alt={m.label} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                      <span className="text-sm font-medium" style={{ color: selectedMethod === m.id ? primaryText : secondaryText }}>{m.label}</span>
                      {selectedMethod === m.id && (
                        <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-semibold text-white text-base"
                style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.4)' }}
              >
                Пополнить на ₽ {finalAmount || 0}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}