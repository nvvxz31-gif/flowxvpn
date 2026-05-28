import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from '@/components/ErrorBoundary';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AppProvider } from '@/lib/AppContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import MiniApp from './pages/MiniApp';
import AdminPanel from './pages/AdminPanel';
import UserPanel from './pages/UserPanel';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0D0D0F' }}>
        <div className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
          style={{ borderTopColor: '#0A84FF', borderRightColor: '#5E5CE6' }}
        />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<MiniApp />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/my" element={<UserPanel />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ErrorBoundary>
                <AuthenticatedApp />
              </ErrorBoundary>
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App