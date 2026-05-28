import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, X, Shield, ShieldOff, RefreshCw, Calendar, PlusCircle, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const statusConfig = {
  active: { label: 'Активен', color: '#30D158', bg: 'rgba(48,209,88,0.12)' },
  trial: { label: 'Триал', color: '#0A84FF', bg: 'rgba(10,132,255,0.12)' },
  expired: { label: 'Истёк', color: '#98989D', bg: 'rgba(152,152,157,0.12)' },
  banned: { label: 'Заблокирован', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' },
};

const filters = ['Все', 'Активные', 'Триал', 'Просроченные', 'Заблокированные'];
const filterMap = { 'Все': null, 'Активные': 'active', 'Триал': 'trial', 'Просроченные': 'expired', 'Заблокированные': 'banned' };

const MAX_BALANCE_TOP_UP = 10000;

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceInput, setBalanceInput] = useState('');
  const [actionDone, setActionDone] = useState(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date', 500),
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 500),
  });

  // Join users with subscriptions
  const enrichedUsers = users.map(u => ({
    ...u,
    sub: subscriptions.find(s => s.user_email === u.email) || null,
  }));

  const updateSub = useMutation({
    mutationFn: ({ subId, data }) => base44.entities.Subscription.update(subId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      qc.invalidateQueries({ queryKey: ['my-subscription'] });
      // Refresh selectedUser
      setSelectedUser(prev => {
        if (!prev) return prev;
        const updated = subscriptions.find(s => s.user_email === prev.email);
        return updated ? { ...prev, sub: updated } : prev;
      });
    },
  });

  const flashAction = (key) => {
    setActionDone(key);
    setTimeout(() => setActionDone(null), 2000);
  };

  const handleResetTraffic = () => {
    if (!selectedUser?.sub?.id) return;
    updateSub.mutate({ subId: selectedUser.sub.id, data: { traffic_used_gb: 0 } });
    flashAction('reset');
  };

  const handleExtend = () => {
    if (!selectedUser?.sub?.id) return;
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);
    updateSub.mutate({ subId: selectedUser.sub.id, data: { status: 'active', expires_at: newExpiry.toISOString() } });
    flashAction('extend');
  };

  const handleToggleBan = () => {
    if (!selectedUser?.sub?.id) return;
    const newStatus = selectedUser.sub?.status === 'banned' ? 'active' : 'banned';
    updateSub.mutate({ subId: selectedUser.sub.id, data: { status: newStatus } });
    flashAction('ban');
  };

  const handleAddBalance = () => {
    const amount = parseInt(balanceInput);
    if (!amount || amount <= 0) return;
    if (amount > MAX_BALANCE_TOP_UP) {
      alert(`Максимальная сумма разового начисления: ₽${MAX_BALANCE_TOP_UP}`);
      return;
    }
    if (!selectedUser?.sub?.id) return;
    const currentBalance = selectedUser.sub?.balance_rub || 0;
    updateSub.mutate({ subId: selectedUser.sub.id, data: { balance_rub: currentBalance + amount } });
    setBalanceInput('');
    flashAction('balance');
  };

  const userStatus = (u) => u.sub?.status || 'trial';

  const filtered = enrichedUsers.filter(u => {
    const st = userStatus(u);
    const statusMatch = !filterMap[activeFilter] || st === filterMap[activeFilter];
    const searchMatch = !search ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.id || '').includes(search);
    return statusMatch && searchMatch;
  });

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Пользователи</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Управление аккаунтами и подписками · {enrichedUsers.length} польз.</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0"
          style={{ background: 'rgba(10,132,255,0.12)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Выгрузить</span>
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="#98989D" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(28,28,30,0.7)', border: '1px solid rgba(255,255,255,0.07)', color: '#F5F5F7' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: activeFilter === f ? 'rgba(10,132,255,0.2)' : 'rgba(255,255,255,0.06)',
                color: activeFilter === f ? '#0A84FF' : '#98989D',
                border: activeFilter === f ? '1px solid rgba(10,132,255,0.3)' : '1px solid transparent',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium" style={{ color: '#98989D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Пользователь</span>
          <span>Тариф</span>
          <span>Статус</span>
          <span>Регистрация</span>
          <span>Трафик</span>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#98989D' }}>
            {users.length === 0 ? 'Пока нет пользователей' : 'Ничего не найдено'}
          </div>
        )}
        {filtered.map((u) => {
          const st = userStatus(u);
          const sc = statusConfig[st] || statusConfig.trial;
          const traffic = u.sub
            ? `${u.sub.traffic_used_gb || 0} / ${u.sub.traffic_total_gb || 50} ГБ`
            : '—';
          return (
            <motion.button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="w-full grid grid-cols-5 gap-4 px-5 py-4 text-left border-b"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div>
                <div className="text-sm font-medium truncate" style={{ color: '#F5F5F7' }}>{u.full_name || u.email}</div>
                <div className="text-xs truncate" style={{ color: '#98989D' }}>{u.email}</div>
              </div>
              <span className="text-sm self-center" style={{ color: '#F5F5F7' }}>{u.sub?.plan_name || '—'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full self-center w-fit" style={{ background: sc.bg, color: sc.color }}>
                {sc.label}
              </span>
              <span className="text-sm self-center" style={{ color: '#98989D' }}>{formatDate(u.created_date)}</span>
              <span className="text-xs font-mono self-center" style={{ color: '#98989D' }}>{traffic}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((u) => {
          const st = userStatus(u);
          const sc = statusConfig[st] || statusConfig.trial;
          return (
            <motion.button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className="glass-card p-4 rounded-2xl text-left w-full"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#F5F5F7' }}>{u.full_name || u.email}</div>
                  <div className="text-xs" style={{ color: '#98989D' }}>{u.email}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#F5F5F7' }}>
                  {u.sub?.plan_name || 'Нет подписки'}
                </span>
                <span className="text-xs" style={{ color: '#98989D' }}>{formatDate(u.created_date)}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* User detail panel */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={springConfig}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 p-6 overflow-y-auto"
              style={{ background: 'rgba(18,18,20,0.99)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: '#F5F5F7' }}>Детали пользователя</h3>
                <button onClick={() => setSelectedUser(null)}><X size={18} color="#98989D" /></button>
              </div>

              <div className="space-y-1 mb-6">
                {[
                  ['ID', selectedUser.id?.slice(0, 8) + '...'],
                  ['Имя', selectedUser.full_name || '—'],
                  ['Email', selectedUser.email],
                  ['Тариф', selectedUser.sub?.plan_name || '—'],
                  ['Статус', statusConfig[userStatus(selectedUser)]?.label || '—'],
                  ['Трафик', selectedUser.sub ? `${selectedUser.sub.traffic_used_gb || 0} / ${selectedUser.sub.traffic_total_gb || 50} ГБ` : '—'],
                  ['Баланс', `₽ ${selectedUser.sub?.balance_rub || 0}`],
                  ['Истекает', formatDate(selectedUser.sub?.expires_at)],
                  ['Регистрация', formatDate(selectedUser.created_date)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-sm" style={{ color: '#98989D' }}>{k}</span>
                    <span className="text-sm font-medium truncate ml-3" style={{ color: k === 'Статус' ? statusConfig[userStatus(selectedUser)]?.color : '#F5F5F7' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Add balance */}
              {selectedUser.sub && (
                <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#30D158' }}>Начислить баланс</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={balanceInput}
                      onChange={e => setBalanceInput(e.target.value)}
                      placeholder="₽ сумма"
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F5F7' }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddBalance}
                      className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                      style={{ background: actionDone === 'balance' ? 'rgba(48,209,88,0.25)' : 'rgba(48,209,88,0.15)', color: '#30D158', border: '1px solid rgba(48,209,88,0.3)' }}
                    >
                      {actionDone === 'balance' ? <Check size={13} /> : <PlusCircle size={13} />}
                      {actionDone === 'balance' ? 'OK' : 'Добавить'}
                    </motion.button>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[99, 249, 449, 899].map(amt => (
                      <button key={amt} onClick={() => setBalanceInput(String(amt))}
                        className="px-2 py-1 rounded-lg text-xs"
                        style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158' }}>
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!selectedUser.sub && (
                <div className="mb-3 p-3 rounded-xl text-sm text-center" style={{ background: 'rgba(255,255,255,0.04)', color: '#98989D' }}>
                  Нет активной подписки
                </div>
              )}

              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleResetTraffic}
                  disabled={!selectedUser.sub}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium disabled:opacity-40"
                  style={{ background: actionDone === 'reset' ? 'rgba(10,132,255,0.2)' : 'rgba(10,132,255,0.1)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.25)' }}
                >
                  {actionDone === 'reset' ? <Check size={14} /> : <RefreshCw size={14} />}
                  {actionDone === 'reset' ? 'Трафик сброшен!' : 'Сбросить трафик'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExtend}
                  disabled={!selectedUser.sub}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium disabled:opacity-40"
                  style={{ background: actionDone === 'extend' ? 'rgba(48,209,88,0.2)' : 'rgba(48,209,88,0.1)', color: '#30D158', border: '1px solid rgba(48,209,88,0.25)' }}
                >
                  {actionDone === 'extend' ? <Check size={14} /> : <Calendar size={14} />}
                  {actionDone === 'extend' ? 'Продлена на 30 дней!' : 'Продлить подписку (+30 дн.)'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleToggleBan}
                  disabled={!selectedUser.sub}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium disabled:opacity-40"
                  style={{
                    background: selectedUser.sub?.status === 'banned' ? 'rgba(48,209,88,0.1)' : 'rgba(255,69,58,0.1)',
                    color: selectedUser.sub?.status === 'banned' ? '#30D158' : '#FF453A',
                    border: `1px solid ${selectedUser.sub?.status === 'banned' ? 'rgba(48,209,88,0.25)' : 'rgba(255,69,58,0.25)'}`,
                  }}
                >
                  {selectedUser.sub?.status === 'banned' ? <ShieldOff size={14} /> : <Shield size={14} />}
                  {selectedUser.sub?.status === 'banned' ? 'Разблокировать' : 'Заблокировать'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}