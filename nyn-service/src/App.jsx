import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewConsignment from './pages/NewConsignment';
import History from './pages/History';
import Search from './pages/Search';
import ViewConsignment from './pages/ViewConsignment';
import Settings from './pages/Settings';

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-content">{children}</div>
    </div>
  );
}

function Root() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><AppLayout><NewConsignment /></AppLayout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><AppLayout><Search /></AppLayout></ProtectedRoute>} />
          <Route path="/consignment/:id" element={<ProtectedRoute><AppLayout><ViewConsignment /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
