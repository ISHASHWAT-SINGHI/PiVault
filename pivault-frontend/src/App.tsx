import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FavoriteFolders from './pages/FavoriteFolders';
import AdminPanel from './pages/AdminPanel';
import HardwareLifecycle from './pages/HardwareLifecycle';
import QuickActions from './pages/QuickActions';
import FileManager from './pages/FileManager';
import HelpSupport from './pages/HelpSupport';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={<ProtectedRoute />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="files" element={<FileManager />} />
            <Route path="favourites" element={<FavoriteFolders />} />
            <Route path="actions" element={<QuickActions />} />
            <Route path="camera" element={<div className="p-8 text-slate-500 flex justify-center items-center flex-col min-h-[50vh]"><h1 className="text-3xl font-bold mb-4 text-slate-800">Camera Roll</h1><p>Photo gallery sync coming in future update.</p></div>} />
            <Route path="sharing" element={<div className="p-8 text-slate-500 flex justify-center items-center flex-col min-h-[50vh]"><h1 className="text-3xl font-bold mb-4 text-slate-800">Shared With Me</h1><p>Public sharing links coming in future update.</p></div>} />
            <Route path="hardware" element={<HardwareLifecycle />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
