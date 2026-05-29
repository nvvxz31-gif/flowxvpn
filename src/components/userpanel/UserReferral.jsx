import React, { useState } from 'react';
import { useReferralCode } from '@/hooks/useSubscription';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, TrendingUp, Users, DollarSign, ArrowUpRight, X, Download, Image } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/lib/AppContext';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const dataByPeriod = {
  day: [{ label: '00:00', revenue: 120 },{ label: '04:00', revenue: 80 },{ label: '08:00', revenue: 200 },{ label: '12:00', revenue: 350 },{ label: '16:00', revenue: 420 },{ label: '20:00', revenue: 280 }],
  week: [{ label: 'Пн', revenue: 450 },{ label: 'Вт', revenue: 720 },{ label: 'Ср', revenue: 380 },{ label: 'Чт', revenue: 920 },{ label: 'Пт', revenue: 650 },{ label: 'Сб', revenue: 1100 },{ label: 'Вс', revenue: 840 }],
  month: [{ label: '1', revenue: 300 },{ label: '5', revenue: 650 },{ label: '10', revenue: 480 },{ label: '15', revenue: 920 },{ label: '20', revenue: 750 },{ label: '25', revenue: 1200 },{ label: '30', revenue: 880 }],
  all: [{ label: 'Янв', revenue: 1200 },{ label: 'Фев', revenue: 1800 },{ label: 'Мар', revenue: 2400 },{ label: 'Апр', revenue: 2100 },{ label: 'Май', revenue: 3200 },{ label: 'Июн', revenue: 2800 }],
};
const periodLabels = { day: 'Сегодня', week: 'Неделя', month: 'Месяц', all: 'Всё время' };

const WITHDRAW_METHODS = [
  { id: 'cryptobot', label: 'CryptoBot', icon: '🤖' },
  { id: 'usdt', label: 'USDT TRC20', icon: '💎' },
  { id: 'btc', label: 'Bitcoin', icon: '₿' },
  { id: 'eth', label: 'Ethereum', icon: '⟠' },
];

