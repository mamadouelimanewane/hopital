import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarteInteractive from './pages/CarteInteractive';
import Visiteurs from './pages/Visiteurs';
import Itineraires from './pages/Itineraires';
import Parking from './pages/Parking';
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
        element={isAuthenticated ? <PrivateRoute><Layout /></PrivateRoute> : <Landing />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="carte" element={<CarteInteractive />} />
        <Route path="visiteurs" element={<Visiteurs />} />
        <Route path="itineraires" element={<Itineraires />} />
        <Route path="parking" element={<Parking />} />
        <Route path="settings" element={<Parametres />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
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
