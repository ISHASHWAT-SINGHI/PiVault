import { useState, useEffect } from 'react';
import { Heart, Folder, Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

interface FolderItem {
  id: string;
  name: string;
  size: string;
  items: number;
  lastModified: string;
}

export default function FavoriteFolders() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get('/storage/list');
        const allItems = response.data?.data || [];
        
        // Match old logic: filter directories, take 5
        const folderItems: FolderItem[] = allItems
          .filter((item: any) => item.isDir)
          .slice(0, 5)
          .map((f: any) => ({
            id: f.id || Math.random().toString(),
            name: f.name || 'Unnamed Folder',
            size: f.size || '0 KB',
            items: f.itemCount || 0,
            lastModified: f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : 'N/A'
          }));
          
        setFolders(folderItems);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch folders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500">Loading favorite folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-red-50 p-6 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-600 font-medium">Failed to load favorite folders</p>
        <p className="text-slate-500 text-sm mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white border-0">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Favorite Folders</h1>
        <p className="text-slate-600">Quick access to your frequently used folders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-md">
                <Folder className="w-7 h-7 text-white" />
              </div>
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>

            <h3 className="text-slate-900 font-semibold text-lg mb-4 truncate">{folder.name}</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Size</span>
                <span className="text-blue-600 font-medium">{folder.size}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Items</span>
                <span className="text-slate-900 font-medium">{folder.items}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Modified</span>
                <span className="text-slate-900 font-medium">{folder.lastModified}</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white border-0">
              Open Folder
            </Button>
          </div>
        ))}
      </div>

      {folders.length === 0 && !isLoading && !error && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 font-medium mb-2 text-lg">No favorite folders found</h3>
          <p className="text-slate-500">Star some folders in the dashboard to see them here.</p>
        </div>
      )}
    </div>
  );
}
