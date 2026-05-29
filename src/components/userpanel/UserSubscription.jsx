import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const PAYMENT_METHODS = [
  { id: 'sbp', label: 'СБП', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/a31556e00_profit1.webp' },
  { id: 'card', label: 'Карта РФ', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/db345e8fb_i.webp' },
  { id: 'crypto', label: 'Крипта', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/be135aa88_generated_image.png' },
  { id: 'cryptobot', label: 'CryptoBot', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/1eeef1c58_5278656051538499167.jpg' },
  { id: 'stars', label: 'Telegram Stars', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/8177385e9_img_2337.jpg' },
];

const PLANS = [
  {
    name: 'Basic',
    traffic: '100 ГБ',
    devices: '10 устр.',
    price: 99,
    durations: [
      { months: 1, label: '1 месяц', price: 99, discount: null },
      { months: 3, label: '3 месяца', price: 249, discount: 15 },
      { months: 6, label: '6 месяцев', price: 449, discount: 25 },
      { months: 12, label: '12 месяцев', price: 899, discount: 35 },
    ],
  },
  {
    name: 'Pro',
    traffic: '∞ ГБ',
    devices: '25 устр.',
    price: 349,
    features: ['Обход блокировок РФ'],
    durations: [
      { months: 1, label: '1 месяц', price: 349, discount: null },
      { months: 3, label: '3 месяца', price: 899, discount: 15 },
      { months: 6, label: '6 месяцев', price: 1699, discount: 20 },
      { months: 12, label: '12 месяцев', price: 2999, discount: 30 },
    ],
  },
];

function PaymentModal({ plan, price, onClose, isLight }) {
  const [selectedMethod, setSelectedMethod] = useState('sbp');
  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={springConfig} className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl overflow-y-auto md:left-auto md:right-8 md:bottom-8 md:rounded-3xl md:w-96" style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh' }}>
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="text-lg font-bold" style={{ color: primaryText }}>Оплата тарифа</h3><p className="text-sm" style={{ color: secondaryText }}>{plan} · <span style={{ color: '#0A84FF', fontWeight: 600 }}>₽ {price}</span></p></div>
          <button onClick={onClose}><X size={20} color={secondaryText} /></button>
        </div>
        <p className="text-xs font-semibold mb-3" style={{ color: secondaryText }}>Способ оплаты</p>
        <div className="space-y-2 mb-5">
          {PAYMENT_METHODS.map(m => (
            <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setSelectedMethod(m.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left" style={{ background: selectedMethod === m.id ? 'rgba(10,132,255,0.12)' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.5)'), border: selectedMethod === m.id ? '1px solid rgba(10,132,255,0.4)' : (isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)') }}>
              <img src={m.icon} alt={m.label} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
              <span className="text-sm font-medium" style={{ color: selectedMethod === m.id ? primaryText : secondaryText }}>{m.label}</span>
              {selectedMethod === m.id && (<div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>)}
            </motion.button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.97 }} className="w-full py-4 rounded-2xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.4)' }}>Оплатить ₽ {price}</motion.button>
      </motion.div>
    </>
  );
}

export default function UserSubscription() {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [selectedMonths, setSelectedMonths] = useState({});
  const [paymentModal, setPaymentModal] = useState(null);

  const getMonths = (name) => selectedMonths[name] || 1;
  const setMonths = (name, m) => setSelectedMonths(prev => ({ ...prev, [name]: m }));

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.95)' : '#18181B';
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';
  const durationInactiveBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const durationInactiveBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: primaryText, letterSpacing: '-0.02em' }}>Подписка</h1>
        <p className="text-sm" style={{ color: secondaryText }}>Управление планом и оплатой</p>
      </div>

      {PLANS.map((plan) => {
        const currentMonths = getMonths(plan.name);
        const planDurations = plan.durations;
        const selected = planDurations.find(d => d.months === currentMonths) || planDurations[0];
        const isPro = plan.name === 'Pro';

        return (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl mb-4"
            style={{ background: cardBg, border: isPro ? '1px solid rgba(94,92,230,0.4)' : cardBorder }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold" style={{ color: isPro ? '#5E5CE6' : primaryText }}>
                {plan.name}
                {isPro && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(94,92,230,0.15)', color: '#5E5CE6' }}>Популярный</span>}
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: primaryText }}>₽ {selected.price}</span>
                <div className="text-xs" style={{ color: secondaryText }}>/ {selected.months} мес</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(10,132,255,0.12)', color: primaryText, border: '1px solid rgba(10,132,255,0.2)' }}>
                <span style={{ color: '#0A84FF' }}>⚡</span> {plan.traffic}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(94,92,230,0.12)', color: primaryText, border: '1px solid rgba(94,92,230,0.2)' }}>
                <span style={{ color: '#5E5CE6' }}>📱</span> {plan.devices}
              </span>
              {plan.features && plan.features.map(f => (
                <span key={f} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>🇷🇺 {f}</span>
              ))}
            </div>

            <div className="flex gap-2 mb-5" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: '12px', paddingTop: '10px' }}>
              {planDurations.map((d) => (
                <motion.button key={d.months} whileTap={{ scale: 0.95 }} onClick={() => setMonths(plan.name, d.months)}
                  className="flex-shrink-0 flex flex-col items-center rounded-2xl relative"
                  style={{ background: currentMonths === d.months ? 'rgba(10,132,255,0.18)' : durationInactiveBg, border: currentMonths === d.months ? '1px solid rgba(10,132,255,0.45)' : `1px solid ${durationInactiveBorder}`, minWidth: '76px', padding: '10px 12px', marginTop: '6px' }}>
                  {d.discount && (<div className="absolute font-bold" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', color: 'white', fontSize: '9px', padding: '2px 6px', whiteSpace: 'nowrap', borderRadius: '100px' }}>-{d.discount}%</div>)}
                  <span className="text-xs font-semibold" style={{ color: currentMonths === d.months ? '#0A84FF' : secondaryText }}>{d.label}</span>
                  <span className="text-sm font-bold mt-0.5" style={{ color: currentMonths === d.months ? primaryText : secondaryText }}>₽{d.price}</span>
                </motion.button>
              ))}
            </div>

            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentModal({ plan: `${plan.name} · ${selected.months} мес`, price: selected.price })}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
              style={{ background: isPro ? 'linear-gradient(135deg, #5E5CE6, #0A84FF)' : 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
              {isPro ? 'Выбрать Pro' : 'Выбрать Basic'}
            </motion.button>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {paymentModal && (<PaymentModal plan={paymentModal.plan} price={paymentModal.price} onClose={() => setPaymentModal(null)} isLight={isLight} />)}
      </AnimatePresence>
    </div>
  );
}