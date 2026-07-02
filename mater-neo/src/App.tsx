import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Grossesses from './pages/Grossesses';
import Partogramme from './pages/Partogramme';
import Accouchements from './pages/Accouchements';
import Neonatologie from './pages/Neonatologie';
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
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route
        path="/"
        element={<PrivateRoute><Layout /></PrivateRoute>}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="grossesses" element={<Grossesses />} />
        <Route path="partogramme" element={<Partogramme />} />
        <Route path="accouchements" element={<Accouchements />} />
        <Route path="neonatologie" element={<Neonatologie />} />
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
