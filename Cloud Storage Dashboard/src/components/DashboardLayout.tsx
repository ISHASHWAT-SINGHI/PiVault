import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Home, Heart, Zap, HelpCircle, Settings, LogOut, Bell, Search, User as UserIcon, ShieldCheck, HardDrive, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentUser: any;
  onLogout: () => void;
}

export default function DashboardLayout({ children, currentUser, onLogout }: DashboardLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Recent Files', href: '/dashboard', icon: Home },
    { name: 'Favorite Folders', href: '/favorites', icon: Heart },
    { name: 'Quick Actions', href: '/actions', icon: Zap },
    ...(currentUser?.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin', icon: ShieldCheck }] : []),
    { name: 'Hardware', href: '/hardware', icon: HardDrive },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white">CloudNest</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-700 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:flex lg:flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 transition-colors">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-slate-900 dark:text-white">CloudNest</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <aside className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 p-6 pt-20">
          <nav className="space-y-1 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-3 mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </aside>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="sticky top-0 lg:top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-4 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by anything..."
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500"
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm">{currentUser?.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{currentUser?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}