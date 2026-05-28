import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const auditEvents = [
  { id: 1, admin: 'superadmin', action: 'Заблокировал пользователя', object: '@spam_user (ID 9001)', time: '14.05.2026 15:42', icon: '🚫' },
  { id: 2, admin: 'support_1', action: 'Сбросил трафик', object: '@alex_moscow (ID 1284930)', time: '14.05.2026 14:18', icon: '🔄' },
  { id: 3, admin: 'superadmin', action: 'Создал тариф', object: 'FlowX Pro Max — ₽799', time: '14.05.2026 12:05', icon: '➕' },
  { id: 4, admin: 'finance_1', action: 'Одобрил вывод', object: '₽4 500 → @partner_ivan', time: '14.05.2026 11:30', icon: '✅' },
  { id: 5, admin: 'superadmin', action: 'Перезагрузил ноду', object: 'NL-AMS-01', time: '14.05.2026 10:12', icon: '🖥️' },
  { id: 6, admin: 'support_1', action: 'Продлил подписку', object: '@kate_vpn (+7 дней)', time: '14.05.2026 09:44', icon: '📅' },
  { id: 7, admin: 'superadmin', action: 'Изменил настройки', object: 'Trigger уведомлений', time: '13.05.2026 22:18', icon: '⚙️' },
  { id: 8, admin: 'finance_1', action: 'Отклонил вывод', object: '₽200 → @newbie (ниже минимума)', time: '13.05.2026 18:55', icon: '❌' },
  { id: 9, admin: 'superadmin', action: 'Добавил ноду', object: 'JP-TKY-01', time: '13.05.2026 16:30', icon: '🌐' },
  { id: 10, admin: 'support_1', action: 'Разблокировал пользователя', object: '@honest_user (ID 5539201)', time: '13.05.2026 14:15', icon: '🔓' },
];

const adminColors = {
  superadmin: { color: '#0A84FF', bg: 'rgba(10,132,255,0.12)' },
  support_1: { color: '#30D158', bg: 'rgba(48,209,88,0.12)' },
  finance_1: { color: '#FFD60A', bg: 'rgba(255,214,10,0.12)' },
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState('');

  const filtered = auditEvents.filter(e =>
    !search || e.admin.includes(search) || e.action.toLowerCase().includes(search.toLowerCase()) || e.object.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Аудит-лог</h1>
        <p className="text-sm" style={{ color: '#98989D' }}>История всех действий администраторов</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="#98989D" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по действию, админу..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(28,28,30,0.7)', border: '1px solid rgba(255,255,255,0.07)', color: '#F5F5F7' }}
          />
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#98989D', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Filter size={14} />
          Фильтр
        </button>
      </div>

      {/* Log table desktop */}
      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium" style={{ color: '#98989D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Действие</span>
          <span className="col-span-2">Объект</span>
          <span>Администратор</span>
          <span>Время</span>
        </div>
        {filtered.map((event, i) => {
          const adminStyle = adminColors[event.admin] || { color: '#98989D', bg: 'rgba(255,255,255,0.08)' };
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="grid grid-cols-5 gap-4 px-5 py-4 border-b items-center" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="text-base">{event.icon}</span>
                <span className="text-sm" style={{ color: '#F5F5F7' }}>{event.action}</span>
              </div>
              <div className="col-span-2 text-sm" style={{ color: '#98989D' }}>{event.object}</div>
              <div><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: adminStyle.bg, color: adminStyle.color }}>{event.admin}</span></div>
              <div className="text-xs font-mono" style={{ color: '#98989D' }}>{event.time}</div>
            </motion.div>
          );
        })}
      </div>
      {/* Log cards mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((event, i) => {
          const adminStyle = adminColors[event.admin] || { color: '#98989D', bg: 'rgba(255,255,255,0.08)' };
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card p-4 rounded-2xl">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-lg flex-shrink-0">{event.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{event.action}</div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: '#98989D' }}>{event.object}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: adminStyle.bg, color: adminStyle.color }}>{event.admin}</span>
                <span className="text-xs font-mono" style={{ color: '#98989D' }}>{event.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}