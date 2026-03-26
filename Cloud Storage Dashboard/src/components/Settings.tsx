import { Moon, Sun, User, Bell, Shield, HardDrive } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SettingsProps {
  currentUser: any;
}

export default function Settings({ currentUser }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-blue-600 dark:text-blue-400 mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-slate-900 dark:text-white mb-6">Profile Settings</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="mb-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
              Change Avatar
            </Button>
            <p className="text-slate-500 dark:text-slate-400 text-sm">JPG, GIF or PNG. Max size 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
            <Input
              id="name"
              defaultValue={currentUser?.name}
              className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={currentUser?.email}
              className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-slate-900 dark:text-white mb-6">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-white" />
              ) : (
                <Sun className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-slate-900 dark:text-white">Theme</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {theme === 'dark' ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-slate-900 dark:text-white mb-6">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-slate-900 dark:text-white">Upload Notifications</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Get notified when uploads complete</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-slate-900 dark:text-white">Security Alerts</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Notify about login attempts</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-slate-900 dark:text-white">Storage Alerts</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Alert when storage is low</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
