import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, RefreshCw, Calendar, Check } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const statusConfig = {
  active: { label: 'Активен', color: '#30D158', bg: 'rgba(48,209,88,0.12)' },
  trial: { label: 'Триал', color: '#0A84FF', bg: 'rgba(10,132,255,0.12)' },
  expired: { label: 'Истёк', color: '#98989D', bg: 'rgba(152,152,157,0.12)' },
  banned: { label: 'Заблокирован', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' },
};

const filters = ['Все', 'Активные', 'Триал', 'Просроченные', 'Заблокированные'];
const filterMap = { 'Все': null, 'Активные': 'active', 'Триал': 'trial', 'Просроченные': 'expired', 'Заблокированные': 'banned' };

const MOCK_USERS = [
  { id: 'usr_001', full_name: 'Иван Петров', email: 'ivan@mail.ru', created_date: '2026-05-10', sub: { plan_name: 'Pro', status: 'active', traffic_used_gb: 45, traffic_total_gb: 300, balance_rub: 150, expires_at: '2026-06-10' } },
  { id: 'usr_002', full_name: 'Анна Смирнова', email: 'anna@mail.ru', created_date: '2026-05-15', sub: { plan_name: 'Basic', status: 'trial', traffic_used_gb: 12, traffic_total_gb: 100, balance_rub: 0, expires_at: '2026-05-22' } },
  { id: 'usr_003', full_name: 'Олег Сидоров', email: 'oleg@mail.ru', created_date: '2026-04-01', sub: null },
];

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');
  const [selectedUser, setSelectedUser] = useState(null);

  const users = MOCK_USERS;

  const userStatus = (u) => u.sub?.status || 'trial';

  const filtered = users.filter(u => {
    const st = userStatus(u);
    const statusMatch = !filterMap[activeFilter] || st === filterMap[activeFilter];
    const searchMatch = !search ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Пользователи</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Управление аккаунтами · {users.length} польз.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="#98989D" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, email..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(28,28,30,0.7)', border: '1px solid rgba(255,255,255,0.07)', color: '#F5F5F7' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: activeFilter === f ? 'rgba(10,132,255,0.2)' : 'rgba(255,255,255,0.06)', color: activeFilter === f ? '#0A84FF' : '#98989D', border: activeFilter === f ? '1px solid rgba(10,132,255,0.3)' : '1px solid transparent' }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium" style={{ color: '#98989D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Пользователь</span><span>Тариф</span><span>Статус</span><span>Регистрация</span><span>Трафик</span>
        </div>
        {filtered.map((u) => {
          const st = userStatus(u);
          const sc = statusConfig[st] || statusConfig.trial;
          return (
            <motion.button key={u.id} onClick={() => setSelectedUser(u)} whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} className="w-full grid grid-cols-5 gap-4 px-5 py-4 text-left border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div><div className="text-sm font-medium truncate" style={{ color: '#F5F5F7' }}>{u.full_name || u.email}</div><div className="text-xs truncate" style={{ color: '#98989D' }}>{u.email}</div></div>
              <span className="text-sm self-center" style={{ color: '#F5F5F7' }}>{u.sub?.plan_name || '—'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full self-center w-fit" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
              <span className="text-sm self-center" style={{ color: '#98989D' }}>{formatDate(u.created_date)}</span>
              <span className="text-xs font-mono self-center" style={{ color: '#98989D' }}>{u.sub ? `${u.sub.traffic_used_gb} / ${u.sub.traffic_total_gb} ГБ` : '—'}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedUser(null)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={springConfig} className="fixed right-0 top-0 bottom-0 z-50 w-80 p-6 overflow-y-auto" style={{ background: 'rgba(18,18,20,0.99)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: '#F5F5F7' }}>Детали пользователя</h3>
                <button onClick={() => setSelectedUser(null)}><X size={18} color="#98989D" /></button>
              </div>
              <div className="space-y-1 mb-6">
                {[['ID', selectedUser.id], ['Имя', selectedUser.full_name || '—'], ['Email', selectedUser.email], ['Тариф', selectedUser.sub?.plan_name || '—'], ['Статус', statusConfig[userStatus(selectedUser)]?.label || '—'], ['Трафик', selectedUser.sub ? `${selectedUser.sub.traffic_used_gb || 0} / ${selectedUser.sub.traffic_total_gb || 50} ГБ` : '—'], ['Баланс', `₽ ${selectedUser.sub?.balance_rub || 0}`], ['Истекает', formatDate(selectedUser.sub?.expires_at)], ['Регистрация', formatDate(selectedUser.created_date)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}><span className="text-sm" style={{ color: '#98989D' }}>{k}</span><span className="text-sm font-medium truncate ml-3" style={{ color: '#F5F5F7' }}>{v}</span></div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}