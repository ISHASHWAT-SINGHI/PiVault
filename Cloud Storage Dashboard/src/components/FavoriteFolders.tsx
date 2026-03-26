import { useState, useEffect } from 'react';
import { Heart, Folder, Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../utils/api';

export default function FavoriteFolders() {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get('/files');
        const allItems = response.data || response;
        // Filter for folders and take the first few
        const folderItems = allItems
          .filter((item: any) => item.type === 'directory')
          .slice(0, 5)
          .map((f: any) => ({
            id: f.id || Math.random().toString(),
            name: f.name,
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
        <p className="text-slate-500">Loading folders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-500 font-medium">Failed to load favorite folders</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-blue-600 dark:text-blue-400 mb-2">Favorite Folders</h1>
          <p className="text-slate-600 dark:text-slate-400">Quick access to your folders</p>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {folders.map((folder: any) => (
          <div
            key={folder.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all group shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Folder className="w-7 h-7 text-white" />
              </div>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>

            <h3 className="text-slate-900 dark:text-white mb-2 truncate">{folder.name}</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Size</span>
                <span className="text-blue-600 dark:text-blue-400">{folder.size}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Items</span>
                <span className="text-slate-900 dark:text-white">{folder.items}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Modified</span>
                <span className="text-slate-900 dark:text-white">{folder.lastModified}</span>
              </div>
            </div>

            <Button className="w-full mt-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium">
              Open Folder
            </Button>
          </div>
        ))}
      </div>

      {/* Empty State (if no favorites) */}
      {folders.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-slate-900 dark:text-white mb-2">No folders found</h3>
          <p className="text-slate-600 dark:text-slate-400">Create some folders to see them here</p>
        </div>
      )}
    </div>
  );
}