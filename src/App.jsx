import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from '@/components/ErrorBoundary';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { AppProvider } from '@/lib/AppContext';
import MiniApp from './pages/MiniApp';
import AdminPanel from './pages/AdminPanel';
import UserPanel from './pages/UserPanel';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <Routes>
                <Route path="/" element={<MiniApp />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/my/*" element={<UserPanel />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </QueryClientProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App