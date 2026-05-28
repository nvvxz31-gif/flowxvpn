import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

const partners = [
  { id: 1, username: '@tech_blogger', referrals: 89, conversions: 34, revenue: 9844, paid: 6800 },
  { id: 2, username: '@vpn_review', referrals: 124, conversions: 51, revenue: 14649, paid: 10000 },
  { id: 3, username: '@privacy_news', referrals: 42, conversions: 18, revenue: 5382, paid: 3000 },
  { id: 4, username: '@secure_life', referrals: 67, conversions: 28, revenue: 8372, paid: 5000 },
];

const withdrawals = [
  { id: 1, partner: '@tech_blogger', amount: 3044, method: 'CryptoBot', status: 'new' },
  { id: 2, partner: '@vpn_review', amount: 4649, method: 'USDT TRC20', status: 'processing' },
  { id: 3, partner: '@privacy_news', amount: 2382, method: 'CryptoBot', status: 'done' },
  { id: 4, partner: '@secure_life', amount: 3372, method: 'CryptoBot', status: 'rejected' },
];

const statusConfig = {
  new: { label: 'Новая', color: '#0A84FF', bg: 'rgba(10,132,255,0.12)' },
  processing: { label: 'В обработке', color: '#FFD60A', bg: 'rgba(255,214,10,0.12)' },
  done: { label: 'Выполнена', color: '#30D158', bg: 'rgba(48,209,88,0.12)' },
  rejected: { label: 'Отклонена', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' },
};

export default function AdminPartners() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Партнёрская программа</h1>
        <p className="text-sm" style={{ color: '#98989D' }}>Статистика партнёров и заявки на вывод</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Всего партнёров', value: '4', color: '#0A84FF' },
          { label: 'Общий доход', value: '₽ 38 247', color: '#30D158' },
          { label: 'Выплачено', value: '₽ 24 800', color: '#5E5CE6' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#98989D' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Partners table desktop */}
      <div className="glass-card rounded-2xl overflow-hidden mb-6 hidden md:block">
        <div className="px-5 py-3 text-sm font-semibold border-b" style={{ color: '#F5F5F7', borderColor: 'rgba(255,255,255,0.06)' }}>
          Топ партнёры
        </div>
        <div className="grid grid-cols-5 gap-4 px-5 py-2 text-xs font-medium" style={{ color: '#98989D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Партнёр</span>
          <span>Переходы</span>
          <span>Регистрации</span>
          <span>Доход</span>
          <span>Выплачено</span>
        </div>
        {partners.map((p) => (
          <div key={p.id} className="grid grid-cols-5 gap-4 px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{p.username}</span>
            <span className="text-sm font-mono" style={{ color: '#0A84FF' }}>{p.referrals}</span>
            <span className="text-sm font-mono" style={{ color: '#98989D' }}>{p.conversions}</span>
            <span className="text-sm font-mono font-bold" style={{ color: '#30D158' }}>₽ {p.revenue.toLocaleString()}</span>
            <span className="text-sm font-mono" style={{ color: '#98989D' }}>₽ {p.paid.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {/* Partners cards mobile */}
      <div className="flex flex-col gap-3 mb-6 md:hidden">
        <div className="text-sm font-semibold mb-1" style={{ color: '#F5F5F7' }}>Топ партнёры</div>
        {partners.map((p) => (
          <div key={p.id} className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{p.username}</span>
              <span className="text-sm font-mono font-bold" style={{ color: '#30D158' }}>₽ {p.revenue.toLocaleString()}</span>
            </div>
            <div className="flex gap-4 text-xs" style={{ color: '#98989D' }}>
              <span>Переходов: <span style={{ color: '#0A84FF' }}>{p.referrals}</span></span>
              <span>Рег: {p.conversions}</span>
              <span>Выплачено: ₽{p.paid.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Withdrawal requests */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: '#F5F5F7' }}>Заявки на вывод</h3>
        <div className="space-y-3">
          {withdrawals.map((w, i) => {
            const sc = statusConfig[w.status];
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-4 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{w.partner}</div>
                    <div className="text-xs" style={{ color: '#98989D' }}>{w.method}</div>
                  </div>
                  <div className="text-base font-bold font-mono" style={{ color: '#F5F5F7' }}>₽ {w.amount.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {sc.label}
                  </span>
                  {w.status === 'new' && (
                    <>
                      <button
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(48,209,88,0.12)', color: '#30D158' }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(255,69,58,0.12)', color: '#FF453A' }}
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}