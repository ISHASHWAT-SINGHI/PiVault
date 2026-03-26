import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, Home, Heart, Zap, ShieldCheck, HardDrive, HelpCircle, LogOut, Menu, X, Search, Bell, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/authContext';

interface JWTPayload {
  id?: string;
  username?: string;
  role?: string;
  [key: string]: any;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  
  const [user, setUser] = useState<JWTPayload | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error("Invalid token format");
      }
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Favorite Folders', href: '/favourites', icon: Heart },
    { name: 'Quick Actions', href: '/actions', icon: Zap },
    ...(user?.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin', icon: ShieldCheck }] : []),
    { name: 'Hardware', href: '/hardware', icon: HardDrive },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold">CloudNest</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex flex-col w-full md:w-64 bg-white border-r border-slate-200 fixed md:sticky top-0 h-screen z-40 transition-all`}>
        <div className="hidden md:flex items-center gap-3 p-6 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg">CloudNest</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 md:mt-0 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/settings" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden">
                {user?.username ? (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">{user?.username || 'User'}</span>
                <span className="text-xs text-slate-500 capitalize">{user?.role || 'Member'}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
