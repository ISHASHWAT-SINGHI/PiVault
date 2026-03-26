import { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { toast } from 'sonner';
import api from '../services/api';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath?: string;
  onSuccess?: () => void;
}

export default function CreateFolderDialog({ open, onOpenChange, currentPath = '', onSuccess }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    setLoading(true);
    try {
      await api.post('/storage/create-folder', { folderName, currentPath });
      toast.success(`Folder "${folderName}" created successfully!`);
      setFolderName('');
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Folder</h2>
            <p className="text-sm text-slate-500 mt-1">Create a new folder to organize your files</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Folder Name</label>
            <Input
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-200 font-mono">
              {currentPath ? `/${currentPath}` : '/Root Directory'}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0">
            <FolderPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </div>
    </div>
  );
}
