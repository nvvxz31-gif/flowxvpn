import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Search, Paperclip, Star, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

function statusLabel(s) {
  return { open: 'Открыт', in_progress: 'В работе', resolved: 'Решён', closed: 'Закрыт' }[s] || s;
}
function statusColor(s) {
  return { open: '#0A84FF', in_progress: '#FF9F0A', resolved: '#30D158', closed: '#98989D' }[s] || '#98989D';
}
function categoryLabel(c) {
  return { connection: '🔌 VPN / Сервер', payment: '💳 Оплата', account: '👤 Аккаунт', other: '💬 Другое' }[c] || c;
}
function priorityColor(p) {
  return { low: '#98989D', medium: '#FF9F0A', high: '#FF453A', urgent: '#FF0000' }[p] || '#98989D';
}

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.SupportTicket.list('-created_date', 100);
      setTickets(list);
      if (selected) {
        const updated = list.find(t => t.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch (e) {
      setTickets([]);
    }
    setLoading(false);
  };

  const updateTicket = async (id, data) => {
    const updated = await base44.entities.SupportTicket.update(id, data);
    await loadTickets();
    if (selected?.id === id) setSelected(updated);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    const msg = {
      id: Date.now().toString(),
      sender: 'admin',
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    };
    await updateTicket(selected.id, {
      messages: [...(selected.messages || []), msg],
      status: selected.status === 'open' ? 'in_progress' : selected.status,
    });
    setReplyText('');
  };

  const filtered = tickets.filter(t => {
    const matchSearch = !search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: tickets.filter(t => t.status === s).length }), {});

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 0px)' }}>
      {/* Left panel */}
      <div className={`${selected ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col flex-shrink-0 border-r`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: '#F5F5F7' }}>Поддержка</h2>
            <button onClick={loadTickets} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <RefreshCw size={14} color="#98989D" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className="p-1.5 rounded-xl text-center"
                style={{ background: filterStatus === s ? `${statusColor(s)}22` : 'rgba(44,44,46,0.5)', border: filterStatus === s ? `1px solid ${statusColor(s)}44` : '1px solid transparent' }}
              >
                <div className="text-sm font-bold" style={{ color: statusColor(s) }}>{counts[s] || 0}</div>
                <div className="text-xs" style={{ color: '#98989D', fontSize: '9px' }}>{statusLabel(s)}</div>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={14} color="#98989D" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск тикетов..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(44,44,46,0.8)', color: '#F5F5F7', border: '1px solid rgba(255,255,255,0.07)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: '#98989D' }}>Нет тикетов</p>
          )}
          {filtered.map(t => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(t)}
              className="w-full text-left px-3 py-3 rounded-xl"
              style={{
                background: selected?.id === t.id ? 'rgba(10,132,255,0.15)' : 'rgba(44,44,46,0.4)',
                border: selected?.id === t.id ? '1px solid rgba(10,132,255,0.3)' : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono" style={{ color: '#98989D' }}>#{t.id?.slice(-6)}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${statusColor(t.status)}22`, color: statusColor(t.status) }}>
                  {statusLabel(t.status)}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto" style={{ background: `${priorityColor(t.priority)}22`, color: priorityColor(t.priority) }}>
                  {t.priority}
                </span>
              </div>
              <div className="text-sm font-medium truncate" style={{ color: '#F5F5F7' }}>{t.subject}</div>
              <div className="text-xs mt-0.5 flex items-center justify-between">
                <span style={{ color: '#98989D' }}>{categoryLabel(t.category)}</span>
                <div className="flex items-center gap-1.5">
                  {t.rating > 0 && <span style={{ color: '#FFD60A', fontSize: '10px' }}>{'★'.repeat(t.rating)}</span>}
                  <span style={{ color: '#98989D' }}>{t.messages?.length || 0} сообщ.</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className={`${selected ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p style={{ color: '#98989D' }}>Выберите тикет для просмотра</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-start justify-between gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <button onClick={() => setSelected(null)} className="md:hidden flex-shrink-0 mt-0.5 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <ArrowLeft size={16} color="#98989D" />
                </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono" style={{ color: '#98989D' }}>#{selected.id?.slice(-6)}</span>
                  <span className="text-xs">{categoryLabel(selected.category)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold" style={{ color: '#F5F5F7' }}>{selected.subject}</h3>
                  {selected.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A' }}>
                      <Star size={10} fill="#FFD60A" strokeWidth={0} />
                      {selected.rating}/5
                    </span>
                  )}
                </div>
                {selected.flow_data && Object.keys(selected.flow_data).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Object.entries(selected.flow_data).map(([k, v]) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(44,44,46,0.8)', color: '#98989D' }}>{v}</span>
                    ))}
                  </div>
                )}
              </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status selector */}
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={e => updateTicket(selected.id, { status: e.target.value })}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-medium outline-none"
                    style={{ background: `${statusColor(selected.status)}22`, color: statusColor(selected.status), border: `1px solid ${statusColor(selected.status)}44` }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                </div>
                {/* Priority selector */}
                <div className="relative">
                  <select
                    value={selected.priority}
                    onChange={e => updateTicket(selected.id, { priority: e.target.value })}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-medium outline-none"
                    style={{ background: `${priorityColor(selected.priority)}22`, color: priorityColor(selected.priority), border: `1px solid ${priorityColor(selected.priority)}44` }}
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(selected.messages || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                    style={{
                      background: msg.sender === 'admin' ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : 'rgba(44,44,46,0.8)',
                      color: '#F5F5F7',
                    }}
                  >
                    <div className="text-xs mb-1 opacity-60 font-medium">{msg.sender === 'admin' ? 'Поддержка' : 'Пользователь'}</div>
                    {msg.text && <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>}
                    {msg.file_url && (
                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-1.5 text-xs underline opacity-80">
                        <Paperclip size={10} />
                        Вложение
                      </a>
                    )}
                    <div className="text-xs mt-1 opacity-50">{new Date(msg.timestamp).toLocaleString('ru', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply */}
            {selected.status !== 'closed' && (
              <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                    placeholder="Ответить пользователю..."
                    rows={2}
                    className="flex-1 px-4 py-3 rounded-2xl text-sm resize-none outline-none"
                    style={{ background: 'rgba(44,44,46,0.8)', color: '#F5F5F7', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReply}
                    className="w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
                  >
                    <Send size={16} color="white" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}