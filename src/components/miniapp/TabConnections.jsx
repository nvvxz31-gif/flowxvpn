import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, HelpCircle, ChevronDown, X, Download } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useSubscription } from '@/hooks/useSubscription';

const faq = [
  { q: 'Как подключиться к VPN?', a: 'Скачайте приложение Streisand или Hiddify для вашего устройства, скопируйте конфиг в разделе «Подключения» и вставьте его в приложение.' },
  { q: 'Почему VPN медленно работает?', a: 'Попробуйте сменить сервер. Серверы с нагрузкой ниже 50% обычно обеспечивают лучшую скорость.' },
  { q: 'Что делать, если бот заблокирован?', a: 'Зайдите на my.flowx.com через браузер. Там доступны все функции без Telegram.' },
  { q: 'Логируете ли вы трафик?', a: 'Нет. Мы не сохраняем логи трафика, DNS-запросов или IP-адресов. Политика строгого no-log.' },
];

const platforms = [
  { name: 'iOS', icon: '🍎', platform: 'iPhone / iPad' },
  { name: 'Android', icon: '🤖', platform: 'Android' },
  { name: 'Windows', icon: '🪟', platform: 'Windows' },
  { name: 'macOS', icon: '🖥️', platform: 'macOS' },
];

const appGuides = {
  Happ: {
    title: 'Happ',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/47e2ae396_OIP.webp',
    downloadLinks: {
      'iPhone / iPad': 'https://apps.apple.com/app/happ-proxy-utility/id6504287215',
      Android: 'https://play.google.com/store/apps/details?id=com.happproxy.app',
      Windows: 'https://github.com/happproxy/happ/releases',
      macOS: 'https://apps.apple.com/app/happ-proxy-utility/id6504287215',
    },
    steps: {
      'iPhone / iPad': ['Скачайте Happ из App Store','Откройте приложение и нажмите «+» в правом верхнем углу','Выберите «Импорт из буфера обмена»','Перейдите в раздел «Подключения» и скопируйте конфиг','Вернитесь в Happ — конфиг добавится автоматически','Нажмите на сервер и выберите «Подключить»','✅ Готово! VPN активен'],
      Android: ['Скачайте Happ из Google Play','Откройте приложение и нажмите «+» вверху','Выберите «Импорт из буфера обмена»','Скопируйте конфиг из раздела «Подключения»','Вернитесь в Happ — конфиг добавится автоматически','Нажмите на сервер и выберите «Подключить»','✅ Готово! VPN активен'],
      Windows: ['Скачайте Happ для Windows с официального сайта','Установите приложение и запустите','Нажмите «+» или «Добавить конфиг»','Скопируйте конфиг из раздела «Подключения»','Вставьте ссылку — конфиг появится в списке','Выберите сервер и нажмите «Подключить»','✅ Happ активен на Windows!'],
      macOS: ['Скачайте Happ из Mac App Store','Откройте приложение, нажмите «+»','Выберите «Импорт из буфера обмена»','Скопируйте конфиг из раздела «Подключения»','Конфиг добавится в список автоматически','Нажмите на сервер → «Подключить»','✅ Happ активен на macOS!'],
    },
  },
  V2Ray: {
    title: 'V2Ray',
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/163bafa00_image.png',
    downloadLinks: {
      'iPhone / iPad': 'https://apps.apple.com/app/v2box-v2ray-client/id6446814690',
      Android: 'https://play.google.com/store/apps/details?id=com.v2ray.ang',
      Windows: 'https://github.com/2dust/v2rayN/releases',
      macOS: 'https://github.com/Cenmrev/V2RayX/releases',
    },
    steps: {
      'iPhone / iPad': ['Скачайте V2Box из App Store','Откройте приложение и нажмите «+»','Выберите «Импорт из буфера обмена»','Скопируйте конфиг из раздела «Подключения»','Сервер появится в списке — нажмите на него','Нажмите ▶ для подключения и разрешите VPN','✅ V2Box активен!'],
      Android: ['Скачайте V2RayNG из Google Play','Откройте приложение и нажмите «+»','Выберите «Импорт config из буфера»','Скопируйте конфиг из раздела «Подключения»','Сервер добавится в список — выберите его','Нажмите ▶ и разрешите запрос VPN-соединения','✅ V2RayNG активен!'],
      Windows: ['Скачайте V2RayN с GitHub или официального сайта','Распакуйте архив и запустите v2rayN.exe','Нажмите «Серверы» → «Добавить сервер Vmess/Vless»','Скопируйте конфиг из раздела «Подключения»','Вставьте ссылку через «Импорт из буфера»','Кликните правой кнопкой на иконку в трее → «Включить»','✅ V2RayN активен!'],
      macOS: ['Скачайте V2RayXS или V2Box для macOS','Откройте приложение и перейдите в «Серверы»','Нажмите «+» → «Добавить из буфера»','Скопируйте конфиг из раздела «Подключения»','Сервер появится в списке — выберите его','Нажмите «Подключить» и разрешите VPN','✅ V2Ray активен на macOS!'],
    },
  },
};

