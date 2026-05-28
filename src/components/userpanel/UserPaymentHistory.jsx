import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, ArrowDownCircle } from 'lucide-react';
import { useMyTransactions } from '@/hooks/useSubscription';

const statusConfig = {
  success: { icon: CheckCircle, color: '#30D158', label: 'Оплачен', bg: 'rgba(48,209,88,0.12)' },
  pending: { icon: Clock, color: '#FF9F0A', label: 'Ожидание', bg: 'rgba(255,159,10,0.12)' },
  failed: { icon: XCircle, color: '#FF453A', label: 'Ошибка', bg: 'rgba(255,69,58,0.12)' },
};

const methodLabels = {
  sbp: 'СБП',
  card: 'Карта РФ',
  crypto: 'Крипта',
  cryptobot: 'CryptoBot',
  stars: 'Telegram Stars',
};

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function UserPaymentHistory() {
  const { data: payments = [], isLoading } = useMyTransactions();

  const successTotal = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + (p.amount_rub || 0), 0);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>
          История платежей
        </h1>
        <p className="text-sm" style={{ color: '#98989D' }}>Все ваши транзакции и чеки</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl" style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownCircle size={14} color="#30D158" />
            <span className="text-xs" style={{ color: '#98989D' }}>Всего оплачено</span>
          </div>
          <div className="text-xl font-bold font-mono" style={{ color: '#F5F5F7' }}>
            ₽ {successTotal.toLocaleString('ru')}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-4 rounded-2xl" style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} color="#0A84FF" />
            <span className="text-xs" style={{ color: '#98989D' }}>Транзакций</span>
          </div>
          <div className="text-xl font-bold font-mono" style={{ color: '#F5F5F7' }}>
            {payments.length}
          </div>
        </motion.div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-7 h-7 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && payments.length === 0 && (
        <div className="p-8 rounded-2xl text-center" style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-3xl mb-3">💳</div>
          <p className="text-sm" style={{ color: '#98989D' }}>История платежей пуста</p>
        </div>
      )}

      {/* Payments list */}
      <div className="space-y-2">
        {payments.map((p, i) => {
          const cfg = statusConfig[p.status] || statusConfig.pending;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                <Icon size={16} color={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: '#F5F5F7' }}>{p.plan_name || 'Подписка'}</div>
                <div className="text-xs" style={{ color: '#98989D' }}>
                  {formatDate(p.created_date)} · {methodLabels[p.payment_method] || p.payment_method || '—'}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold font-mono" style={{ color: '#F5F5F7' }}>₽ {(p.amount_rub || 0).toLocaleString('ru')}</div>
                <div className="text-xs" style={{ color: cfg.color }}>{cfg.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}