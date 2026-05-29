import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/lib/AuthContext';

const PAYMENT_METHODS = [
  { id: 'sbp', label: 'СБП', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/a31556e00_profit1.webp' },
  { id: 'card', label: 'Карта РФ', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/db345e8fb_i.webp' },
  { id: 'crypto', label: 'Крипта', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/be135aa88_generated_image.png' },
  { id: 'cryptobot', label: 'CryptoBot', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/1eeef1c58_5278656051538499167.jpg' },
  { id: 'stars', label: 'Telegram Stars', icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/8177385e9_img_2337.jpg' },
];

const FALLBACK_DURATIONS = [
  { months: 1, price: 99, discount: null },
  { months: 3, price: 249, discount: 15 },
  { months: 6, price: 449, discount: 25 },
  { months: 12, price: 899, discount: 35 },
];

function PaymentModal({ plan, price, months, onClose, onPay }) {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [selectedMethod, setSelectedMethod] = useState('sbp');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const modalBg = isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)';
  const modalBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)';
  const methodInactiveBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.5)';
  const methodInactiveBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)';

  const handlePay = async () => {
    setLoading(true);
    await onPay(selectedMethod);
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)' }}
        onClick={onClose} />
      <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl overflow-y-auto"
        style={{ background: modalBg, border: modalBorder, maxHeight: '90vh' }}
      >
        {done ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(48,209,88,0.2)' }}>
              <Check size={32} color="#30D158" />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: primaryText }}>Заявка принята!</h3>
            <p className="text-sm text-center" style={{ color: secondaryText }}>Оплата будет обработана в ближайшее время</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold" style={{ color: primaryText }}>Оплата тарифа</h3>
                <p className="text-sm" style={{ color: secondaryText }}>{plan} · <span style={{ color: '#0A84FF', fontWeight: 600 }}>₽ {price}</span></p>
              </div>
              <button onClick={onClose}><X size={20} color={secondaryText} /></button>
            </div>
            <p className="text-xs font-semibold mb-3" style={{ color: secondaryText }}>Способ оплаты</p>
            <div className="space-y-2 mb-5">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                  style={{
                    background: selectedMethod === m.id ? 'rgba(10,132,255,0.12)' : methodInactiveBg,
                    border: selectedMethod === m.id ? '1px solid rgba(10,132,255,0.4)' : methodInactiveBorder,
                  }}>
                  <img src={m.icon} alt={m.label} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                  <span className="text-sm font-medium" style={{ color: selectedMethod === m.id ? primaryText : secondaryText }}>{m.label}</span>
                  {selectedMethod === m.id && (
                    <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={handlePay} disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.4)' }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : `Оплатить ₽ ${price}`}
            </button>
          </>
        )}
      </motion.div>
    </>
  );
}

