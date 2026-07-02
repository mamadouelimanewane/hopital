import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Commandes from './pages/Commandes';
import Fournisseurs from './pages/Fournisseurs';
import Blanchisserie from './pages/Blanchisserie';
import Restauration from './pages/Restauration';
import Livraisons from './pages/Livraisons';
import Parametres from './pages/Parametres';
import Landing from './pages/Landing';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="commandes" element={<Commandes />} />
        <Route path="fournisseurs" element={<Fournisseurs />} />
        <Route path="blanchisserie" element={<Blanchisserie />} />
        <Route path="restauration" element={<Restauration />} />
        <Route path="livraisons" element={<Livraisons />} />
        <Route path="settings" element={<Parametres />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
