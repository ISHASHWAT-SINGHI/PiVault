import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { toast } from 'sonner';
import api from '../services/api';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSuccess: () => void;
}

export default function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
    storageQuotaGB: 5
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        username: user.username || '',
        password: '', // Kept empty unless changing
        email: user.email || '',
        role: user.role || 'user',
        storageQuotaGB: user.storageQuotaGB || 5
      });
    }
  }, [user, open]);

  if (!open || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error('Username and Email are required');
      return;
    }

    setLoading(true);
    try {
      // Create payload. Strip password if empty so we don't accidentally reset to empty string
      const payload: any = { ...formData };
      if (!payload.password) delete payload.password;

      await api.put(`/admin/users/${user.id}`, payload);
      toast.success('User updated structurally in Samba configuration');
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to modify user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Modify Global User</h2>
            <p className="text-sm text-amber-600 font-medium mt-1">Warning: Changing usernames migrates physical directories.</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-username">System Username (ID)</Label>
            <Input
              id="edit-username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-slate-50 border-slate-200"
              disabled={loading || user.username === 'pi3s'}
            />
            {user.username === 'pi3s' && <p className="text-xs text-red-500">Root admin username cannot be renamed.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email Address</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-50 border-slate-200"
              disabled={loading}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label htmlFor="edit-password" className="text-emerald-700">Overwrite OS Password</Label>
            <div className="relative">
              <Input
                id="edit-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-slate-50 border-slate-200 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Useful if user lost their root access token.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Global Role</Label>
              <select
                id="edit-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={loading || user.username === 'pi3s'}
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quota">Storage Quota (GB)</Label>
              <Input
                id="edit-quota"
                type="number"
                min="1"
                max="1000"
                value={formData.storageQuotaGB}
                onChange={(e) => setFormData({ ...formData, storageQuotaGB: parseInt(e.target.value) || 5 })}
                className="bg-slate-50 border-slate-200"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white border-0">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Applying Patches...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
