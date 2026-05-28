import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Clock, Check, Plus } from 'lucide-react';

const backups = [
  { id: 1, date: '14 мая 2026, 03:00', size: '1.24 ГБ', type: 'auto', status: 'ok' },
  { id: 2, date: '13 мая 2026, 03:00', size: '1.19 ГБ', type: 'auto', status: 'ok' },
  { id: 3, date: '12 мая 2026, 15:34', size: '1.18 ГБ', type: 'manual', status: 'ok' },
  { id: 4, date: '12 мая 2026, 03:00', size: '1.17 ГБ', type: 'auto', status: 'ok' },
  { id: 5, date: '11 мая 2026, 03:00', size: '1.14 ГБ', type: 'auto', status: 'ok' },
  { id: 6, date: '10 мая 2026, 03:00', size: '1.09 ГБ', type: 'auto', status: 'ok' },
  { id: 7, date: '9 мая 2026, 03:00', size: '1.06 ГБ', type: 'auto', status: 'ok' },
];

export default function AdminBackups() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => setIsCreating(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Бэкапы</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>История резервных копий базы данных</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(10,132,255,0.12)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}
        >
          {isCreating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={14} />
              </motion.div>
              Создаётся...
            </>
          ) : (
            <>
              <Plus size={14} />
              Создать сейчас
            </>
          )}
        </motion.button>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #0A84FF, rgba(10,132,255,0.1))' }}
          />

          {backups.map((backup, i) => (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative mb-5"
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-8 top-3.5 w-2.5 h-2.5 rounded-full -translate-y-1/2"
                style={{
                  background: i === 0 ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : backup.type === 'manual' ? '#30D158' : 'rgba(255,255,255,0.2)',
                  boxShadow: i === 0 ? '0 0 12px rgba(10,132,255,0.5)' : 'none',
                  transform: 'translateX(-50%)',
                  left: '-13px',
                  top: '50%',
                }}
              />

              <div
                className="p-4 rounded-2xl flex items-center justify-between"
                style={{
                  background: i === 0 ? 'rgba(10,132,255,0.08)' : 'rgba(28,28,30,0.5)',
                  border: i === 0 ? '1px solid rgba(10,132,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: backup.type === 'manual' ? 'rgba(48,209,88,0.12)' : 'rgba(255,255,255,0.06)' }}
                  >
                    {backup.type === 'manual' ? <Plus size={14} color="#30D158" /> : <Clock size={14} color="#98989D" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: i === 0 ? '#F5F5F7' : '#98989D' }}>{backup.date}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: '#98989D' }}>{backup.size}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: backup.type === 'manual' ? 'rgba(48,209,88,0.12)' : 'rgba(255,255,255,0.06)', color: backup.type === 'manual' ? '#30D158' : '#98989D' }}
                      >
                        {backup.type === 'manual' ? 'Ручной' : 'Авто'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}>
                      Текущий
                    </span>
                  )}
                  <button
                    className="p-2 rounded-xl"
                    style={{ background: 'rgba(10,132,255,0.12)', color: '#0A84FF' }}
                  >
                    <Download size={14} />
                  </button>
                  <button
                    className="p-2 rounded-xl text-xs font-medium px-3"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#98989D' }}
                  >
                    Восстановить
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className="mt-4 p-4 rounded-2xl text-sm"
          style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.2)', color: '#FF9F0A' }}
        >
          ⚠️ Автоматический бэкап создаётся каждый день в 03:00. Хранятся последние 14 копий.
        </div>
      </div>
    </div>
  );
}