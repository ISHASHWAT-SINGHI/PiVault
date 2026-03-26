import { useState, useEffect } from 'react';
import { Image as ImageIcon, FileText, Film, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import StorageCard from '../components/StorageCard';
import FileCard from '../components/FileCard';
import UploadDialog from '../components/UploadDialog';
import api from '../services/api';

interface SystemStatus {
  storage: {
    images: { used: number, total: number, count: number };
    docs: { used: number, total: number, count: number };
    media: { used: number, total: number, count: number };
  };
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  isDir: boolean;
  size?: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchData = async () => {
      try {
        const [statusRes, filesRes] = await Promise.all([
          api.get('/dashboard/status'),
          api.get('/storage/list').catch(() => ({ data: [] })) // Mock empty if files API fails but dashboard succeeds
        ]);

        setSystemStatus(statusRes.data?.data || statusRes.data || statusRes);
        setFiles(filesRes.data?.data || []);
      } catch (err: any) {
        setError("Could not load dashboard data. Please make sure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
        <h3 className="font-semibold text-lg mb-2">Connection Error</h3>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white">Retry</Button>
      </div>
    );
  }

  const storageData = [
    { type: 'Images', icon: ImageIcon, used: systemStatus?.storage?.images?.used || 0, total: systemStatus?.storage?.images?.total || 1, files: systemStatus?.storage?.images?.count || 0, color: 'from-orange-400 to-rose-400' },
    { type: 'Documents', icon: FileText, used: systemStatus?.storage?.docs?.used || 0, total: systemStatus?.storage?.docs?.total || 1, files: systemStatus?.storage?.docs?.count || 0, color: 'from-emerald-400 to-teal-500' },
    { type: 'Media', icon: Film, used: systemStatus?.storage?.media?.used || 0, total: systemStatus?.storage?.media?.total || 1, files: systemStatus?.storage?.media?.count || 0, color: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Storage Overview</h1>
        <Button onClick={() => setIsUploadOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Upload className="w-4 h-4 mr-2" /> Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageData.map(stat => (
          <StorageCard key={stat.type} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Files</h2>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.filter(file => !file.isDir).slice(0, 10).map(file => (
              <FileCard key={file.id} file={file} onClick={() => window.location.href = '/files'} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No files found</h3>
            <p className="text-slate-500 text-sm">Upload some files to see them here.</p>
          </div>
        )}
      </div>

      <UploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onSuccess={fetchData} currentPath="" />
    </div>
  );
}