const springConfig = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 };

export default function TabConnections() {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const { data: sub } = useSubscription();

  const [openFaq, setOpenFaq] = useState(null);
  const [activePlatform, setActivePlatform] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [vpnCopied, setVpnCopied] = useState(false);

  const status = sub?.status || 'trial';
  const usedGb = sub?.traffic_used_gb || 0;
  const totalGb = sub?.traffic_total_gb || 50;
  const usedPercent = totalGb > 0 ? Math.min((usedGb / totalGb) * 100, 100) : 0;
  const expiresAt = sub?.expires_at ? new Date(sub.expires_at) : null;
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - new Date()) / 86400000)) : 0;
  const subTotalDays = status === 'trial' ? 7 : 30;
  const daysPercent = subTotalDays > 0 ? Math.min((daysLeft / subTotalDays) * 100, 100) : 0;

  // Theme-aware colors
  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(28,28,30,0.6)';
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.08)';
  const trackBg = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const circleTrack = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const platformBtnBg = isLight ? 'rgba(255,255,255,0.95)' : undefined;

  const handleCopyConfig = () => {
    if (sub?.vpn_config) {
      navigator.clipboard.writeText(sub.vpn_config);
      setVpnCopied(true);
      setTimeout(() => setVpnCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 pt-16 pb-4">
      {/* Trial timer */}
      {(status === 'trial' || daysLeft <= 3) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center justify-center gap-2">
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} className="text-xs font-medium" style={{ color: '#0A84FF' }}>⏱</motion.span>
          <span className="text-sm" style={{ color: secondaryText }}>
            {status === 'trial' ? 'Триал: осталось' : 'Подписка истекает через'}{' '}
            <span className="font-mono font-bold" style={{ color: primaryText }}>{daysLeft}</span>
            {' '}дней
          </span>
        </motion.div>
      )}

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springConfig}
        className="p-6 rounded-3xl mb-4"
        style={{ background: cardBg, border: cardBorder, backdropFilter: isLight ? 'none' : 'blur(20px)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: secondaryText }}>Текущий тариф</div>
            <div className="text-xl font-bold" style={{ color: primaryText }}>
              {sub?.plan_name || (status === 'trial' ? 'Пробный период' : 'FlowX Pro')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: status === 'active' ? '#30D158' : status === 'trial' ? '#0A84FF' : secondaryText }}
              animate={{ opacity: status !== 'expired' && status !== 'banned' ? [0.6, 1, 0.6] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium" style={{ color: status === 'active' ? '#30D158' : status === 'trial' ? '#0A84FF' : secondaryText }}>
              {status === 'active' ? 'Активен' : status === 'trial' ? 'Триал' : status === 'banned' ? 'Заблокирован' : 'Истёк'}
            </span>
          </div>
        </div>

        {/* Traffic */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative w-20 h-20">
            <svg className="absolute inset-0" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke={circleTrack} strokeWidth="4" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke="url(#trafficGrad)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - usedPercent / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
              />
              <defs>
                <linearGradient id="trafficGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0A84FF" /><stop offset="100%" stopColor="#5E5CE6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold font-mono" style={{ color: primaryText }}>{Math.round(usedPercent)}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs mb-1" style={{ color: secondaryText }}>Использовано трафика</div>
            <div className="text-lg font-bold font-mono" style={{ color: primaryText }}>
              {usedGb} <span style={{ color: secondaryText, fontWeight: 400 }}>/ {totalGb} ГБ</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #0A84FF, #5E5CE6)' }}
                initial={{ width: 0 }} animate={{ width: `${usedPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }} />
            </div>
          </div>
        </div>

        {/* Days bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: secondaryText }}>До конца подписки</span>
            <span className="font-medium" style={{ color: primaryText }}>{daysLeft} дней</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: trackBg }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #0A84FF, #5E5CE6)' }}
              initial={{ width: 0 }} animate={{ width: `${daysPercent}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }} />
          </div>
        </div>

        {/* VPN Config */}
        {sub?.vpn_config && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
            <div className="text-xs mb-2" style={{ color: secondaryText }}>VPN конфигурация</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-xl font-mono text-xs truncate"
                style={{ background: isLight ? 'rgba(10,132,255,0.06)' : 'rgba(255,255,255,0.04)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}>
                {sub.vpn_config}
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopyConfig}
                className="px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0"
                style={{ background: vpnCopied ? 'rgba(48,209,88,0.15)' : 'rgba(10,132,255,0.12)', color: vpnCopied ? '#30D158' : '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}>
                {vpnCopied ? '✓ Скопировано' : 'Копировать'}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Connect button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.3 }} className="mt-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.35)' }}
        >
          <Zap size={18} /> Подключить VPN
        </motion.button>
      </motion.div>

      {/* Help section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.35 }} className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={14} color={secondaryText} />
          <span className="text-sm font-semibold" style={{ color: primaryText }}>Помощь с настройкой</span>
        </div>

        {/* Platforms */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => setActivePlatform(p.platform)}
              className="p-3 rounded-2xl text-center"
              style={{
                background: platformBtnBg || cardBg,
                border: activePlatform === p.platform ? '1px solid rgba(10,132,255,0.4)' : cardBorder,
                backdropFilter: isLight ? 'none' : 'blur(20px)',
              }}
            >
              <div className="text-xl mb-1">{p.icon}</div>
              <div className="text-xs font-medium" style={{ color: primaryText }}>{p.name}</div>
              <div className="text-xs mt-0.5" style={{ color: secondaryText, fontSize: '9px' }}>Happ · V2Ray</div>
            </button>
          ))}
        </div>

        {/* App picker */}
        <AnimatePresence>
          {activePlatform && (
            <motion.div key={activePlatform} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="mb-3 p-3 rounded-2xl"
              style={{ background: cardBg, border: cardBorder, backdropFilter: isLight ? 'none' : 'blur(20px)' }}
            >
              <p className="text-xs mb-2" style={{ color: secondaryText }}>Выберите приложение для <span style={{ color: primaryText }}>{activePlatform}</span></p>
              <div className="grid grid-cols-2 gap-2">
                {['Happ', 'V2Ray'].map(appName => {
                  const g = appGuides[appName];
                  return (
                    <motion.button key={appName} whileTap={{ scale: 0.96 }}
                      onClick={() => { setActiveGuide({ title: g.title, icon: g.icon, steps: g.steps[activePlatform] || Object.values(g.steps)[0], downloadUrl: g.downloadLinks?.[activePlatform] }); setActivePlatform(null); }}
                      className="flex items-center justify-center px-3 py-2.5 rounded-2xl"
                      style={{ background: isLight ? 'rgba(10,132,255,0.08)' : 'rgba(44,44,46,0.6)', border: isLight ? '1px solid rgba(10,132,255,0.2)' : '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="text-center">
                        <div className="text-sm font-semibold" style={{ color: primaryText }}>{appName}</div>
                        <div className="text-xs" style={{ color: '#0A84FF', fontSize: '9px' }}>Инструкция →</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ */}
        <div className="flex flex-col gap-2 mb-3">
          {faq.map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder, backdropFilter: isLight ? 'none' : 'blur(20px)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3.5 text-left">
                <span className="text-sm font-medium pr-3" style={{ color: primaryText }}>{item.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={springConfig} className="flex-shrink-0">
                  <ChevronDown size={15} color={secondaryText} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={springConfig} className="overflow-hidden">
                    <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: secondaryText }}>{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* App Guide Modal */}
      <AnimatePresence>
        {activeGuide && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setActiveGuide(null)} />
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={springConfig}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl overflow-y-auto"
              style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', maxHeight: '85vh' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: primaryText }}>Настройка {activeGuide.title}</h3>
                  <p className="text-xs" style={{ color: secondaryText }}>Пошаговая инструкция</p>
                </div>
                <button onClick={() => setActiveGuide(null)}><X size={20} color={secondaryText} /></button>
              </div>
              <div className="space-y-3">
                {activeGuide.steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3.5 rounded-2xl"
                    style={{ background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(44,44,46,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                      style={{ background: step.startsWith('✅') ? 'rgba(48,209,88,0.2)' : 'rgba(10,132,255,0.2)', color: step.startsWith('✅') ? '#30D158' : '#0A84FF' }}>
                      {step.startsWith('✅') ? '✓' : i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: primaryText }}>{step}</p>
                  </motion.div>
                ))}
              </div>
              {activeGuide.downloadUrl && (
                <a href={activeGuide.downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-5 py-3.5 rounded-2xl font-semibold"
                  style={{ background: 'rgba(10,132,255,0.12)', border: '1px solid rgba(10,132,255,0.3)', color: '#0A84FF' }}>
                  <Download size={16} /> Скачать {activeGuide.title}
                </a>
              )}
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setActiveGuide(null)}
                className="w-full mt-3 py-4 rounded-2xl font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                Понятно, спасибо!
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}