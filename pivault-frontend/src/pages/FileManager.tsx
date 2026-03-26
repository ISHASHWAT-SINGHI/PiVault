import { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, Download, Trash2, ArrowLeft, Loader2, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import UploadDialog from '../components/UploadDialog';
import CreateFolderDialog from '../components/CreateFolderDialog';
import { toast } from 'sonner';
import api from '../services/api';
import { useLocation } from 'react-router-dom';

export default function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('path') || '';
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pivault_favs') || '[]'); } catch { return []; }
  });
  
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/storage/list?path=${encodeURIComponent(currentPath)}`);
      setFiles(data.data || []);
    } catch (error) {
      toast.error('Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
        const targetPath = currentPath ? `${currentPath}/${item.name}` : item.name;
        await api.delete('/storage/delete', { data: { targetPath } });
        toast.success('Deleted successfully');
        
        // Remove from favorites if deleted
        if (item.isDir) {
            const newFavs = favorites.filter(f => f !== targetPath);
            setFavorites(newFavs);
            localStorage.setItem('pivault_favs', JSON.stringify(newFavs));
        }
        
        fetchFiles();
    } catch (error) {
        toast.error('Failed to delete item');
    }
  };

  const toggleFavorite = (e: React.MouseEvent, folderName: string) => {
    e.stopPropagation();
    const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    let newFavs = [...favorites];
    if (newFavs.includes(folderPath)) {
        newFavs = newFavs.filter(f => f !== folderPath);
        toast.success('Removed from Favorites');
    } else {
        newFavs.push(folderPath);
        toast.success('Added to Favorites');
    }
    setFavorites(newFavs);
    localStorage.setItem('pivault_favs', JSON.stringify(newFavs));
  };

  const handleDownload = (item: any) => {
    const downloadPath = currentPath ? `${currentPath}/${item.name}` : item.name;
    const userStr = localStorage.getItem('user');
    let token = '';
    if (userStr) {
        try { token = JSON.parse(userStr).accessToken; } catch(e) {}
    }
    if (!token) token = localStorage.getItem('token') || '';
    
    // Redirect browser directly to the endpoint to natively stream the binary payload
    window.location.href = `/api/storage/download?path=${encodeURIComponent(downloadPath)}&token=${token}`;
  };

  const navigateTo = (folderName: string) => {
      setCurrentPath(prev => prev ? `${prev}/${folderName}` : folderName);
  };

  const navigateUp = () => {
      if (!currentPath) return;
      const parts = currentPath.split('/');
      parts.pop();
      setCurrentPath(parts.join('/'));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">File Manager</h1>
          <div className="flex items-center text-sm text-slate-500 mt-2 font-mono bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <button onClick={() => setCurrentPath('')} className="hover:text-blue-600 transition-colors">PiVaultStorage</button>
            {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
              <span key={index} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                <button 
                  onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                  className="hover:text-blue-600 transition-colors"
                >
                  {part}
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setCreateOpen(true)}>New Folder</Button>
          <Button onClick={() => setUploadOpen(true)} className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-0">Upload Files</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6 pl-2">Name</div>
          <div className="col-span-2 text-center">Size</div>
          <div className="col-span-3 text-center">Modified</div>
          <div className="col-span-1 text-right pr-2">Actions</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p>Loading files...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentPath && (
              <div 
                onClick={navigateUp}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="col-span-6 flex items-center gap-3 pl-2">
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">.. (Up one level)</span>
                </div>
                <div className="col-span-2 text-center text-slate-500 text-sm">-</div>
                <div className="col-span-3 text-center text-slate-500 text-sm">-</div>
                <div className="col-span-1"></div>
              </div>
            )}
            
            {files.length === 0 ? (
              <div className="p-20 text-center text-slate-500">
                 <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                 <p className="text-lg font-medium text-slate-700">This folder is empty</p>
                 <p className="text-sm mt-1">Upload files or create a folder to get started.</p>
              </div>
            ) : (
              files.filter(f => {
                 const searchParams = new URLSearchParams(location.search);
                 const search = searchParams.get('search')?.toLowerCase();
                 if (!search) return true;
                 return f.name.toLowerCase().includes(search);
              }).map((file) => (
                <div key={file.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group">
                  <div 
                    className="col-span-6 flex items-center gap-3 pl-2 cursor-pointer"
                    onClick={() => file.isDir && navigateTo(file.name)}
                  >
                    {file.isDir ? (
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Folder className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-slate-200 transition-colors">
                        <File className="w-5 h-5" />
                      </div>
                    )}
                    <span className="font-medium text-slate-700 hover:text-blue-600 transition-colors truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-slate-500 text-sm">
                    {file.isDir ? '-' : file.size}
                  </div>
                  <div className="col-span-3 text-center text-slate-400 text-sm truncate">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.isDir && (
                      <button 
                        onClick={(e) => toggleFavorite(e, file.name)} 
                        className={`p-1.5 hover:bg-yellow-50 rounded-md transition-colors ${favorites.includes(currentPath ? `${currentPath}/${file.name}` : file.name) ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`} 
                        title="Toggle Favorite"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(currentPath ? `${currentPath}/${file.name}` : file.name) ? 'fill-yellow-400' : ''}`} />
                      </button>
                    )}
                    {!file.isDir && (
                       <button onClick={() => handleDownload(file)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Download">
                         <Download className="w-4 h-4" />
                       </button>
                    )}
                    <button onClick={() => handleDelete(file)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={fetchFiles} currentPath={currentPath} />
      <CreateFolderDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchFiles} currentPath={currentPath} />
    </div>
  );
}
