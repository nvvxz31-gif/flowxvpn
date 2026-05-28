import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CreditCard, Users, User, HeadphonesIcon } from 'lucide-react';
import TabConnections from './TabConnections';
import TabPlans from './TabPlans';
import TabReferral from './TabReferral';
import TabProfile from './TabProfile';
import TabSupport from './TabSupport';
import BalanceCapsule from './BalanceCapsule';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useApp, t } from '@/lib/AppContext';

const springConfig = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 };

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('connections');
  const { theme, lang } = useApp();

  const isLight = theme === 'light';

  const tabs = [
    { id: 'support', icon: HeadphonesIcon, label: t(lang, 'help') },
    { id: 'plans', icon: CreditCard, label: t(lang, 'plans') },
    { id: 'connections', icon: Zap, label: t(lang, 'vpn'), center: true },
    { id: 'referral', icon: Users, label: t(lang, 'partners') },
    { id: 'profile', icon: User, label: t(lang, 'profile') },
  ];

  const tabComponents = {
    connections: <TabConnections />,
    plans: <TabPlans />,
    referral: <TabReferral />,
    profile: <TabProfile />,
    support: <TabSupport />,
  };

  const bgRoot = isLight ? '#F2F2F7' : '#0D0D0F';
  const navBg = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(28,28,30,0.85)';
  const navBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)';

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: bgRoot }}>
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/3 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(10,132,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(94,92,230,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      {/* Balance capsule */}
      <div className="absolute top-safe-top top-4 right-4 z-50" style={{ top: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <BalanceCapsule />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <ErrorBoundary
              fallback={(err) => (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="text-3xl mb-3">⚠️</div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#F5F5F7' }}>Раздел не загрузился</p>
                  <p className="text-xs mb-2" style={{ color: '#98989D' }}>Попробуйте переключить вкладку и вернуться</p>
                  {err && <p className="text-xs font-mono px-3 py-2 rounded-xl mt-1" style={{ background: 'rgba(255,69,58,0.1)', color: '#FF453A', maxWidth: '90%', wordBreak: 'break-all' }}>{err.message}</p>}
                </div>
              )}
            >
              {tabComponents[activeTab]}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div
        className="fixed left-4 right-4 z-40"
        style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
      >
        <div
          className="flex items-center justify-around px-2 py-2 rounded-4xl"
          style={{
            background: navBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${navBorder}`,
            boxShadow: isLight ? '0 8px 32px rgba(0,0,0,0.12)' : '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isVPN = tab.center;
            const inactiveColor = isLight ? '#636366' : '#98989D';
            const activeTextColor = isLight ? '#1C1C1E' : '#F5F5F7';

            if (isVPN) {
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center justify-center -mt-5"
                  whileTap={{ scale: 0.9 }}
                  transition={springConfig}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)',
                      boxShadow: isActive
                        ? '0 0 0 4px rgba(10,132,255,0.25), 0 6px 24px rgba(10,132,255,0.45)'
                        : '0 4px 16px rgba(10,132,255,0.35)',
                    }}
                    animate={{ scale: isActive ? 1.07 : 1 }}
                    transition={springConfig}
                  >
                    <Icon size={24} color="white" />
                  </motion.div>
                  <span
                    className="text-xs font-semibold mt-1"
                    style={{ color: isActive ? '#0A84FF' : inactiveColor, fontSize: '9px' }}
                  >
                    {tab.label}
                  </span>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-3xl min-w-0"
                whileTap={{ scale: 0.9 }}
                transition={springConfig}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.2))',
                      border: '1px solid rgba(10,132,255,0.25)',
                    }}
                    transition={springConfig}
                  />
                )}
                <div className="relative">
                  <Icon size={18} style={{ color: isActive ? '#0A84FF' : inactiveColor }} />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: isActive ? activeTextColor : inactiveColor, fontSize: '9px' }}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}