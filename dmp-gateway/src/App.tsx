import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DossiersPartages from './pages/DossiersPartages';
import Connecteurs from './pages/Connecteurs';
import JournalSynchro from './pages/JournalSynchro';
import Reseau from './pages/Reseau';
import Securite from './pages/Securite';
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
      <Route
        path="/"
        element={<PrivateRoute><Layout /></PrivateRoute>}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dossiers" element={<DossiersPartages />} />
        <Route path="connecteurs" element={<Connecteurs />} />
        <Route path="journal" element={<JournalSynchro />} />
        <Route path="reseau" element={<Reseau />} />
        <Route path="securite" element={<Securite />} />
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
