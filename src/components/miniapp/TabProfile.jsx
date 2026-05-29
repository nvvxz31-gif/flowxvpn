import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { User, Mail, Hash, Calendar, Bell, Globe, Shield, ExternalLink, FileText, RefreshCw, Info, Mail as MailIcon, ChevronRight, X, Sun, Languages } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useApp, t } from '@/lib/AppContext';

const legalSectionsRu = [
  { icon: Shield, key: 'privacyPolicy', content: `FlowX VPN придерживается строгой политики no-log. Мы не собираем, не храним и не передаём данные о вашей интернет-активности.\n\nМы собираем только:\n• Email (опционально)\n• Telegram ID (для авторизации)\n• Статистику трафика (без содержимого)\n\nОбновлено: 1 января 2026` },
  { icon: FileText, key: 'termsOfService', content: `Запрещается использовать сервис для незаконной деятельности, рассылки спама, DDoS-атак или распространения вредоносного ПО.\n\nОбновлено: 1 января 2026` },
  { icon: RefreshCw, key: 'refundPolicy', content: `Возврат средств в течение 48 часов с момента первой оплаты, если сервис не работает по нашей вине.` },
  { icon: Info, key: 'about', content: `FlowX VPN — премиальный VPN-сервис на протоколе VLESS+Reality. Работаем с 2024 года.` },
  { icon: MailIcon, key: 'contacts', content: `Telegram: @flowxvpn_support\nEmail: support@flowx.com\nВремя ответа: до 24 часов.` },
];

const legalSectionsEn = [
  { icon: Shield, key: 'privacyPolicy', content: `FlowX VPN maintains a strict no-log policy. We do not collect, store or share data about your internet activity.\n\nWe only collect:\n• Email (optional)\n• Telegram ID (for authorization)\n• Traffic statistics (no content)\n\nUpdated: January 1, 2026` },
  { icon: FileText, key: 'termsOfService', content: `It is prohibited to use the service for illegal activities, spamming, DDoS attacks or distributing malware.\n\nUpdated: January 1, 2026` },
  { icon: RefreshCw, key: 'refundPolicy', content: `Refunds within 48 hours of first payment if the service is not working due to our fault.` },
  { icon: Info, key: 'about', content: `FlowX VPN is a premium VPN service on the VLESS+Reality protocol. Operating since 2024.` },
  { icon: MailIcon, key: 'contacts', content: `Telegram: @flowxvpn_support\nEmail: support@flowx.com\nResponse time: up to 24 hours.` },
];

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

function Toggle({ enabled, onChange, isLight }) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className="relative w-12 h-6 rounded-full flex-shrink-0"
      style={{ background: enabled ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)' }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 bottom-0.5 aspect-square rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 'calc(100% - 22px)' : '2px' }}
        transition={springConfig}
      />
    </motion.button>
  );
}