export default function UserReferral() {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const { data: referral } = useReferralCode();
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMethod, setSelectedMethod] = useState('cryptobot');
  const refLink = referral?.code ? `https://t.me/flowxvpn_bot?start=${referral.code}` : '';

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.95)' : 'rgba(28,28,30,0.6)';
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';
  const statBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';

  const stats = [
    { label: 'Рефералы', value: String(referral?.referral_count || 0), icon: Users, color: '#5E5CE6' },
    { label: 'Доход', value: `₽ ${(referral?.total_earned_rub || 0).toLocaleString('ru')}`, icon: DollarSign, color: '#30D158' },
    { label: 'К выплате', value: `₽ ${(referral?.pending_balance_rub || 0).toLocaleString('ru')}`, icon: TrendingUp, color: '#0A84FF' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: primaryText, letterSpacing: '-0.02em' }}>Партнёры</h1>
        <p className="text-sm" style={{ color: secondaryText }}>Зарабатывай с FlowX VPN</p>
      </div>

      {/* RefShare info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-3xl mb-5"
        style={{ background: isLight ? 'rgba(10,132,255,0.06)' : 'linear-gradient(135deg, rgba(10,132,255,0.1), rgba(94,92,230,0.1))', border: '1px solid rgba(10,132,255,0.25)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💎</span>
          <span className="text-sm font-bold" style={{ color: '#0A84FF' }}>RefShare 50%</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(48,209,88,0.15)', color: '#30D158' }}>Активно</span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: secondaryText }}>
          Вы получаете <span style={{ color: primaryText, fontWeight: 600 }}>50% комиссии</span> со всех пополнений пользователей, зарегистрировавшихся по вашей ссылке. Начисление — мгновенно.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: 'Комиссия', value: '50%' }, { label: 'Выплата', value: 'от ₽500' }, { label: 'Зачисление', value: 'Сразу' }].map(({ label, value }) => (
            <div key={label} className="text-center p-2 rounded-xl" style={{ background: statBg }}>
              <div className="text-sm font-bold" style={{ color: primaryText }}>{value}</div>
              <div className="text-xs" style={{ color: secondaryText }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: i * 0.07 }}
            className="p-3 rounded-2xl" style={{ background: cardBg, border: cardBorder }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-2" style={{ background: `${stat.color}20` }}>
              <stat.icon size={14} color={stat.color} />
            </div>
            <div className="text-base font-bold font-mono" style={{ color: primaryText }}>{stat.value}</div>
            <div className="text-xs" style={{ color: secondaryText }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-4 rounded-3xl mb-5" style={{ background: cardBg, border: cardBorder }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: primaryText }}>Доход</span>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(periodLabels).map(([key, label]) => (
              <button key={key} onClick={() => setSelectedPeriod(key)}
                className="text-xs px-2 py-0.5 rounded-full transition-all"
                style={{
                  background: selectedPeriod === key ? 'rgba(10,132,255,0.2)' : 'transparent',
                  color: selectedPeriod === key ? '#0A84FF' : secondaryText,
                  border: selectedPeriod === key ? '1px solid rgba(10,132,255,0.4)' : '1px solid transparent',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={dataByPeriod[selectedPeriod]}>
            <defs>
              <linearGradient id="refGradWeb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: secondaryText, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(28,28,30,0.9)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: primaryText, fontSize: 12 }} cursor={false} />
            <Area type="monotone" dataKey="revenue" stroke="#0A84FF" strokeWidth={2} fill="url(#refGradWeb)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Referral link */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl mb-4" style={{ background: cardBg, border: cardBorder }}>
        <div className="text-xs mb-2 font-medium" style={{ color: secondaryText }}>Ваша реферальная ссылка</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-xl text-xs font-mono truncate"
            style={{ background: 'rgba(10,132,255,0.08)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}>
            {refLink || 'Загрузка...'}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}
            className="p-2.5 rounded-xl flex-shrink-0"
            style={{ background: copied ? 'rgba(48,209,88,0.2)' : 'rgba(10,132,255,0.2)', border: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.08)' }}>
            {copied ? <Check size={14} color="#30D158" /> : <Copy size={14} color="#0A84FF" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Banners */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="p-4 rounded-2xl mb-4" style={{ background: cardBg, border: cardBorder }}>
        <div className="flex items-center gap-2 mb-3">
          <Image size={14} color="#5E5CE6" />
          <span className="text-xs font-semibold" style={{ color: primaryText }}>Баннеры для залива трафика</span>
        </div>
        <div className="w-full h-20 rounded-2xl flex flex-col items-center justify-center mb-3"
          style={{ background: 'rgba(94,92,230,0.08)', border: '2px dashed rgba(94,92,230,0.3)' }}>
          <Image size={24} color="rgba(94,92,230,0.4)" />
          <span className="text-xs mt-1" style={{ color: secondaryText }}>Баннеры будут добавлены</span>
        </div>
        <motion.button whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: 'rgba(94,92,230,0.15)', color: '#5E5CE6', border: '1px solid rgba(94,92,230,0.3)' }}>
          <Download size={14} /> Скачать баннеры
        </motion.button>
      </motion.div>

      {/* Withdraw button */}
      <motion.button initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }} onClick={() => setShowWithdrawModal(true)}
        className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
        style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)', color: '#30D158' }}>
        <DollarSign size={16} /> Заявка на вывод ₽ {(referral?.pending_balance_rub || 0).toLocaleString('ru')} <ArrowUpRight size={14} />
      </motion.button>

      {/* Withdraw modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)' }}
              onClick={() => setShowWithdrawModal(false)} />
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={springConfig}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl"
              style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold" style={{ color: primaryText }}>Вывод средств</h3>
                <button onClick={() => setShowWithdrawModal(false)}><X size={20} color={secondaryText} /></button>
              </div>
              <p className="text-xs font-semibold mb-3" style={{ color: secondaryText }}>Способ вывода</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {WITHDRAW_METHODS.map(m => (
                  <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setSelectedMethod(m.id)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-left"
                    style={{
                      background: selectedMethod === m.id ? 'rgba(10,132,255,0.15)' : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.5)'),
                      border: selectedMethod === m.id ? '1px solid rgba(10,132,255,0.4)' : (isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)'),
                    }}>
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-sm font-medium" style={{ color: selectedMethod === m.id ? primaryText : secondaryText }}>{m.label}</span>
                    {selectedMethod === m.id && (
                      <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              <input placeholder="Введите адрес кошелька" className="w-full px-4 py-3 rounded-2xl text-sm mb-4 outline-none"
                style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', color: primaryText }} />
              <motion.button whileTap={{ scale: 0.97 }} className="w-full py-4 rounded-2xl font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                Отправить заявку — ₽ {(referral?.pending_balance_rub || 0).toLocaleString('ru')}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}