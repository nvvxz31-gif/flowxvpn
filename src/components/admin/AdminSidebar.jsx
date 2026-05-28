import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, BarChart3, CreditCard, Server,
  Users2, Settings, HardDrive, ClipboardList, Zap, LogOut, Headphones
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { id: 'users', icon: Users, label: 'Пользователи' },
  { id: 'analytics', icon: BarChart3, label: 'Аналитика' },
  { id: 'plans', icon: CreditCard, label: 'Тарифы' },
  { id: 'nodes', icon: Server, label: 'Ноды' },
  { id: 'partners', icon: Users2, label: 'Партнёры' },
  { id: 'support', icon: Headphones, label: 'Поддержка', badge: true },
  { id: 'backups', icon: HardDrive, label: 'Бэкапы' },
  { id: 'audit', icon: ClipboardList, label: 'Аудит-лог' },
  { id: 'settings', icon: Settings, label: 'Настройки' },
];

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

export default function AdminSidebar({ active, onNavigate }) {
  return (
    <div
      className="w-56 h-screen flex flex-col py-6 flex-shrink-0"
      style={{
        background: 'rgba(18,18,20,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
          >
            <Zap size={16} color="white" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: '#F5F5F7' }}>FlowX Admin</div>
            <div className="text-xs" style={{ color: '#98989D' }}>Панель управления</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.97 }}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.15))' }}
                  transition={springConfig}
                />
              )}
              <Icon
                size={16}
                style={{ color: isActive ? '#0A84FF' : '#98989D', position: 'relative', zIndex: 1 }}
              />
              <span
                className="text-sm font-medium relative z-10"
                style={{ color: isActive ? '#F5F5F7' : '#98989D' }}
              >
                {item.label}
              </span>
              {item.badge && (
                <div
                  className="ml-auto w-2 h-2 rounded-full relative z-10"
                  style={{ background: '#FF453A' }}
                />
              )}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 mt-4">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ color: '#98989D' }}
        >
          <LogOut size={16} />
          <span className="text-sm">Выйти</span>
        </button>
      </div>
    </div>
  );
}