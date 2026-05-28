import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Hash, Calendar, Bell, Globe, Shield, ExternalLink, FileText, RefreshCw, Info, Mail as MailIcon, ChevronRight, X } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const legalSections = [
  { icon: Shield, key: 'privacyPolicy', label: 'Политика конфиденциальности', content: `FlowX VPN придерживается строгой политики no-log. Мы не собираем, не храним и не передаём данные о вашей интернет-активности.\n\nМы собираем только:\n• Email (опционально)\n• Telegram ID (для авторизации)\n• Статистику трафика (без содержимого)\n\nОбновлено: 1 января 2026` },
  { icon: FileText, key: 'termsOfService', label: 'Условия использования', content: `Запрещается использовать сервис для незаконной деятельности, рассылки спама, DDoS-атак или распространения вредоносного ПО.\n\nОбновлено: 1 января 2026` },
  { icon: RefreshCw, key: 'refundPolicy', label: 'Политика возврата', content: `Возврат средств в течение 48 часов с момента первой оплаты, если сервис не работает по нашей вине.` },
  { icon: Info, key: 'about', label: 'О сервисе', content: `FlowX VPN — премиальный VPN-сервис на протоколе VLESS+Reality. Работаем с 2024 года.` },
  { icon: MailIcon, key: 'contacts', label: 'Контакты', content: `Telegram: @flowxvpn_support\nEmail: support@flowx.com\nВремя ответа: до 24 часов.` },
];

function Toggle({ enabled, onChange }) {
  return (
    <motion.button onClick={() => onChange(!enabled)} whileTap={{ scale: 0.95 }}
      className="relative w-12 h-6 rounded-full flex-shrink-0"
      style={{ background: enabled ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : 'rgba(255,255,255,0.1)' }}>
      <motion.div className="absolute top-0.5 bottom-0.5 aspect-square rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 'calc(100% - 22px)' : '2px' }}
        transition={springConfig} />
    </motion.button>
  );
}

export default function UserProfile() {
  const [openLegal, setOpenLegal] = useState(null);
  const [notifications, setNotifications] = useState({ traffic: true, expiry: true, inactivity: false });
  const rowBorder = 'rgba(255,255,255,0.05)';

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Профиль</h1>
        <p className="text-sm" style={{ color: '#98989D' }}>Настройки аккаунта</p>
      </div>

      {/* User info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springConfig}
        className="glass-card p-5 rounded-3xl mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.3), rgba(94,92,230,0.3))', border: '1px solid rgba(10,132,255,0.3)' }}>
            🦊
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: '#F5F5F7' }}>@username</div>
            <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
              style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF' }}>
              Пробный период · 5 дней
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { IconComp: Hash, label: 'ID пользователя', value: '1 284 930' },
            { IconComp: User, label: 'Telegram', value: '@username' },
            { IconComp: Mail, label: 'Email', value: 'user@example.com', editable: true },
            { IconComp: Calendar, label: 'Зарегистрирован', value: '14 мая 2026' },
          ].map(({ IconComp, label, value, editable }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: rowBorder }}>
              <div className="flex items-center gap-3">
                <IconComp size={14} color="#98989D" />
                <span className="text-sm" style={{ color: '#98989D' }}>{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{value}</span>
                {editable && <span className="text-xs" style={{ color: '#0A84FF' }}>Изменить</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.05 }}
        className="glass-card p-5 rounded-3xl mb-4">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#F5F5F7' }}>Подписка</h3>
        <div className="flex items-center justify-between py-2 border-b mb-3" style={{ borderColor: rowBorder }}>
          <span className="text-sm" style={{ color: '#98989D' }}>Тариф</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#0A84FF' }} />
            <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>Пробный период</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm" style={{ color: '#98989D' }}>Истекает</span>
          <span className="text-sm font-medium font-mono" style={{ color: '#F5F5F7' }}>19 мая 2026</span>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.1 }}
        className="glass-card p-5 rounded-3xl mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={14} color="#98989D" />
          <h3 className="text-sm font-semibold" style={{ color: '#F5F5F7' }}>Уведомления</h3>
        </div>
        {[
          { key: 'traffic', label: 'Конец трафика', desc: 'Когда трафик заканчивается' },
          { key: 'expiry', label: 'Истечение подписки', desc: 'За 3 дня до окончания' },
          { key: 'inactivity', label: 'Неактивность', desc: 'Если не подключался 7 дней' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: rowBorder }}>
            <div>
              <div className="text-sm" style={{ color: '#F5F5F7' }}>{label}</div>
              <div className="text-xs" style={{ color: '#98989D' }}>{desc}</div>
            </div>
            <Toggle enabled={notifications[key]} onChange={v => setNotifications(n => ({ ...n, [key]: v }))} />
          </div>
        ))}
      </motion.div>

      {/* Web cabinet */}
      <motion.a initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        href="https://my.flowx.com" target="_blank" rel="noreferrer"
        className="flex items-center justify-between p-4 rounded-2xl mb-4"
        style={{ background: 'rgba(28,28,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <Globe size={16} color="#0A84FF" />
          <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>Открыть веб-кабинет</span>
        </div>
        <ExternalLink size={14} color="#98989D" />
      </motion.a>

      {/* Legal */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#98989D' }}>Правовая информация</h3>
        <div className="flex flex-col gap-2">
          {legalSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => setOpenLegal(section)}
                className="flex items-center justify-between p-4 rounded-2xl text-left"
                style={{ background: 'rgba(28,28,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.1)' }}>
                    <Icon size={15} color="#0A84FF" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{section.label}</span>
                </div>
                <ChevronRight size={15} color="#98989D" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Legal modal */}
      <AnimatePresence>
        {openLegal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setOpenLegal(null)} />
            <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={springConfig}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl"
              style={{ background: 'rgba(18,18,20,0.99)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh' }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h3 className="text-base font-bold" style={{ color: '#F5F5F7' }}>{openLegal.label}</h3>
                <button onClick={() => setOpenLegal(null)} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <X size={14} color="#98989D" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#98989D' }}>{openLegal.content}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}