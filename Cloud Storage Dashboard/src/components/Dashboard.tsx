import { useState, useEffect } from 'react';
import { Upload, Image, FileText, Film, Filter, ArrowUpDown, Grid, List, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import StorageCard from './StorageCard';
import FileCard from './FileCard';
import FolderList from './FolderList';
import UpgradeCard from './UpgradeCard';
import UploadDialog from './UploadDialog';
import { api } from '../utils/api';

interface StorageStats {
  used: number;
  total: number;
  count: number;
}

interface SystemStatus {
  storage: {
    images: StorageStats;
    docs: StorageStats;
    media: StorageStats;
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

export default function Dashboard({ currentUser }: DashboardProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, filesRes] = await Promise.all([
          api.get('/dashboard/status'),
          api.get('/files')
        ]);

        setSystemStatus(statusRes.data || statusRes);

        const allItems = filesRes.data || [];
        setFiles(allItems.filter((i: any) => !i.isDir));
        setFolders(allItems.filter((i: any) => i.isDir));

        if (allItems.length > 0 && !selectedFile) {
          setSelectedFile(allItems.find((i: any) => !i.isDir) || allItems[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Map API data to storageData format
  const dynamicStorageData = [
    { type: 'Images', icon: Image, used: systemStatus?.storage?.images?.used || 0, total: systemStatus?.storage?.images?.total || 1, files: systemStatus?.storage?.images?.count || 0, color: 'from-red-500 to-orange-400' },
    { type: 'Documents', icon: FileText, used: systemStatus?.storage?.docs?.used || 0, total: systemStatus?.storage?.docs?.total || 1, files: systemStatus?.storage?.docs?.count || 0, color: 'from-green-500 to-emerald-400' },
    { type: 'Media', icon: Film, used: systemStatus?.storage?.media?.used || 0, total: systemStatus?.storage?.media?.total || 1, files: systemStatus?.storage?.media?.count || 0, color: 'from-blue-500 to-cyan-400' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-blue-600 dark:text-blue-400">Cloud Storage Dashboard</h1>
        <Button
          onClick={() => setShowUploadDialog(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white gap-2 w-full sm:w-auto shadow-lg shadow-blue-500/30"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* Welcome Section + Storage Cards */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Updating status...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-50/50 dark:bg-red-900/50 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-red-100 dark:border-red-900/50">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-slate-900 dark:text-white font-semibold">Connection Error</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-[200px]">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1762341111756-caf184156fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMG9mZmljZXxlbnwxfHx8fDE3NjMzNjY4NTl8MA&ixlib=rb-4.1.0&q=80&w=400"}
              alt="User"
              className="w-20 h-20 rounded-2xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-slate-600 dark:text-slate-400">Welcome!</h3>
                <div className={`w-2 h-2 ${systemStatus ? 'bg-green-500' : 'bg-slate-400'} rounded-full animate-pulse`}></div>
              </div>
              <p className="text-blue-600 dark:text-blue-400 mb-2 truncate max-w-[120px]">back, {currentUser?.name || currentUser?.username}</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">System: {systemStatus ? 'Online' : 'Loading...'}</p>
            </div>
          </div>

          {/* Storage Cards */}
          {dynamicStorageData.map((storage) => (
            <StorageCard key={storage.type} {...storage} />
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-slate-900 dark:text-white">Recent Files</h2>
          <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            View All →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {files.length > 0 ? files.map((file) => (
            <FileCard
              key={file.id}
              file={{
                ...file,
                thumbnail: `https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=400&fit=crop`, // Default placeholder for now
                collaborators: []
              }}
              isSelected={selectedFile?.id === file.id}
              onClick={() => setSelectedFile(file)}
            />
          )) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>No files found in storage</p>
            </div>
          )}
        </div>
      </div>

      {/* Folder View */}
      <div>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-slate-900 dark:text-white">Folder View</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:white hover:bg-slate-100 dark:hover:bg-slate-800">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:white hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowUpDown className="w-5 h-5" />
            </Button>
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <FolderList folders={folders.length > 0 ? folders.map(f => ({ ...f, date: new Date(f.updatedAt).toLocaleDateString() })) : [DEFAULT_FOLDER]} viewMode={viewMode} />
      </div>

      {/* Upgrade Card */}
      <UpgradeCard />

      {/* Upload Dialog */}
      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
    </div>
  );
}