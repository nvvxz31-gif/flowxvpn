import React from 'react';
import UserPanelLayout from '../components/userpanel/UserPanelLayout';
import { useAuth } from '@/lib/AuthContext';

export default function UserPanel() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0F' }}>
        <div className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
          style={{ borderTopColor: '#0A84FF', borderRightColor: '#5E5CE6' }} />
      </div>
    );
  }

  // ✅ SECURITY: реальная проверка авторизации через Base44 Auth
  if (!isAuthenticated) {
    navigateToLogin();
    return null;
  }

  return <UserPanelLayout />;
}

// ⚠️ DELETED: UserPanelLogin фиктивная авторизация — удалён из импорта
// Вход осуществляется через встроенную Base44 систему