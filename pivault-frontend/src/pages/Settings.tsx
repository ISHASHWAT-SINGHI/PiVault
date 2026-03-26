import { useState } from 'react';
import { Moon, Sun, User, Bell, Shield, HardDrive } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { useAuth } from '../context/authContext';
import api from '../services/api';

export default function Settings() {
  const { token } = useAuth();
  let user: any = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {}
  }
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [uploadNotifs, setUploadNotifs] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [storageAlerts, setStorageAlerts] = useState(true);

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new) {
      import('sonner').then(m => m.toast.error('Both password fields are required'));
      return;
    }
    setChangingPwd(true);
    try {
      const res = await api.put('/auth/password', { currentPassword: passwordForm.current, newPassword: passwordForm.new });
      import('sonner').then(m => m.toast.success(res.data.message || 'Password updated'));
      setPasswordForm({ current: '', new: '' });
    } catch (err: any) {
      import('sonner').then(m => m.toast.error(err.response?.data?.message || 'Failed to update password'));
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-slate-900 font-bold mb-8 text-xl">Profile Settings</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <Avatar className="w-24 h-24 shadow-md border-4 border-white">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-inner">
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="mb-3 border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto font-semibold">
              Change Avatar
            </Button>
            <p className="text-slate-500 text-sm font-medium">JPG, GIF or PNG. Max size 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold" htmlFor="name">Username</Label>
            <Input
              id="name"
              defaultValue={user?.username}
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. user@example.com"
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-slate-900 font-bold mb-6 text-xl">Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold" htmlFor="current-pw">Current Network Password</Label>
            <Input
              id="current-pw"
              type="password"
              placeholder="Required for verification"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="bg-slate-50 border-slate-200"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold" htmlFor="new-pw">New System Password</Label>
            <Input
              id="new-pw"
              type="password"
              placeholder="Will update your Samba drives too"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              className="bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handlePasswordChange} 
            disabled={changingPwd || !passwordForm.current || !passwordForm.new} 
            variant="outline" 
            className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            {changingPwd ? 'Updating Shell...' : 'Update Network Password'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-slate-900 font-bold mb-6 text-xl">Appearance</h2>
        
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${isDarkTheme ? 'bg-indigo-900' : 'bg-gradient-to-br from-blue-500 to-cyan-400'} flex items-center justify-center shadow-md transition-colors`}>
              {isDarkTheme ? <Moon className="w-6 h-6 text-indigo-300" /> : <Sun className="w-6 h-6 text-white" />}
            </div>
            <div>
              <p className="text-slate-900 font-bold mb-0.5">Theme</p>
              <p className="text-slate-500 text-sm font-medium">
                {isDarkTheme ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
          </div>
          <Switch checked={isDarkTheme} onCheckedChange={setIsDarkTheme} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-slate-900 font-bold mb-6 text-xl">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold mb-0.5">Upload Notifications</p>
                <p className="text-slate-500 text-sm font-medium">Get notified when uploads complete</p>
              </div>
            </div>
            <Switch checked={uploadNotifs} onCheckedChange={setUploadNotifs} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold mb-0.5">Security Alerts</p>
                <p className="text-slate-500 text-sm font-medium">Notify about login attempts</p>
              </div>
            </div>
            <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold mb-0.5">Storage Alerts</p>
                <p className="text-slate-500 text-sm font-medium">Alert when storage is low</p>
              </div>
            </div>
            <Switch checked={storageAlerts} onCheckedChange={setStorageAlerts} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-6 text-lg font-bold shadow-lg border-0">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
