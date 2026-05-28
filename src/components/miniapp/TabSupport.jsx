import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Plus, Ticket, Paperclip, Star, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const FLOWS = {
  connection: {
    label: 'Проблема с VPN / сервером',
    icon: '🔌',
    steps: [
      {
        key: 'issue',
        question: 'В чём проблема?',
        options: ['VPN не запускается', 'Подключается но не работает', 'Медленная скорость', 'Периодически отключается', 'Сервер недоступен', 'Сайты не открываются'],
      },
      {
        key: 'server',
        question: 'Сервер (если применимо)',
        options: ['Нидерланды', 'Германия', 'Швеция', 'США', 'Другой'],
      },
      {
        key: 'device',
        question: 'Ваше устройство',
        options: ['iPhone / iPad', 'Android', 'Windows', 'macOS'],
      },
      {
        key: 'app',
        question: 'Приложение VPN',
        options: ['Happ', 'V2Ray', 'Incy', 'Другое'],
      },
    ],
  },
  payment: {
    label: 'Проблема с оплатой',
    icon: '💳',
    steps: [
      {
        key: 'issue',
        question: 'Проблема с оплатой',
        options: ['Деньги списались, баланс не пополнился', 'Ошибка при оплате', 'Хочу вернуть деньги', 'Другое'],
      },
      {
        key: 'method',
        question: 'Способ оплаты',
        options: ['СБП', 'Карта РФ', 'Крипта', 'CryptoBot', 'Telegram Stars'],
      },
    ],
  },
  account: {
    label: 'Вопрос по аккаунту',
    icon: '👤',
    steps: [
      {
        key: 'issue',
        question: 'Вопрос по аккаунту',
        options: ['Не могу войти', 'Потерял доступ', 'Нужно изменить email', 'Хочу удалить аккаунт'],
      },
    ],
  },
};

function statusLabel(s) {
  return { open: 'Открыт', in_progress: 'В работе', resolved: 'Решён', closed: 'Закрыт' }[s] || s;
}
function statusColor(s) {
  return { open: '#0A84FF', in_progress: '#FF9F0A', resolved: '#30D158', closed: '#98989D' }[s] || '#98989D';
}
function categoryLabel(c) {
  return { connection: '🔌 VPN / Сервер', payment: '💳 Оплата', account: '👤 Аккаунт' }[c] || c;
}

function RatingModal({ onRate, onClose }) {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const labels = ['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];

  const handleSubmit = () => {
    if (selected > 0) onRate(selected);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={springConfig}
        className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl"
        style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold" style={{ color: primaryText }}>Оцените работу оператора</h3>
          <button onClick={onClose}><X size={18} color={secondaryText} /></button>
        </div>
        <div className="flex justify-center gap-3 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.85 }}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(n)}
            >
              <Star
                size={36}
                fill={(hovered || selected) >= n ? '#FFD60A' : 'transparent'}
                color={(hovered || selected) >= n ? '#FFD60A' : isLight ? '#ccc' : '#444'}
                strokeWidth={1.5}
              />
            </motion.button>
          ))}
        </div>
        {(hovered || selected) > 0 && (
          <p className="text-center text-sm mb-4" style={{ color: '#FFD60A' }}>
            {labels[hovered || selected]}
          </p>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={selected === 0}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm"
          style={{
            background: selected > 0 ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(44,44,46,0.8)'),
            color: selected > 0 ? 'white' : secondaryText,
          }}
        >
          Отправить оценку
        </motion.button>
      </motion.div>
    </>
  );
}

