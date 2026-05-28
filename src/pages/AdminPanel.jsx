import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BarChart3, CreditCard, Server,
  Users2, Settings, HardDrive, ClipboardList, Zap, LogOut, Headphones, Menu, X, ShieldOff
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminNodes from '../components/admin/AdminNodes';
import AdminPlans from '../components/admin/AdminPlans';
import AdminPartners from '../components/admin/AdminPartners';
import AdminBackups from '../components/admin/AdminBackups';
import AdminAuditLog from '../components/admin/AdminAuditLog';
import AdminSettings from '../components/admin/AdminSettings';
import AdminSupport from '../components/admin/AdminSupport';
import { useAuth } from '@/lib/AuthContext';

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

export default function AdminPanel() {
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0F' }}>
        <div className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
          style={{ borderTopColor: '#0A84FF', borderRightColor: '#5E5CE6' }} />
      </div>
    );
  }

  // ✅ SECURITY: реальная проверка роли через Base44 Auth, не useState
  // Неаутентифицированный или не-admin видит стандартный экран логина Base44
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0D0F' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,69,58,0.15)', border: '1px solid rgba(255,69,58,0.3)' }}>
            <ShieldOff size={28} color="#FF453A" />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: '#F5F5F7' }}>Доступ запрещён</h1>
          <p className="text-sm mb-6" style={{ color: '#98989D' }}>
            {!isAuthenticated ? 'Необходима авторизация для доступа к панели управления.' : 'У вашего аккаунта нет прав администратора.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const sections = {
    dashboard: <AdminDashboard />,
    users: <AdminUsers />,
    analytics: <AdminAnalytics />,
    plans: <AdminPlans />,
    nodes: <AdminNodes />,
    partners: <AdminPartners />,
    support: <AdminSupport />,
    backups: <AdminBackups />,
    audit: <AdminAuditLog />,
    settings: <AdminSettings />,
  };

  const activeItem = navItems.find(n => n.id === activeSection);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0D0D0F' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar active={activeSection} onNavigate={setActiveSection} />
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col py-6 md:hidden"
              style={{ background: 'rgba(18,18,20,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-5 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
                    <Zap size={16} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: '#F5F5F7' }}>FlowX Admin</div>
                    <div className="text-xs" style={{ color: '#98989D' }}>Панель управления</div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#98989D' }}>
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                      className="relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left"
                      style={{ background: isActive ? 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.15))' : 'transparent' }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#0A84FF' : '#98989D' }} />
                      <span className="text-sm font-medium" style={{ color: isActive ? '#F5F5F7' : '#98989D' }}>{item.label}</span>
                      {item.badge && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#FF453A' }} />}
                    </button>
                  );
                })}
              </nav>
              <div className="px-3">
                <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: '#98989D' }}>
                  <LogOut size={16} /><span className="text-sm">Выйти</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 md:hidden flex-shrink-0"
          style={{ background: 'rgba(18,18,20,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Menu size={18} color="#F5F5F7" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}>
              <Zap size={12} color="white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#F5F5F7' }}>
              {activeItem?.label || 'Admin'}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {sections[activeSection] || <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}