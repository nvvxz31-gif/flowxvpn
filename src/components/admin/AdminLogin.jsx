import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Shield, Eye, EyeOff } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

export default function AdminLogin({ onLogin }) {
  const [step, setStep] = useState('credentials'); // credentials | totp
  const [showPwd, setShowPwd] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');

  const handleCredentials = (e) => {
    e.preventDefault();
    if (login && password) setStep('totp');
  };

  const handleTOTP = (e) => {
    e.preventDefault();
    if (totp.length === 6) onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0D0F' }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #0A84FF 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
            <Shield size={28} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>FlowX Admin</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Панель управления</p>
        </div>

        {step === 'credentials' ? (
          <motion.form
            key="credentials"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleCredentials}
            className="space-y-4"
          >
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" color="#98989D" />
              <input
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="Логин"
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none"
                style={{
                  background: 'rgba(28,28,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F5F5F7',
                }}
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
                style={{
                  background: 'rgba(28,28,30,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F5F5F7',
                }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPwd ? <EyeOff size={16} color="#98989D" /> : <Eye size={16} color="#98989D" />}
              </button>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}
            >
              Продолжить
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            key="totp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleTOTP}
            className="space-y-4"
          >
            <div
              className="p-4 rounded-2xl text-center mb-2"
              style={{ background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.2)' }}
            >
              <div className="text-2xl mb-1">🔐</div>
              <p className="text-sm" style={{ color: '#F5F5F7' }}>Двухфакторная аутентификация</p>
              <p className="text-xs mt-1" style={{ color: '#98989D' }}>Введите код из приложения-аутентификатора</p>
            </div>
            <input
              value={totp}
              onChange={e => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000 000"
              className="w-full text-center text-2xl font-mono tracking-widest py-4 rounded-2xl outline-none"
              style={{
                background: 'rgba(28,28,30,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F5F5F7',
                letterSpacing: '0.2em',
              }}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', boxShadow: '0 4px 20px rgba(10,132,255,0.3)' }}
            >
              Войти
            </motion.button>
            <button type="button" onClick={() => setStep('credentials')} className="w-full text-sm text-center" style={{ color: '#98989D' }}>
              ← Назад
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}