function TicketChat({ ticket, onBack, onSend, onRate }) {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const inputBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.8)';
  const inputBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';
  const btnBg = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(44,44,46,0.8)';
  const btnBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';

  const [text, setText] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [attachFile, setAttachFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSend = async () => {
    if (!text.trim() && !attachFile) return;
    setUploading(true);
    let fileUrl = null;
    if (attachFile) {
      try {
        const res = await base44.integrations.Core.UploadFile({ file: attachFile });
        fileUrl = res.file_url;
      } catch (e) {}
    }
    await onSend(ticket.id, text.trim(), fileUrl);
    setText('');
    setAttachFile(null);
    setUploading(false);
  };

  const handleRate = async (rating) => {
    await onRate(ticket.id, rating);
    setShowRating(false);
  };

  const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';
  const alreadyRated = ticket.rating > 0;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <button onClick={onBack}>
          <ChevronLeft size={20} color="#0A84FF" />
        </button>
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: primaryText }}>#{ticket.id?.slice(-6)} {ticket.subject}</div>
          <div className="text-xs" style={{ color: statusColor(ticket.status) }}>{statusLabel(ticket.status)}</div>
        </div>
        {isClosed && !alreadyRated && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRating(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(255,214,10,0.15)', color: '#FFD60A', border: '1px solid rgba(255,214,10,0.3)' }}
          >
            <Star size={11} />
            Оценить
          </motion.button>
        )}
        {alreadyRated && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs" style={{ background: 'rgba(255,214,10,0.1)', color: '#FFD60A' }}>
            {'★'.repeat(ticket.rating)}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {(ticket.messages || []).map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm"
              style={{
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)'
                  : (theme === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(44,44,46,0.8)'),
                color: msg.sender === 'user' ? '#ffffff' : (theme === 'light' ? '#1C1C1E' : '#F5F5F7'),
              }}
            >
              {msg.text && <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>}
              {msg.file_url && (
                <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-1.5 text-xs underline opacity-80">
                  <Paperclip size={11} />
                  Вложение
                </a>
              )}
              <div className="text-xs mt-1 opacity-60">{new Date(msg.timestamp).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isClosed && (
        <div className="flex-shrink-0 pt-2">
          {attachFile && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(10,132,255,0.1)', color: '#0A84FF' }}>
              <Paperclip size={11} />
              <span className="flex-1 truncate">{attachFile.name}</span>
              <button onClick={() => setAttachFile(null)}><X size={12} /></button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: btnBg, border: btnBorder }}
            >
              <Paperclip size={15} color={secondaryText} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={e => setAttachFile(e.target.files?.[0] || null)}
            />
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Написать сообщение..."
              className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: inputBg, color: primaryText, border: inputBorder }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={uploading}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
            >
              {uploading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={15} color="white" />}
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showRating && <RatingModal onRate={handleRate} onClose={() => setShowRating(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default function TabSupport() {
  const { theme } = useApp();
  const { user } = useAuth();
  const isLight = theme === 'light';

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(28,28,30,0.8)';
  const cardBorder = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)';
  const inputBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(44,44,46,0.8)';
  const inputBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  const [view, setView] = useState('main');
  const [flowKey, setFlowKey] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customText, setCustomText] = useState('');
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    try {
      const list = user?.email
        ? await base44.entities.SupportTicket.filter({ user_email: user.email }, '-created_date', 50)
        : [];
      setTickets(list);
    } catch (e) {
      setTickets([]);
    }
  };

  const currentFlow = flowKey ? FLOWS[flowKey] : null;
  const currentStep = currentFlow ? currentFlow.steps[stepIdx] : null;

  const handleOption = (opt) => {
    if (!currentStep) return;
    const newAnswers = { ...answers, [currentStep.key]: opt };
    setAnswers(newAnswers);
    if (stepIdx + 1 < currentFlow.steps.length) {
      setStepIdx(stepIdx + 1);
    } else {
      setView('final');
    }
  };

  const handleCreateTicket = async () => {
    if (!customText.trim() && !flowKey) return;
    if (!user) return;
    setLoading(true);
    try {
      const subject = customText.trim() || Object.values(answers)[0] || currentFlow?.label || 'Новый запрос';
      const firstMsg = {
        id: Date.now().toString(),
        sender: 'user',
        text: buildSummary(),
        timestamp: new Date().toISOString(),
      };
      const autoReply = {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        text: 'Спасибо! Ваш запрос принят. Мы ответим в течение нескольких минут.',
        timestamp: new Date().toISOString(),
      };
      const ticket = await base44.entities.SupportTicket.create({
        user_email: user?.email || '',
        user_name: user?.full_name || user?.email || '',
        category: flowKey || 'other',
        subject,
        status: 'open',
        priority: 'medium',
        messages: [firstMsg, autoReply],
        flow_data: answers,
        rating: 0,
      });
      await loadTickets();
      setActiveTicket(ticket);
      setView('chat');
      setFlowKey(null);
      setStepIdx(0);
      setAnswers({});
      setCustomText('');
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const buildSummary = () => {
    if (!flowKey) return customText;
    const lines = [`Тема: ${currentFlow?.label}`];
    Object.entries(answers).forEach(([k, v]) => lines.push(`${k}: ${v}`));
    if (customText) lines.push(`Дополнительно: ${customText}`);
    return lines.join('\n');
  };

  const handleSendMessage = async (ticketId, text, fileUrl) => {
    const msg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      file_url: fileUrl || null,
      timestamp: new Date().toISOString(),
    };
    const t = tickets.find(t => t.id === ticketId);
    if (!t) return;
    try {
      const updated = await base44.entities.SupportTicket.update(ticketId, {
        messages: [...(t.messages || []), msg],
      });
      setActiveTicket(updated);
      await loadTickets();
    } catch (e) {
      console.error('Send message failed', e);
    }
  };

  const handleRateTicket = async (ticketId, rating) => {
    try {
      const updated = await base44.entities.SupportTicket.update(ticketId, { rating });
      setActiveTicket(updated);
      await loadTickets();
    } catch (e) {
      console.error('Rate ticket failed', e);
    }
  };

  const openTicket = (t) => {
    setActiveTicket(t);
    setView('chat');
  };

  return (
    <div className="px-4 pt-16 pb-4">
      <AnimatePresence mode="wait">
        {/* MAIN */}
        {view === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={springConfig}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: primaryText }}>Поддержка</h2>
                <p className="text-xs mt-0.5" style={{ color: secondaryText }}>Мы ответим в течение нескольких минут</p>
              </div>
              {tickets.length > 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('list')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}
                >
                  <Ticket size={12} />
                  Мои тикеты ({tickets.length})
                </motion.button>
              )}
            </div>

            <p className="text-sm font-semibold mb-3" style={{ color: secondaryText }}>Выберите тему обращения</p>

            <div className="space-y-2 mb-4">
              {Object.entries(FLOWS).map(([key, flow]) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setFlowKey(key); setStepIdx(0); setAnswers({}); setView('flow'); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{flow.icon}</span>
                    <span className="text-sm font-medium" style={{ color: primaryText }}>{flow.label}</span>
                  </div>
                  <ChevronRight size={16} color={secondaryText} />
                </motion.button>
              ))}
            </div>

            <div className="mt-2">
              <p className="text-xs mb-2" style={{ color: secondaryText }}>Или напишите свой вопрос:</p>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Опишите вашу проблему..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none"
                style={{ background: inputBg, color: primaryText, border: `1px solid ${inputBorder}` }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setFlowKey(null); setView('final'); }}
                disabled={!customText.trim()}
                className="w-full mt-2 py-3.5 rounded-2xl font-semibold text-sm"
                style={{
                  background: customText.trim() ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(44,44,46,0.8)'),
                  color: customText.trim() ? 'white' : secondaryText,
                }}
              >
                Отправить вопрос
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* FLOW */}
        {view === 'flow' && currentFlow && (
          <motion.div key={`flow-${stepIdx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={springConfig}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { if (stepIdx === 0) setView('main'); else setStepIdx(stepIdx - 1); }}>
                <ChevronLeft size={20} color="#0A84FF" />
              </button>
              <div>
                <div className="text-lg font-bold" style={{ color: primaryText }}>{currentFlow.label}</div>
                {currentFlow.steps.length > 0 && (
                  <div className="text-xs" style={{ color: secondaryText }}>Шаг {stepIdx + 1} из {currentFlow.steps.length}</div>
                )}
              </div>
            </div>

            {currentStep && (
              <>
                <p className="text-base font-semibold mb-4" style={{ color: primaryText }}>{currentStep.question}</p>
                <div className="space-y-2">
                  {currentStep.options.map(opt => (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOption(opt)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left"
                      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                    >
                      <span className="text-sm" style={{ color: primaryText }}>{opt}</span>
                      <ChevronRight size={15} color={secondaryText} />
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* FINAL */}
        {view === 'final' && (
          <motion.div key="final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={springConfig}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { if (flowKey && currentFlow?.steps.length) setView('flow'); else setView('main'); }}>
                <ChevronLeft size={20} color="#0A84FF" />
              </button>
              <div className="text-lg font-bold" style={{ color: primaryText }}>Подтверждение</div>
            </div>

            <div className="p-4 rounded-2xl mb-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <p className="text-xs font-semibold mb-2" style={{ color: secondaryText }}>Тема: {currentFlow?.label || 'Свободный вопрос'}</p>
              {Object.entries(answers).map(([k, v]) => (
                <div key={k} className="text-sm py-1" style={{ color: primaryText }}>• {v}</div>
              ))}
              {customText && <div className="text-sm py-1" style={{ color: primaryText }}>• {customText}</div>}
            </div>

            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Добавьте дополнительные детали (необязательно)..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none mb-3"
              style={{ background: inputBg, color: primaryText, border: `1px solid ${inputBorder}` }}
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateTicket}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.35)' }}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send size={16} />Создать тикет</>}
            </motion.button>
          </motion.div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={springConfig}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('main')}>
                <ChevronLeft size={20} color="#0A84FF" />
              </button>
              <div className="text-lg font-bold" style={{ color: primaryText }}>Мои обращения</div>
            </div>

            <div className="space-y-2 mb-4">
              {tickets.length === 0 && (
                <p className="text-center text-sm py-8" style={{ color: secondaryText }}>Нет обращений</p>
              )}
              {tickets.map(t => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openTicket(t)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono" style={{ color: secondaryText }}>#{t.id?.slice(-6)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusColor(t.status)}22`, color: statusColor(t.status) }}>{statusLabel(t.status)}</span>
                      {t.rating > 0 && <span className="text-xs ml-auto" style={{ color: '#FFD60A' }}>{'★'.repeat(t.rating)}</span>}
                    </div>
                    <div className="text-sm font-medium" style={{ color: primaryText }}>{t.subject}</div>
                    <div className="text-xs mt-0.5" style={{ color: secondaryText }}>{categoryLabel(t.category)}</div>
                  </div>
                  <ChevronRight size={15} color={secondaryText} />
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setView('main')}
              className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}
            >
              <Plus size={16} />
              Новое обращение
            </motion.button>
          </motion.div>
        )}

        {/* CHAT */}
        {view === 'chat' && activeTicket && (
          <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={springConfig}>
            <TicketChat
              ticket={activeTicket}
              onBack={() => setView('list')}
              onSend={handleSendMessage}
              onRate={handleRateTicket}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}