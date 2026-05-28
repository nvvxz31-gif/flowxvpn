import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('flowx_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('flowx_lang') || 'ru');

  useEffect(() => {
    localStorage.setItem('flowx_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('flowx_lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(l => l === 'ru' ? 'en' : 'ru');

  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

// Translation helper
export const T = {
  ru: {
    // TabProfile
    profile: 'Профиль',
    userId: 'ID пользователя',
    telegram: 'Telegram',
    email: 'Email',
    registered: 'Зарегистрирован',
    edit: 'Изменить',
    subscription: 'Подписка',
    plan: 'Тариф',
    trialPeriod: 'Пробный период',
    expires: 'Истекает',
    notifications: 'Уведомления',
    trafficEnd: 'Конец трафика',
    trafficEndDesc: 'Когда закончится лимит',
    subExpiry: 'Истечение подписки',
    subExpiryDesc: 'За 3 дня до конца',
    inactivity: 'Неактивность',
    inactivityDesc: 'Если не подключён 24ч',
    openWebCabinet: 'Открыть веб-кабинет',
    legalInfo: 'Юридическая информация',
    privacyPolicy: 'Политика конфиденциальности',
    termsOfService: 'Условия использования',
    refundPolicy: 'Политика возврата',
    about: 'О компании',
    contacts: 'Контакты',
    appearance: 'Оформление',
    lightTheme: 'Светлая тема',
    language: 'Язык интерфейса',
    languageValue: 'Русский',
    // Tabs
    help: 'Помощь',
    plans: 'Тарифы',
    vpn: 'VPN',
    partners: 'Партнёры',
    // TabConnections
    currentPlan: 'Текущий тариф',
    active: 'Активен',
    trial: 'Триал',
    inactive: 'Неактивен',
    trafficUsed: 'Использовано трафика',
    untilEnd: 'До конца подписки',
    days: 'дней',
    connectVpn: 'Подключить VPN',
    faq: 'Помощь',
    howToConnect: 'Как подключиться к VPN?',
    howToConnectA: 'Скачайте приложение Streisand или Hiddify для вашего устройства, скопируйте конфиг в разделе «Подключения» и вставьте его в приложение.',
    whySlowVpn: 'Почему VPN медленно работает?',
    whySlowVpnA: 'Попробуйте сменить сервер. Серверы с нагрузкой ниже 50% обычно обеспечивают лучшую скорость.',
    botBlocked: 'Что делать, если бот заблокирован?',
    botBlockedA: 'Зайдите на my.flowx.com через браузер. Там доступны все функции без Telegram.',
    noLogs: 'Логируете ли вы трафик?',
    noLogsA: 'Нет. Мы не сохраняем логи трафика, DNS-запросов или IP-адресов. Политика строгого no-log.',
    // TabPlans
    tariffs: 'Тарифы',
    choosePlan: 'Выберите подходящий план',
    trialCard: 'Пробный',
    tryFree: 'Попробовать бесплатно',
    chooseTariff: 'Выбрать тариф',
    // Support
    support: 'Поддержка',
    replyInMinutes: 'Мы ответим в течение нескольких минут',
    myTickets: 'Мои тикеты',
    chooseCategory: 'Выберите тему обращения',
    vpnProblem: 'Проблема с VPN / сервером',
    paymentProblem: 'Проблема с оплатой',
    accountQuestion: 'Вопрос по аккаунту',
    writeQuestion: 'Или напишите свой вопрос:',
    describeProblem: 'Опишите вашу проблему...',
    sendQuestion: 'Отправить вопрос',
    // Referral
    referral: 'Партнёрская программа',
    referralDesc: '25% с каждого платежа реферала',
  },
  en: {
    // TabProfile
    profile: 'Profile',
    userId: 'User ID',
    telegram: 'Telegram',
    email: 'Email',
    registered: 'Registered',
    edit: 'Edit',
    subscription: 'Subscription',
    plan: 'Plan',
    trialPeriod: 'Trial Period',
    expires: 'Expires',
    notifications: 'Notifications',
    trafficEnd: 'Traffic Limit',
    trafficEndDesc: 'When limit runs out',
    subExpiry: 'Subscription Expiry',
    subExpiryDesc: '3 days before end',
    inactivity: 'Inactivity',
    inactivityDesc: 'If not connected for 24h',
    openWebCabinet: 'Open Web Dashboard',
    legalInfo: 'Legal Information',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    refundPolicy: 'Refund Policy',
    about: 'About Us',
    contacts: 'Contacts',
    appearance: 'Appearance',
    lightTheme: 'Light Theme',
    language: 'Interface Language',
    languageValue: 'English',
    // Tabs
    help: 'Help',
    plans: 'Plans',
    vpn: 'VPN',
    partners: 'Partners',
    // TabConnections
    currentPlan: 'Current Plan',
    active: 'Active',
    trial: 'Trial',
    inactive: 'Inactive',
    trafficUsed: 'Traffic Used',
    untilEnd: 'Subscription ends in',
    days: 'days',
    connectVpn: 'Connect VPN',
    faq: 'Help',
    howToConnect: 'How to connect to VPN?',
    howToConnectA: 'Download Streisand or Hiddify for your device, copy the config from the Connections section and paste it into the app.',
    whySlowVpn: 'Why is VPN slow?',
    whySlowVpnA: 'Try switching servers. Servers with less than 50% load usually provide better speed.',
    botBlocked: 'What if the bot is blocked?',
    botBlockedA: 'Go to my.flowx.com via browser. All features are available there without Telegram.',
    noLogs: 'Do you log traffic?',
    noLogsA: 'No. We do not store traffic logs, DNS queries or IP addresses. Strict no-log policy.',
    // TabPlans
    tariffs: 'Plans',
    choosePlan: 'Choose your plan',
    trialCard: 'Trial',
    tryFree: 'Try for Free',
    chooseTariff: 'Select Plan',
    // Support
    support: 'Support',
    replyInMinutes: 'We reply within a few minutes',
    myTickets: 'My Tickets',
    chooseCategory: 'Select a topic',
    vpnProblem: 'VPN / Server Problem',
    paymentProblem: 'Payment Issue',
    accountQuestion: 'Account Question',
    writeQuestion: 'Or write your question:',
    describeProblem: 'Describe your issue...',
    sendQuestion: 'Send Question',
    // Referral
    referral: 'Referral Program',
    referralDesc: '25% from each referral payment',
  },
};

export function t(lang, key) {
  return T[lang]?.[key] || T['ru'][key] || key;
}