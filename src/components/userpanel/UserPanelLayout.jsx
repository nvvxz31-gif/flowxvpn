import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useApp } from '@/lib/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CreditCard, Users, User, QrCode, History, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import UserDashboard from './UserDashboard';
import UserSubscription from './UserSubscription';
import UserPaymentHistory from './UserPaymentHistory';
import UserConnect from './UserConnect';
import UserReferral from './UserReferral';
import UserProfile from './UserProfile';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Обзор' },
  { id: 'subscription', icon: CreditCard, label: 'Подписка' },
  { id: 'connect', icon: QrCode, label: 'Подключение' },
  { id: 'history', icon: History, label: 'Платежи' },
  { id: 'referral', icon: Users, label: 'Партнёры' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

const content = {
  dashboard: <UserDashboard />,
  subscription: <UserSubscription />,
  connect: <UserConnect />,
  history: <UserPaymentHistory />,
  referral: <UserReferral />,
  profile: <UserProfile />,
};

export default function UserPanelLayout() {
  const { logout } = useAuth();
  const { theme } = useApp();
  const isLight = theme === 'light';
  const [active, setActive] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeItem = navItems.find(n => n.id === active);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isLight ? '#F2F2F7' : '#0D0D0F' }}>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex w-56 h-screen flex-col py-6 flex-shrink-0"
        style={{ background: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(18,18,20,0.95)', borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
              <Zap size={16} color="white" />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: isLight ? '#1C1C1E' : '#F5F5F7' }}>FlowX VPN</div>
              <div className="text-xs" style={{ color: isLight ? '#636366' : '#98989D' }}>my.flowx.com</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActive(item.id)}
                whileTap={{ scale: 0.97 }}
                className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
              >
                {isActive && (
                  <motion.div layoutId="user-nav" className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.15))' }}
                    transition={springConfig}
                  />
                )}
                <Icon size={16} style={{ color: isActive ? '#0A84FF' : (isLight ? '#636366' : '#98989D'), position: 'relative', zIndex: 1 }} />
                <span className="text-sm font-medium relative z-10" style={{ color: isActive ? (isLight ? '#1C1C1E' : '#F5F5F7') : (isLight ? '#636366' : '#98989D') }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
        <div className="px-3">
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: isLight ? '#636366' : '#98989D' }}>
            <LogOut size={16} /><span className="text-sm">Выйти</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={springConfig}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col py-6 md:hidden"
              style={{ background: isLight ? 'rgba(255,255,255,0.99)' : 'rgba(18,18,20,0.98)', borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-5 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                    <Zap size={16} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: isLight ? '#1C1C1E' : '#F5F5F7' }}>FlowX VPN</div>
                    <div className="text-xs" style={{ color: isLight ? '#636366' : '#98989D' }}>my.flowx.com</div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#98989D' }}>
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left"
                      style={{ background: isActive ? 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.15))' : 'transparent' }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#0A84FF' : (isLight ? '#636366' : '#98989D') }} />
                      <span className="text-sm font-medium" style={{ color: isActive ? (isLight ? '#1C1C1E' : '#F5F5F7') : (isLight ? '#636366' : '#98989D') }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className="px-3">
                <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: isLight ? '#636366' : '#98989D' }}>
                  <LogOut size={16} /><span className="text-sm">Выйти</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 md:hidden flex-shrink-0"
          style={{ background: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(18,18,20,0.95)', borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)' }}
        >
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Menu size={18} color="#F5F5F7" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
              <Zap size={12} color="white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: isLight ? '#1C1C1E' : '#F5F5F7' }}>
              {activeItem?.label || 'FlowX VPN'}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#30D158' }} />
            <span className="text-xs" style={{ color: '#30D158' }}>Активна</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springConfig}
            >
              {content[active]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}