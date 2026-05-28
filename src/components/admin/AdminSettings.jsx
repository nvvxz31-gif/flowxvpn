import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

function SettingsRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: '#98989D' }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  const springConfig = { type: 'spring', stiffness: 300, damping: 30 };
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className="relative w-12 h-6 rounded-full flex-shrink-0"
      style={{ background: enabled ? 'linear-gradient(135deg, #0A84FF, #5E5CE6)' : 'rgba(255,255,255,0.1)' }}
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

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 rounded-xl text-sm outline-none w-32 md:w-48"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
    />
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    serviceName: 'FlowX VPN',
    trialDays: 7,
    trialGb: 15,
    notifyDaysBefore: 3,
    notifyTrafficGb: 5,
    notifyInactivityH: 24,
    telegramEnabled: true,
    lavaEnabled: false,
    cryptoEnabled: true,
  });

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Настройки</h1>
        <p className="text-sm" style={{ color: '#98989D' }}>Конфигурация сервиса и уведомлений</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#F5F5F7' }}>Основные</h3>
          <SettingsRow label="Название сервиса">
            <Input value={settings.serviceName} onChange={v => set('serviceName', v)} />
          </SettingsRow>
          <SettingsRow label="Длительность триала" desc="Дней бесплатного доступа">
            <Input value={settings.trialDays} onChange={v => set('trialDays', v)} type="number" />
          </SettingsRow>
          <SettingsRow label="Трафик на триале" desc="Гигабайт">
            <Input value={settings.trialGb} onChange={v => set('trialGb', v)} type="number" />
          </SettingsRow>
        </div>

        {/* Notifications */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#F5F5F7' }}>Уведомления</h3>
          <SettingsRow label="Предупреждение об истечении" desc="За сколько дней уведомлять">
            <Input value={settings.notifyDaysBefore} onChange={v => set('notifyDaysBefore', v)} type="number" />
          </SettingsRow>
          <SettingsRow label="Уведомление о трафике" desc="При остатке N ГБ">
            <Input value={settings.notifyTrafficGb} onChange={v => set('notifyTrafficGb', v)} type="number" />
          </SettingsRow>
          <SettingsRow label="Уведомление о неактивности" desc="Через N часов без подключения">
            <Input value={settings.notifyInactivityH} onChange={v => set('notifyInactivityH', v)} type="number" />
          </SettingsRow>
        </div>

        {/* Payment gateways */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#F5F5F7' }}>Платёжные шлюзы</h3>
          <SettingsRow label="Telegram Stars" desc="Встроенные платежи Telegram">
            <Toggle enabled={settings.telegramEnabled} onChange={v => set('telegramEnabled', v)} />
          </SettingsRow>
          <SettingsRow label="Lava / FreeKassa" desc="Карты и электронные кошельки">
            <Toggle enabled={settings.lavaEnabled} onChange={v => set('lavaEnabled', v)} />
          </SettingsRow>
          <SettingsRow label="Криптовалюта" desc="USDT, TON, BTC">
            <Toggle enabled={settings.cryptoEnabled} onChange={v => set('cryptoEnabled', v)} />
          </SettingsRow>
        </div>

        <motion.button
           whileTap={{ scale: 0.97 }}
           disabled
           className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white opacity-50 cursor-not-allowed"
           style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}
           title="⚠️ TODO: Реализовать сохранение настроек на сервер через backend функцию или Base44 SDK"
         >
           <Save size={16} />
           Сохранить настройки (отключено)
         </motion.button>
         <div className="text-xs mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,165,0,0.1)', color: '#FF9F0A', border: '1px solid rgba(255,165,0,0.2)' }}>
           ⚠️ TODO: Сохранение настроек в БД. Платёжные шлюзы управляются через UI, но не подключены к реальным интеграциям.
         </div>
      </div>
    </div>
  );
}