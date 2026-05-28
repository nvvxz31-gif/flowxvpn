import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Янв', revenue: 82000, users: 310 },
  { month: 'Фев', revenue: 91000, users: 388 },
  { month: 'Мар', revenue: 104000, users: 440 },
  { month: 'Апр', revenue: 118000, users: 502 },
  { month: 'Май', revenue: 148200, users: 623 },
];

const planShare = [
  { name: 'Pro', value: 42, color: '#0A84FF' },
  { name: 'Basic', value: 25, color: '#5E5CE6' },
  { name: 'Unlimited', value: 15, color: '#30D158' },
  { name: 'Триал', value: 18, color: '#98989D' },
];

const aiExportTypes = ['ChatGPT', 'Claude', 'Gemini', 'Generic AI'];
const aiDataOptions = ['Активные пользователи', 'Отток', 'Платежи', 'Партнёры'];
const aiFormats = ['CSV', 'JSON', 'Markdown'];

export default function AdminAnalytics() {
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAI, setSelectedAI] = useState('Claude');
  const [selectedData, setSelectedData] = useState(['Платежи', 'Активные пользователи']);
  const [selectedFormat, setSelectedFormat] = useState('CSV');

  const toggleData = (d) => {
    setSelectedData(s => s.includes(d) ? s.filter(x => x !== d) : [...s, d]);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Аналитика</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Отчёты о продажах и использовании</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.15), rgba(94,92,230,0.15))', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.25)' }}
        >
          <span>✨</span>
          <span className="hidden sm:inline">Выгрузить для ИИ</span>
          <span className="sm:hidden">ИИ</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue trend */}
        <div className="xl:col-span-2 glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-5" style={{ color: '#F5F5F7' }}>Выручка по месяцам</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#98989D', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(28,28,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#F5F5F7', fontSize: 12 }}
                formatter={v => [`₽ ${v.toLocaleString()}`, 'Выручка']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0A84FF" strokeWidth={2.5} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-5" style={{ color: '#F5F5F7' }}>Распределение тарифов</h3>
          <div className="flex justify-center mb-4">
            <PieChart width={140} height={140}>
              <Pie data={planShare} cx={70} cy={70} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {planShare.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {planShare.map(p => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs" style={{ color: '#98989D' }}>{p.name}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: '#F5F5F7' }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users growth */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-5" style={{ color: '#F5F5F7' }}>Рост пользователей</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" tick={{ fill: '#98989D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(28,28,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#F5F5F7', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="users" stroke="#30D158" strokeWidth={2.5} dot={{ fill: '#30D158', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Export Modal */}
      {showAIModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowAIModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto p-6 rounded-3xl"
            style={{ background: 'rgba(18,18,20,0.99)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-bold" style={{ color: '#F5F5F7' }}>AI Export</h3>
                <p className="text-xs" style={{ color: '#98989D' }}>Подготовить данные для анализа ИИ</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: '#98989D' }}>Выберите ИИ</p>
              <div className="grid grid-cols-4 gap-2">
                {aiExportTypes.map(ai => (
                  <button
                    key={ai}
                    onClick={() => setSelectedAI(ai)}
                    className="p-2 rounded-xl text-xs font-medium"
                    style={{
                      background: selectedAI === ai ? 'rgba(10,132,255,0.2)' : 'rgba(255,255,255,0.06)',
                      color: selectedAI === ai ? '#0A84FF' : '#98989D',
                      border: selectedAI === ai ? '1px solid rgba(10,132,255,0.35)' : '1px solid transparent',
                    }}
                  >
                    {ai}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: '#98989D' }}>Данные</p>
              <div className="flex flex-wrap gap-2">
                {aiDataOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => toggleData(d)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: selectedData.includes(d) ? 'rgba(10,132,255,0.2)' : 'rgba(255,255,255,0.06)',
                      color: selectedData.includes(d) ? '#0A84FF' : '#98989D',
                      border: selectedData.includes(d) ? '1px solid rgba(10,132,255,0.35)' : '1px solid transparent',
                    }}
                  >
                    {selectedData.includes(d) ? '✓ ' : ''}{d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-medium mb-2" style={{ color: '#98989D' }}>Формат</p>
              <div className="flex gap-2">
                {aiFormats.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: selectedFormat === f ? 'rgba(10,132,255,0.2)' : 'rgba(255,255,255,0.06)',
                      color: selectedFormat === f ? '#0A84FF' : '#98989D',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="p-3 rounded-xl mb-5 font-mono text-xs"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#98989D' }}
            >
              <div style={{ color: '#0A84FF' }}>// Превью структуры ({selectedFormat})</div>
              <div>user_id, status, plan, revenue, date</div>
              <div>1284930, active, Pro, 298, 2026-05-14</div>
              <div>9182736, trial, Trial, 0, 2026-05-14</div>
              <div style={{ color: '#98989D' }}>... +{salesData.length * 47} строк</div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
            >
              <Download size={16} />
              Скачать для {selectedAI}
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}