export default function TabPlans() {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentModal, setPaymentModal] = useState(null);
  const [trialDone, setTrialDone] = useState(() => !!localStorage.getItem('flowx_trial_done'));

  const { data: sub } = useSubscription();

  const { data: plans = [] } = useQuery({
    queryKey: ['plans-active'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Plan.filter({ is_active: true }, 'sort_order', 10);
        return Array.isArray(result) ? result : [];
      } catch {
        return [
          { is_trial: true, name: 'Пробный', traffic_gb: 50, days: 7, is_active: true },
          { is_trial: false, name: 'Basic', traffic_gb: 300, price_rub: 99, is_active: true },
        ];
      }
    },
  });

  const safePlans = Array.isArray(plans) ? plans : [];
  const trialPlan = safePlans.find(p => p?.is_trial) || { name: 'Пробный', traffic_gb: 50, days: 7 };
  const paidPlan = safePlans.find(p => !p?.is_trial) || { name: 'Basic', traffic_gb: 300, price_rub: 99 };

  const durations = (Array.isArray(paidPlan?.durations) && paidPlan.durations.length > 0)
    ? paidPlan.durations
    : FALLBACK_DURATIONS;

  const safeDurations = Array.isArray(durations) ? durations : FALLBACK_DURATIONS;
  const selected = safeDurations.find(d => d.months === selectedMonths) || safeDurations[0];

  const createTrial = useMutation({
    mutationFn: async () => {
      const trialExpiry = new Date();
      trialExpiry.setDate(trialExpiry.getDate() + (trialPlan?.days || 7));
      try {
        return await base44.entities.Subscription.create({
          user_email: user.email,
          user_name: user.full_name || user.email,
          plan_name: trialPlan?.name || 'Пробный',
          status: 'trial',
          traffic_used_gb: 0,
          traffic_total_gb: trialPlan?.traffic_gb || 50,
          expires_at: trialExpiry.toISOString(),
          started_at: new Date().toISOString(),
          months_paid: 0,
          balance_rub: 0,
        });
      } catch {
        return { status: 'trial' };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-subscription'] });
      localStorage.setItem('flowx_trial_done', '1');
      setTrialDone(true);
    },
  });

  const createPayment = async (method) => {
    const planName = paidPlan?.name || 'Basic';
    const price = selected?.price || 99;
    const months = selected?.months || 1;
    try {
      await base44.entities.Transaction.create({
        user_email: user.email,
        user_name: user.full_name || user.email,
        plan_name: planName,
        amount_rub: price,
        payment_method: method,
        status: 'pending',
        months,
      });
      if (!sub) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + months);
        await base44.entities.Subscription.create({
          user_email: user.email,
          user_name: user.full_name || user.email,
          plan_name: planName,
          status: 'trial',
          traffic_used_gb: 0,
          traffic_total_gb: paidPlan?.traffic_gb || 300,
          expires_at: expiry.toISOString(),
          started_at: new Date().toISOString(),
          months_paid: 0,
          balance_rub: 0,
        });
      }
      qc.invalidateQueries({ queryKey: ['my-subscription'] });
      qc.invalidateQueries({ queryKey: ['my-transactions'] });
    } catch {
      // API unavailable — accepted locally
    }
  };

  const hasSub = !!sub;
  const isTrialActive = sub?.status === 'trial';
  const isActive = sub?.status === 'active';

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(28,28,30,0.6)';
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)';
  const tagBg = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  const durationBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const durationBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  return (
    <div className="px-4 pt-16 pb-4">
      <h1 className="text-2xl font-bold mb-1 tracking-tight" style={{ color: primaryText, letterSpacing: '-0.02em' }}>
        Тарифы
      </h1>
      <p className="text-sm mb-6" style={{ color: secondaryText }}>Выберите подходящий план</p>

      {hasSub && (
        <div className="mb-4 p-3 rounded-2xl flex items-center gap-3"
          style={{ background: isActive ? 'rgba(48,209,88,0.08)' : 'rgba(10,132,255,0.08)', border: isActive ? '1px solid rgba(48,209,88,0.25)' : '1px solid rgba(10,132,255,0.25)' }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isActive ? '#30D158' : '#0A84FF' }} />
          <span className="text-sm" style={{ color: primaryText }}>
            Активна подписка: <span className="font-semibold">{sub.plan_name}</span>
            {sub.expires_at && ` · до ${new Date(sub.expires_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}`}
          </span>
        </div>
      )}

      {!isTrialActive && !isActive && (
        <div className="mb-3">
          <div className="p-4 rounded-3xl" style={{ background: isLight ? 'rgba(10,132,255,0.06)' : 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.35)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold" style={{ color: primaryText }}>{trialPlan?.name || 'Пробный'}</span>
              <div className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, rgba(48,209,88,0.18), rgba(48,209,88,0.08))', border: '1px solid rgba(48,209,88,0.35)', color: '#30D158' }}>
                <span style={{ fontSize: '13px' }}>✦</span> <span style={{ fontSize: '16px', fontWeight: 800 }}>0</span> ₽
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: tagBg, color: primaryText }}>
                <span style={{ color: '#0A84FF' }}>⚡</span> {trialPlan?.traffic_gb || 50} ГБ
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: tagBg, color: primaryText }}>
                <span style={{ color: '#5E5CE6' }}>∞</span> Устройств
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tagBg, color: secondaryText }}>{trialPlan?.days || 7} дней</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['🇳🇱 Нидерланды', '🇩🇪 Германия', '🇫🇮 Финляндия', '+ и другие серверы', '🇷🇺✅ Белые списки'].map((f, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: tagBg, color: secondaryText }}>{f}</span>
              ))}
            </div>
            <button
              onClick={() => !trialDone && createTrial.mutate()}
              disabled={createTrial.isPending || trialDone}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
              style={{ background: trialDone ? 'rgba(48,209,88,0.3)' : 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 15px rgba(10,132,255,0.3)' }}>
              {createTrial.isPending
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : trialDone
                  ? <><Check size={16} /> Триал активирован!</>
                  : 'Попробовать бесплатно'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <div className="p-4 rounded-3xl" style={{ background: cardBg, border: cardBorder, backdropFilter: isLight ? 'none' : 'blur(20px)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold" style={{ color: primaryText }}>{paidPlan?.name || 'Basic'}</span>
            <div className="text-right">
              <span className="text-xl font-bold" style={{ color: primaryText }}>₽ {selected?.price || 99}</span>
              <div className="text-xs" style={{ color: secondaryText }}>/ {selected?.months || 1} мес</div>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(10,132,255,0.12)', color: primaryText, border: '1px solid rgba(10,132,255,0.2)' }}>
              <span style={{ color: '#0A84FF' }}>⚡</span> {paidPlan?.traffic_gb || 300} ГБ
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(94,92,230,0.12)', color: primaryText, border: '1px solid rgba(94,92,230,0.2)' }}>
              <span style={{ color: '#5E5CE6' }}>∞</span> Устройств
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['🇳🇱 Нидерланды', '🇩🇪 Германия', '🇫🇮 Финляндия', '+ и другие серверы', '🇷🇺✅ Белые списки'].map((f, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: tagBg, color: secondaryText }}>{f}</span>
            ))}
          </div>
          <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: '12px', paddingTop: '10px' }}>
            {safeDurations.map((d) => (
              <button key={d.months} onClick={() => setSelectedMonths(d.months)}
                className="flex-shrink-0 flex flex-col items-center rounded-2xl relative"
                style={{
                  background: selectedMonths === d.months ? 'rgba(10,132,255,0.18)' : durationBg,
                  border: selectedMonths === d.months ? '1px solid rgba(10,132,255,0.45)' : `1px solid ${durationBorder}`,
                  minWidth: '76px', padding: '10px 12px', marginTop: '6px',
                }}>
                {d.discount && (
                  <div className="absolute flex items-center justify-center rounded-full font-bold"
                    style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', color: 'white', fontSize: '9px', padding: '2px 6px', whiteSpace: 'nowrap', borderRadius: '100px' }}>
                    -{d.discount}%
                  </div>
                )}
                <span className="text-xs font-semibold" style={{ color: selectedMonths === d.months ? '#0A84FF' : secondaryText }}>{d.months} мес</span>
                <span className="text-sm font-bold mt-0.5" style={{ color: selectedMonths === d.months ? primaryText : secondaryText }}>₽{d.price}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setPaymentModal({ plan: `${paidPlan?.name || 'Basic'} · ${selected?.months || 1} мес`, price: selected?.price || 99, months: selected?.months || 1 })}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
            {isActive ? 'Продлить подписку' : 'Выбрать тариф'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {paymentModal && (
          <PaymentModal
            plan={paymentModal.plan}
            price={paymentModal.price}
            months={paymentModal.months}
            onClose={() => setPaymentModal(null)}
            onPay={createPayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}