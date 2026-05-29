import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const revenueData = [
  { date: '1 мая', revenue: 12400, users: 84 },
  { date: '3 мая', revenue: 18200, users: 102 },
  { date: '5 мая', revenue: 15600, users: 95 },
  { date: '7 мая', revenue: 22800, users: 134 },
  { date: '9 мая', revenue: 19400, users: 118 },
  { date: '11 мая', revenue: 28600, users: 167 },
  { date: '13 мая', revenue: 31200, users: 189 },
];

const topPlans = [
  { name: 'Pro', sales: 524, revenue: 56738 },
  { name: 'Basic', sales: 312, revenue: 23288 },
  { name: 'Unlimited', sales: 189, revenue: 47061 },
  { name: 'Триал', sales: 822, revenue: 0 },
];

const dataByPeriod = {
  'День': [
    { date: '08:00', revenue: 3200, users: 18 },
    { date: '10:00', revenue: 5600, users: 31 },
    { date: '12:00', revenue: 8900, users: 54 },
    { date: '14:00', revenue: 7400, users: 43 },
    { date: '16:00', revenue: 11200, users: 67 },
    { date: '18:00', revenue: 9800, users: 58 },
    { date: '20:00', revenue: 6400, users: 38 },
  ],
  'Неделя': revenueData,
  'Месяц': [
    { date: '1 апр', revenue: 42000, users: 210 },
    { date: '8 апр', revenue: 68000, users: 340 },
    { date: '15 апр', revenue: 54000, users: 270 },
    { date: '22 апр', revenue: 91000, users: 455 },
    { date: '29 апр', revenue: 78000, users: 390 },
    { date: '6 мая', revenue: 112000, users: 560 },
    { date: '13 мая', revenue: 124000, users: 620 },
  ],
};

const CARD_STYLE = {
  background: '#18181B',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
};

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState('Неделя');

  // Mock data — replace with real API when backend is ready
  const activeSubs = [];
  const allTransactions = [];
  const allUsers = [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthlyRevenue = allTransactions
    .filter(t => t.created_date >= monthStart)
    .reduce((sum, t) => sum + (t.amount_rub || 0), 0);
  const arpu = allUsers.length > 0
    ? Math.round(allTransactions.reduce((s, t) => s + (t.amount_rub || 0), 0) / allUsers.length)
    : 0;

  const metrics = [
    {
      label: 'Выручка (месяц)',
      value: `₽ ${monthlyRevenue.toLocaleString('ru')}`,
      icon: DollarSign,
      bg: 'linear-gradient(135deg, #16a34a, #15803d)',
      iconBg: 'rgba(255,255,255,0.15)',
    },
    {
      label: 'Активных пользователей',
      value: String(activeSubs.length),
      icon: Users,
      bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      iconBg: 'rgba(255,255,255,0.15)',
    },
    {
      label: 'Всего пользователей',
      value: String(allUsers.length),
      icon: TrendingUp,
      bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      iconBg: 'rgba(255,255,255,0.15)',
    },
    {
      label: 'ARPU',
      value: `₽ ${arpu}`,
      icon: Activity,
      bg: 'linear-gradient(135deg, #ea580c, #c2410c)',
      iconBg: 'rgba(255,255,255,0.15)',
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Дашборд</h1>
        <p className="text-sm" style={{ color: '#71717a' }}>Обзор ключевых метрик сервиса</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: i * 0.07 }}
            className="p-5 rounded-2xl"
            style={{ background: m.bg }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.iconBg }}>
                <m.icon size={17} color="white" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono mb-1 text-white">{m.value}</div>
            <div className="text-xs text-white/70">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl mb-6"
        style={CARD_STYLE}
      >
        <div className="flex items-start justify-between mb-5 gap-2">
          <div>
            <h3 className="text-base font-semibold text-white">Выручка</h3>
            <p className="text-xs" style={{ color: '#71717a' }}>Динамика по периодам</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {['День', 'Неделя', 'Месяц'].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: activePeriod === period ? '#2563eb' : 'rgba(255,255,255,0.05)',
                  color: activePeriod === period ? 'white' : '#71717a',
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dataByPeriod[activePeriod]}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f4f4f5', fontSize: 12 }}
              formatter={v => [`₽ ${v.toLocaleString()}`, 'Выручка']}
              cursor={{ stroke: 'rgba(59,130,246,0.3)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl"
          style={CARD_STYLE}
        >
          <h3 className="text-base font-semibold text-white mb-4">Топ тарифов</h3>
          <div className="space-y-3">
            {topPlans.map((plan, i) => {
              const rankColors = ['#f59e0b', '#9ca3af', '#cd7c2f', '#6b7280'];
              return (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: rankColors[i] || '#6b7280' }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{plan.name}</div>
                      <div className="text-xs" style={{ color: '#71717a' }}>{plan.sales} продаж</div>
                    </div>
                  </div>
                  <div
                    className="text-sm font-mono font-semibold"
                    style={{ color: plan.revenue > 0 ? '#4ade80' : '#52525b' }}
                  >
                    {plan.revenue > 0 ? `₽ ${plan.revenue.toLocaleString()}` : 'Free'}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* User chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-6 rounded-2xl"
          style={CARD_STYLE}
        >
          <h3 className="text-base font-semibold text-white mb-4">Новые пользователи</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={revenueData}>
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f4f4f5', fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <Bar dataKey="users" fill="url(#barGrad2)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}