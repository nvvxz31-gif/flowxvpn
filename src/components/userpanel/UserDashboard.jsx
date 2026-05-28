import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Zap, Copy, Check, QrCode } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

function useCountdown(targetDate) {
  const calcLeft = () => {
    if (!targetDate) return null;
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [left, setLeft] = useState(() => calcLeft());
  useEffect(() => {
    setLeft(calcLeft());
    if (!targetDate) return;
    const t = setInterval(() => setLeft(calcLeft()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return left;
}

export default function UserDashboard() {
  const { data: sub } = useSubscription();
  const [copied, setCopied] = useState(false);
  const usedGb = sub?.traffic_used_gb || 0;
  const totalGb = sub?.traffic_total_gb || 300;
  const usedPercent = totalGb > 0 ? Math.min((usedGb / totalGb) * 100, 100) : 0;
  const expiry = sub?.expires_at || null;
  const countdown = useCountdown(expiry);
  const planName = sub?.plan_name || 'FlowX Pro';

  const handleCopy = () => {
    if (sub?.vpn_config) {
      navigator.clipboard.writeText(sub.vpn_config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Добро пожаловать</h1>
        <p className="text-sm" style={{ color: '#98989D' }}>Ваша подписка {sub?.status === 'active' ? 'активна' : sub?.status === 'trial' ? '— триал' : 'истекла'} · {planName}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl xl:col-span-2"
          style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: '#30D158' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-semibold" style={{ color: '#30D158' }}>Подписка активна</span>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(48,209,88,0.12)', color: '#30D158' }}
            >
              FlowX Pro
            </span>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center justify-center gap-3 py-4 mb-4 rounded-2xl" style={{ background: 'rgba(10,132,255,0.06)', border: '1px solid rgba(10,132,255,0.12)' }}>
            {!countdown ? (
              <div className="text-2xl font-bold font-mono" style={{ color: '#0A84FF' }}>—</div>
            ) : [
              { val: countdown.days, label: 'дней' },
              { val: countdown.hours, label: 'часов' },
              { val: countdown.minutes, label: 'минут' },
              { val: countdown.seconds, label: 'секунд' },
            ].map(({ val, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="text-lg font-bold" style={{ color: 'rgba(10,132,255,0.5)' }}>:</span>}
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono" style={{ color: '#0A84FF' }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div className="text-xs" style={{ color: '#98989D' }}>{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { Ic: Globe, label: 'Тариф', value: planName, color: '#0A84FF' },
              { Ic: Zap, label: 'Трафик', value: `${usedGb} / ${totalGb} ГБ`, color: '#5E5CE6' },
              { Ic: Clock, label: 'Истекает', value: sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' }) : '—', color: '#30D158' },
            ].map(({ Ic, label, value, color }) => (
              <div key={label} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                  style={{ background: `${color}18` }}
                >
                  <Ic size={15} color={color} />
                </div>
                <div className="text-xs mb-0.5" style={{ color: '#98989D' }}>{label}</div>
                <div className="text-xs font-semibold" style={{ color: '#F5F5F7' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Traffic bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#98989D' }}>
              <span>Использовано трафика</span>
              <span>{usedGb} / {totalGb} ГБ · {Math.round(usedPercent)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0A84FF, #5E5CE6)' }}
                initial={{ width: 0 }}
                animate={{ width: `${usedPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Config card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl"
          style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#F5F5F7' }}>Ваша конфигурация</h3>
          <div
            className="p-3 rounded-xl font-mono text-xs mb-3 truncate"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#0A84FF', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {sub?.vpn_config || 'Конфиг будет добавлен после активации...'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!sub?.vpn_config}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium disabled:opacity-40"
              style={{ background: copied ? 'rgba(48,209,88,0.12)' : 'rgba(10,132,255,0.12)', color: copied ? '#30D158' : '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Скопировано!' : 'Скопировать'}
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(94,92,230,0.12)', color: '#5E5CE6', border: '1px solid rgba(94,92,230,0.2)' }}
            >
              <QrCode size={12} />
              QR-код
            </button>
          </div>
        </motion.div>

        {/* Server info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl"
          style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#F5F5F7' }}>Активный сервер</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🇳🇱</span>
            <div>
              <div className="font-medium text-sm" style={{ color: '#F5F5F7' }}>Амстердам</div>
              <div className="text-xs" style={{ color: '#98989D' }}>Нидерланды · 45 мс</div>
            </div>
            <motion.div
              className="ml-auto w-2 h-2 rounded-full"
              style={{ background: '#30D158' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <button
            className="w-full py-2.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#98989D' }}
          >
            Сменить сервер
          </button>
        </motion.div>
      </div>
    </div>
  );
}