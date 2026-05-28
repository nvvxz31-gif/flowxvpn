import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Shield, FileText, RefreshCw, Info, Mail } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const sections = [
  {
    icon: Shield,
    title: 'Политика конфиденциальности',
    content: `FlowX VPN придерживается строгой политики no-log. Мы не собираем, не храним и не передаём данные о вашей интернет-активности.\n\nМы собираем только:\n• Email (опционально, для восстановления доступа)\n• Telegram ID (для авторизации)\n• Статистику использования трафика (без содержимого)\n\nМы никогда не передаём данные третьим лицам без вашего согласия или требования суда.\n\nОбновлено: 1 января 2026`,
  },
  {
    icon: FileText,
    title: 'Условия использования',
    content: `Использование FlowX VPN означает ваше согласие с настоящими условиями.\n\nЗапрещается использовать сервис для:\n• Незаконной деятельности\n• Рассылки спама\n• DDoS-атак\n• Распространения вредоносного ПО\n\nМы оставляем за собой право заблокировать аккаунт при нарушении правил без возврата средств.\n\nОбновлено: 1 января 2026`,
  },
  {
    icon: RefreshCw,
    title: 'Политика возврата',
    content: `Мы предлагаем возврат средств в течение 48 часов с момента первой оплаты, если сервис не работает по нашей вине.\n\nВозврат не производится при:\n• Нарушении правил использования\n• Технических проблемах на стороне клиента\n• Запросе после 48 часов\n\nДля запроса возврата обратитесь в поддержку.`,
  },
  {
    icon: Info,
    title: 'О компании',
    content: `FlowX VPN — премиальный VPN-сервис, специализирующийся на протоколе VLESS+Reality для максимальной анонимности и обхода блокировок.\n\nМы работаем с 2024 года и обслуживаем пользователей по всему миру.\n\nНаша миссия: сделать интернет свободным и доступным для всех.`,
  },
  {
    icon: Mail,
    title: 'Контакты',
    content: `По всем вопросам:\n\nTelegram поддержка: @flowxvpn_support\nEmail: support@flowx.com\nЮридические запросы: legal@flowx.com\n\nВремя ответа: до 24 часов в рабочие дни.`,
  },
];

export default function TabLegal() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <div className="px-4 pt-16 pb-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 tracking-tight"
        style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}
      >
        Юридическая информация
      </motion.h1>

      <div className="flex flex-col gap-2">
        {sections.map((section, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenSection(section)}
            className="flex items-center justify-between p-4 rounded-2xl text-left"
            style={{ background: 'rgba(28,28,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(10,132,255,0.12)' }}
              >
                <section.icon size={16} color="#0A84FF" />
              </div>
              <span className="text-sm font-medium" style={{ color: '#F5F5F7' }}>{section.title}</span>
            </div>
            <ChevronRight size={16} color="#98989D" />
          </motion.button>
        ))}
      </div>

      {/* Section detail modal */}
      <AnimatePresence>
        {openSection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setOpenSection(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={springConfig}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl"
              style={{ background: 'rgba(18,18,20,0.99)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh' }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h3 className="text-base font-bold" style={{ color: '#F5F5F7' }}>{openSection.title}</h3>
                <button
                  onClick={() => setOpenSection(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <X size={14} color="#98989D" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#98989D' }}>
                  {openSection.content}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}