export default function TabProfile() {
  const { theme, lang, toggleTheme, toggleLang } = useApp();
  const { user } = useAuth();
  const { data: sub } = useSubscription();
  const isLight = theme === 'light';
  const [openLegal, setOpenLegal] = useState(null);
  const [notifications, setNotifications] = useState({
    traffic: true,
    expiry: true,
    inactivity: false,
  });

  const legalSections = lang === 'en' ? legalSectionsEn : legalSectionsRu;

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.9)' : undefined;
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : undefined;
  const rowBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
  const itemBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(28,28,30,0.6)';
  const itemBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

  return (
    <div className="px-4 pt-16 pb-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 tracking-tight"
        style={{ color: primaryText, letterSpacing: '-0.02em' }}
      >
        {t(lang, 'profile')}
      </motion.h1>

      {/* User info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig}
        className="glass-card p-5 rounded-3xl mb-4"
        style={isLight ? { background: cardBg, border: cardBorder } : undefined}
      >
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.3), rgba(94,92,230,0.3))', border: '1px solid rgba(10,132,255,0.3)' }}
          >
            🦊
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: primaryText }}>{user?.full_name || user?.email || '@user'}</div>
            <div
              className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
              style={{ background: sub?.status === 'active' ? 'rgba(48,209,88,0.15)' : 'rgba(10,132,255,0.15)', color: sub?.status === 'active' ? '#30D158' : '#0A84FF' }}
              >
              {sub?.plan_name || t(lang, 'trialPeriod')}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { IconComp: Hash, label: t(lang, 'userId'), value: user?.id?.slice(0, 8) || '—' },
            { IconComp: User, label: t(lang, 'telegram'), value: user?.full_name || '—' },
            { IconComp: Mail, label: t(lang, 'email'), value: user?.email || '—', editable: false },
            { IconComp: Calendar, label: t(lang, 'registered'), value: user?.created_date ? new Date(user.created_date).toLocaleDateString(lang === 'en' ? 'en' : 'ru', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
          ].map(({ IconComp, label, value, editable }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: rowBorder }}>
              <div className="flex items-center gap-3">
                <IconComp size={14} color={secondaryText} />
                <span className="text-sm" style={{ color: secondaryText }}>{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: primaryText }}>{value}</span>
                {editable && (
                  <span className="text-xs" style={{ color: '#0A84FF' }}>{t(lang, 'edit')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springConfig, delay: 0.1 }}
        className="glass-card p-5 rounded-3xl mb-4"
        style={isLight ? { background: cardBg, border: cardBorder } : undefined}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: primaryText }}>{t(lang, 'subscription')}</h3>
        <div className="flex items-center justify-between py-2 border-b mb-3" style={{ borderColor: rowBorder }}>
          <span className="text-sm" style={{ color: secondaryText }}>{t(lang, 'plan')}</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#0A84FF' }} />
            <span className="text-sm font-medium" style={{ color: primaryText }}>{sub?.plan_name || t(lang, 'trialPeriod')}</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm" style={{ color: secondaryText }}>{t(lang, 'expires')}</span>
          <span className="text-sm font-medium font-mono" style={{ color: primaryText }}>{sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString(lang === 'en' ? 'en' : 'ru', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springConfig, delay: 0.13 }}
        className="glass-card p-5 rounded-3xl mb-4"
        style={isLight ? { background: cardBg, border: cardBorder } : undefined}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sun size={14} color={secondaryText} />
          <h3 className="text-sm font-semibold" style={{ color: primaryText }}>{t(lang, 'appearance')}</h3>
        </div>
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: rowBorder }}>
          <div>
            <div className="text-sm" style={{ color: primaryText }}>{t(lang, 'lightTheme')}</div>
          </div>
          <Toggle enabled={isLight} onChange={toggleTheme} isLight={isLight} />
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Languages size={14} color={secondaryText} />
            <div>
              <div className="text-sm" style={{ color: primaryText }}>{t(lang, 'language')}</div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(10,132,255,0.15)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.25)' }}
          >
            {lang === 'ru' ? 'RU → EN' : 'EN → RU'}
          </motion.button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springConfig, delay: 0.15 }}
        className="glass-card p-5 rounded-3xl mb-4"
        style={isLight ? { background: cardBg, border: cardBorder } : undefined}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={14} color={secondaryText} />
          <h3 className="text-sm font-semibold" style={{ color: primaryText }}>{t(lang, 'notifications')}</h3>
        </div>
        {[
          { key: 'traffic', label: t(lang, 'trafficEnd'), desc: t(lang, 'trafficEndDesc') },
          { key: 'expiry', label: t(lang, 'subExpiry'), desc: t(lang, 'subExpiryDesc') },
          { key: 'inactivity', label: t(lang, 'inactivity'), desc: t(lang, 'inactivityDesc') },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: rowBorder }}>
            <div>
              <div className="text-sm" style={{ color: primaryText }}>{label}</div>
              <div className="text-xs" style={{ color: secondaryText }}>{desc}</div>
            </div>
            <Toggle enabled={notifications[key]} onChange={v => setNotifications(n => ({ ...n, [key]: v }))} isLight={isLight} />
          </div>
        ))}
      </motion.div>

      {/* Web cabinet button */}
      <motion.a
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        href="https://flowxvpn.nvvxz31.workers.dev/my"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between p-4 rounded-2xl mb-4"
        style={{ background: itemBg, border: `1px solid ${itemBorder}` }}
      >
        <div className="flex items-center gap-3">
          <Globe size={16} color="#0A84FF" />
          <span className="text-sm font-medium" style={{ color: primaryText }}>{t(lang, 'openWebCabinet')}</span>
        </div>
        <ExternalLink size={14} color={secondaryText} />
      </motion.a>

      {/* Legal section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: secondaryText }}>{t(lang, 'legalInfo')}</h3>
        <div className="flex flex-col gap-2">
          {legalSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenLegal(section)}
                className="flex items-center justify-between p-4 rounded-2xl text-left"
                style={{ background: itemBg, border: `1px solid ${itemBorder}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(10,132,255,0.1)' }}>
                    <Icon size={15} color="#0A84FF" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: primaryText }}>{t(lang, section.key)}</span>
                </div>
                <ChevronRight size={15} color={secondaryText} />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Legal modal */}
      <AnimatePresence>
        {openLegal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setOpenLegal(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={springConfig}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl"
              style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(18,18,20,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh' }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)' }}>
                <h3 className="text-base font-bold" style={{ color: primaryText }}>{t(lang, openLegal.key)}</h3>
                <button onClick={() => setOpenLegal(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                  <X size={14} color={secondaryText} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: secondaryText }}>{openLegal.content}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}