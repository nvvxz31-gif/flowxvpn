import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

export default function UserPanelLogin({ onLogin }) {
  const [mode, setMode] = useState('telegram'); // telegram | email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0D0F' }}>
      {/* Background orb */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(10,132,255,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
            animate={{ boxShadow: ['0 0 20px rgba(10,132,255,0.3)', '0 0 40px rgba(10,132,255,0.5)', '0 0 20px rgba(10,132,255,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={28} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>FlowX VPN</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Личный кабинет · my.flowx.com</p>
        </div>

        {/* Mode tabs */}
        <div
          className="flex p-1 rounded-2xl mb-6"
          style={{ background: 'rgba(28,28,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { id: 'telegram', label: '✈️ Telegram' },
            { id: 'email', label: '✉️ Email' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: mode === tab.id ? 'rgba(10,132,255,0.2)' : 'transparent',
                color: mode === tab.id ? '#0A84FF' : '#98989D',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === 'telegram' ? (
          <motion.div
            key="telegram"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div
              className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(10,132,255,0.06)', border: '1px solid rgba(10,132,255,0.2)' }}
            >
              <div className="text-4xl mb-3">✈️</div>
              <p className="text-sm mb-1" style={{ color: '#F5F5F7', fontWeight: 600 }}>Войти через Telegram</p>
              <p className="text-xs" style={{ color: '#98989D' }}>Безопасная авторизация без пароля</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogin}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}
            >
              Войти через Telegram
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={e => { e.preventDefault(); onLogin(); }}
            className="space-y-3"
          >
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" color="#98989D" />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none"
                style={{ background: 'rgba(28,28,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" color="#98989D" />
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPwd ? 'text' : 'password'}
                placeholder="Пароль"
                className="w-full pl-11 pr-12 py-4 rounded-2xl text-sm outline-none"
                style={{ background: 'rgba(28,28,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F5F7' }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPwd ? <EyeOff size={16} color="#98989D" /> : <Eye size={16} color="#98989D" />}
              </button>
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}
            >
              Войти
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}