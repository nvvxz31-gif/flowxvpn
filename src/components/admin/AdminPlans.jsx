import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const DEFAULT_DURATIONS = [
  { months: 1, price: 99, discount: null },
  { months: 3, price: 249, discount: 15 },
  { months: 6, price: 449, discount: 25 },
  { months: 12, price: 899, discount: 35 },
];

export default function AdminPlans() {
  const qc = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price_rub: '', traffic_gb: 300, days: 30 });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: () => base44.entities.Plan.list('sort_order', 100),
  });

  const createPlan = useMutation({
    mutationFn: (data) => base44.entities.Plan.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-plans'] });
      setShowCreateModal(false);
      setNewPlan({ name: '', price_rub: '', traffic_gb: 300, days: 30 });
    },
  });

  const updatePlan = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Plan.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-plans'] });
      setEditingPlan(null);
    },
  });

  const deletePlan = useMutation({
    mutationFn: (id) => base44.entities.Plan.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-plans'] }),
  });

  const handleCreate = () => {
    if (!newPlan.name || !newPlan.price_rub) return;
    createPlan.mutate({
      ...newPlan,
      price_rub: Number(newPlan.price_rub),
      traffic_gb: Number(newPlan.traffic_gb),
      days: Number(newPlan.days),
      is_trial: false,
      is_active: true,
      durations: DEFAULT_DURATIONS,
    });
  };

  const handleSaveEdit = () => {
    if (!editingPlan?.id) return;
    const { id, ...data } = editingPlan;
    updatePlan.mutate({ id, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Тарифы</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Управление планами подписки · {plans.length} тарифов</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Создать тариф</span>
          <span className="sm:hidden">Создать</span>
        </button>
      </div>

      {plans.length === 0 && (
        <div className="glass-card p-8 rounded-2xl text-center mb-6">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-sm mb-4" style={{ color: '#98989D' }}>Тарифы ещё не созданы</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
          >
            Создать первый тариф
          </button>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card p-5 rounded-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: '#F5F5F7' }}>{plan.name}</span>
                  {plan.is_trial && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}>Триал</span>}
                  {!plan.is_active && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(152,152,157,0.15)', color: '#98989D' }}>Неактивен</span>}
                </div>
                <div className="text-xs" style={{ color: '#98989D' }}>{plan.traffic_gb === 0 ? '∞ ГБ' : `${plan.traffic_gb} ГБ`} · {plan.days} дней</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-mono" style={{ color: plan.is_trial ? '#30D158' : '#F5F5F7' }}>
                  {plan.is_trial ? 'Free' : `от ₽${plan.price_rub}`}
                </div>
              </div>
            </div>

            {plan.durations && plan.durations.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {plan.durations.map((d, di) => (
                  <div key={di} className="flex-shrink-0 text-center px-3 py-1.5 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#98989D' }}>
                    <div className="font-semibold" style={{ color: '#F5F5F7' }}>₽{d.price}</div>
                    <div>{d.months} мес{d.discount ? ` -${d.discount}%` : ''}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setEditingPlan({ ...plan })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(10,132,255,0.1)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}>
                <Edit2 size={13} /> Редактировать
              </button>
              {!plan.is_trial && (
                <button onClick={() => deletePlan.mutate(plan.id)}
                  className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,69,58,0.1)', color: '#FF453A', border: '1px solid rgba(255,69,58,0.2)' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPlan && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditingPlan(null)} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl md:left-1/2 md:bottom-auto md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:w-96"
              style={{ background: 'rgba(18,18,20,0.99)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg" style={{ color: '#F5F5F7' }}>Редактировать тариф</h3>
                <button onClick={() => setEditingPlan(null)}><X size={18} color="#98989D" /></button>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  ['Название', 'name', 'text'],
                  ['Трафик (ГБ)', 'traffic_gb', 'number'],
                  ['Дней', 'days', 'number'],
                  ...(!editingPlan.is_trial ? [['Цена (₽)', 'price_rub', 'number']] : []),
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <div className="text-xs mb-1.5" style={{ color: '#98989D' }}>{label}</div>
                    <input type={type} value={editingPlan[key] ?? ''} onChange={e => setEditingPlan(prev => ({ ...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F5F7' }} />
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm" style={{ color: '#F5F5F7' }}>Активен</span>
                  <motion.button
                    onClick={() => setEditingPlan(p => ({ ...p, is_active: !p.is_active }))}
                    className="relative w-12 h-6 rounded-full"
                    style={{ background: editingPlan.is_active ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <motion.div className="absolute top-0.5 bottom-0.5 aspect-square rounded-full bg-white shadow-sm"
                      animate={{ left: editingPlan.is_active ? 'calc(100% - 22px)' : '2px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveEdit}
                disabled={updatePlan.isPending}
                className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                {updatePlan.isPending
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Save size={15} /> Сохранить</>}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCreateModal(false)} />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl md:left-1/2 md:bottom-auto md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:w-96"
              style={{ background: 'rgba(18,18,20,0.99)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg" style={{ color: '#F5F5F7' }}>Новый тариф</h3>
                <button onClick={() => setShowCreateModal(false)}><X size={18} color="#98989D" /></button>
              </div>
              <div className="space-y-3 mb-5">
                {[['Название', 'name', 'text'], ['Цена (₽)', 'price_rub', 'number'], ['Трафик (ГБ)', 'traffic_gb', 'number'], ['Дней', 'days', 'number']].map(([label, key, type]) => (
                  <div key={key}>
                    <div className="text-xs mb-1.5" style={{ color: '#98989D' }}>{label}</div>
                    <input type={type} value={newPlan[key]} onChange={e => setNewPlan(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F5F7' }} placeholder={label} />
                  </div>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreate} disabled={createPlan.isPending}
                className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                {createPlan.isPending
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Создать тариф'}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}