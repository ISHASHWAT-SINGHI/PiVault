import { useState, useEffect } from 'react';
import { Image as ImageIcon, FileText, Film, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import StorageCard from '../components/StorageCard';
import UploadDialog from '../components/UploadDialog';
import FileManager from './FileManager';
import api from '../services/api';

interface SystemStatus {
  storage: {
    images: { used: number, total: number, count: number };
    docs: { used: number, total: number, count: number };
    media: { used: number, total: number, count: number };
  };
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchData = async () => {
      try {
        const [statusRes] = await Promise.all([
          api.get('/dashboard/status')
        ]);

        setSystemStatus(statusRes.data?.data || statusRes.data || statusRes);
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

      <div className="pt-4 border-t border-slate-200 mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">File Explorer</h2>
        <FileManager />
      </div>

      <UploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onSuccess={fetchData} currentPath="" />
    </div>
  );
}
