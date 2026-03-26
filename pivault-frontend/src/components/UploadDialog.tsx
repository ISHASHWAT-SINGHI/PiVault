import { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { toast } from 'sonner';
import api from '../services/api';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath?: string;
  onSuccess?: () => void;
}

export default function UploadDialog({ open, onOpenChange, currentPath = '', onSuccess }: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!open) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);
    
    let successCount = 0;
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('currentPath', currentPath);
        formData.append('file', file);

        try {
            await api.post('/storage/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent: any) => {
                    const totalPercent = Math.round(((i + (progressEvent.loaded / (progressEvent.total || 1))) / selectedFiles.length) * 100);
                    setProgress(totalPercent);
                }
            });
            successCount++;
        } catch (error) {
            toast.error(`Failed to upload ${file.name}`);
        }
    }
    
    if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
        if (onSuccess) onSuccess();
        setSelectedFiles([]);
        onOpenChange(false);
    }
    setUploading(false);
    setProgress(100);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload Files</h2>
            <p className="text-sm text-slate-500 mt-1">Upload files to <span className="font-semibold">{currentPath ? `/${currentPath}` : '/Root Directory'}</span></p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50">
            <input type="file" id="file-upload" multiple onChange={handleFileSelect} className="hidden" disabled={uploading} />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-slate-900 font-medium mb-1">Click to browse or drag and drop</p>
              <p className="text-slate-500 text-sm">Any files allowed</p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Selected Files ({selectedFiles.length})</label>
              <div className="max-h-48 overflow-y-auto space-y-2 p-1">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <File className="w-8 h-8 text-slate-400 mr-3 p-1.5 bg-slate-100 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                    </div>
                    <button onClick={() => setSelectedFiles(files => files.filter((_, idx) => idx !== i))} disabled={uploading} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">Uploading...</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || uploading} className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Processing...' : 'Upload Files'}
          </Button>
        </div>
      </div>
    </div>
  );
}
