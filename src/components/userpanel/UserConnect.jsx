import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, X, QrCode } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const CONFIG_STRING = 'vless://uuid@server.flowx.com:443?type=tcp&security=reality&pbk=PUBLIC_KEY&fp=chrome&sni=cloudflare.com&sid=SHORT_ID&spx=%2F#FlowX-NL';

const appGuides = {
  Happ: {
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/47e2ae396_OIP.webp',
    downloadLinks: {
      'iPhone / iPad': 'https://apps.apple.com/app/happ-proxy-utility/id6504287215',
      Android: 'https://play.google.com/store/apps/details?id=com.happproxy.app',
      Windows: 'https://github.com/happproxy/happ/releases',
      macOS: 'https://apps.apple.com/app/happ-proxy-utility/id6504287215',
    },
    steps: [
      'Скачайте Happ для вашего устройства',
      'Откройте приложение и нажмите «+»',
      'Выберите «Импорт из буфера обмена»',
      'Скопируйте конфиг выше и вернитесь в Happ',
      'Конфиг добавится автоматически',
      'Нажмите на сервер и выберите «Подключить»',
      '✅ Готово! VPN активен',
    ],
  },
  V2Ray: {
    icon: 'https://media.base44.com/images/public/6a088498feb97a4eaded517d/163bafa00_image.png',
    downloadLinks: {
      'iPhone / iPad': 'https://apps.apple.com/app/v2box-v2ray-client/id6446814690',
      Android: 'https://play.google.com/store/apps/details?id=com.v2ray.ang',
      Windows: 'https://github.com/2dust/v2rayN/releases',
      macOS: 'https://github.com/Cenmrev/V2RayX/releases',
    },
    steps: [
      'Скачайте V2Ray / V2Box для вашего устройства',
      'Откройте приложение и нажмите «+»',
      'Выберите «Импорт из буфера обмена»',
      'Скопируйте конфиг выше и вернитесь в приложение',
      'Сервер появится в списке — выберите его',
      'Нажмите ▶ и разрешите запрос VPN',
      '✅ V2Ray активен!',
    ],
  },
};

const platforms = ['iPhone / iPad', 'Android', 'Windows', 'macOS'];

export default function UserConnect() {
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [copied, setCopied] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [activePlatform, setActivePlatform] = useState('iPhone / iPad');

  const primaryText = isLight ? '#1C1C1E' : '#F5F5F7';
  const secondaryText = isLight ? '#636366' : '#98989D';
  const cardBg = isLight ? 'rgba(255,255,255,0.95)' : '#18181B';
  const cardBorder = isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)';
  const configBg = isLight ? 'rgba(10,132,255,0.06)' : 'rgba(255,255,255,0.04)';
  const configBorder = isLight ? '1px solid rgba(10,132,255,0.15)' : '1px solid rgba(255,255,255,0.06)';
  const appBtnBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(44,44,46,0.6)';
  const appBtnBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)';
  const platformInactiveBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const platformInactiveBorder = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.06)';

  const handleCopy = () => {
    navigator.clipboard.writeText(CONFIG_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: primaryText, letterSpacing: '-0.02em' }}>Подключение</h1>
        <p className="text-sm" style={{ color: secondaryText }}>Ваш конфиг и инструкция по установке</p>
      </div>

      {/* Config string */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl mb-4" style={{ background: cardBg, border: cardBorder }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: primaryText }}>Конфигурация VLESS</h3>
        <div className="p-3 rounded-xl font-mono text-xs mb-3 break-all"
          style={{ background: configBg, color: '#0A84FF', border: configBorder }}>
          {CONFIG_STRING}
        </div>
        <button onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: copied ? 'rgba(48,209,88,0.15)' : 'rgba(10,132,255,0.12)', color: copied ? '#30D158' : '#0A84FF', border: `1px solid ${copied ? 'rgba(48,209,88,0.3)' : 'rgba(10,132,255,0.2)'}` }}>
          <Copy size={14} />
          {copied ? 'Скопировано!' : 'Скопировать конфиг'}
        </button>
      </motion.div>

      {/* QR code */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl mb-4" style={{ background: cardBg, border: cardBorder }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: primaryText }}>QR-код для подключения</h3>
        <div className="flex items-center justify-center py-6 rounded-2xl mb-3"
          style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)' }}>
          <div className="p-3 rounded-2xl" style={{ background: isLight ? '#0D0D0F' : '#FFFFFF' }}>
            <QrCode size={120} color={isLight ? '#FFFFFF' : '#0D0D0F'} />
          </div>
        </div>
        <p className="text-xs text-center" style={{ color: secondaryText }}>Отсканируйте QR-код в приложении Happ или V2Ray</p>
      </motion.div>

      {/* Platform selector */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl mb-4" style={{ background: cardBg, border: cardBorder }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: primaryText }}>Инструкция по установке</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {platforms.map(p => (
            <button key={p} onClick={() => setActivePlatform(p)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activePlatform === p ? 'rgba(10,132,255,0.2)' : platformInactiveBg,
                color: activePlatform === p ? '#0A84FF' : secondaryText,
                border: activePlatform === p ? '1px solid rgba(10,132,255,0.4)' : platformInactiveBorder,
              }}>
              {p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(appGuides).map(([name, guide]) => (
            <motion.button key={name} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveGuide({ name, guide, platform: activePlatform })}
              className="flex items-center gap-3 p-3 rounded-2xl text-left"
              style={{ background: appBtnBg, border: appBtnBorder }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: primaryText }}>{name}</div>
                <div className="text-xs" style={{ color: '#0A84FF' }}>Инструкция →</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Guide modal */}
      <AnimatePresence>
        {activeGuide && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setActiveGuide(null)} />
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={springConfig}
              className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl overflow-y-auto"
              style={{ background: isLight ? 'rgba(242,242,247,0.99)' : 'rgba(22,22,24,0.99)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', maxHeight: '85vh' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: primaryText }}>Настройка {activeGuide.name}</h3>
                  <p className="text-xs" style={{ color: secondaryText }}>{activeGuide.platform} · Пошаговая инструкция</p>
                </div>
                <button onClick={() => setActiveGuide(null)}><X size={20} color={secondaryText} /></button>
              </div>
              <div className="space-y-3">
                {activeGuide.guide.steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-3.5 rounded-2xl"
                    style={{ background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(44,44,46,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                      style={{ background: step.startsWith('✅') ? 'rgba(48,209,88,0.2)' : 'rgba(10,132,255,0.2)', color: step.startsWith('✅') ? '#30D158' : '#0A84FF' }}>
                      {step.startsWith('✅') ? '✓' : i + 1}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: primaryText }}>{step}</p>
                  </motion.div>
                ))}
              </div>
              <a href={activeGuide.guide.downloadLinks[activeGuide.platform]} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-5 py-3.5 rounded-2xl font-semibold"
                style={{ background: 'rgba(10,132,255,0.12)', border: '1px solid rgba(10,132,255,0.3)', color: '#0A84FF' }}>
                <Download size={16} /> Скачать {activeGuide.name}
              </a>
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