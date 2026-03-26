import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import HardwareLifecycle from './components/HardwareLifecycle';
import FavoriteFolders from './components/FavoriteFolders';
import QuickActions from './components/QuickActions';
import HelpSupport from './components/HelpSupport';
import Settings from './components/Settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" /> :
                <LoginPage onLogin={(user) => {
                  setIsAuthenticated(true);
                  setCurrentUser(user);
                }} />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <Dashboard currentUser={currentUser} />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/favorites"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <FavoriteFolders />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/actions"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <QuickActions />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/help"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <HelpSupport />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <Settings currentUser={currentUser} />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && currentUser?.role === 'admin' ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <AdminPanel />
                </DashboardLayout> :
                <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/hardware"
            element={
              isAuthenticated ?
                <DashboardLayout currentUser={currentUser} onLogout={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}>
                  <HardwareLifecycle />
                </DashboardLayout> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}