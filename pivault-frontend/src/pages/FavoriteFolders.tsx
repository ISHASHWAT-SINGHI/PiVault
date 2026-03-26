import { useState, useEffect } from 'react';
import { Heart, Folder, Star, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function FavoriteFolders() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('pivault_favs') || '[]');
      setFavorites(favs);
    } catch(e) {}
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500">Loading favorite folders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Favorite Folders</h1>
        <p className="text-slate-600">Quick access to folders you've starred in the File Explorer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {favorites.map((folderPath) => {
          const folderName = folderPath.split('/').pop() || folderPath;
          return (
            <div
              key={folderPath}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-md">
                      <Folder className="w-7 h-7 text-white" />
                    </div>
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 cursor-pointer" onClick={() => {
                        const newFavs = favorites.filter(f => f !== folderPath);
                        setFavorites(newFavs);
                        localStorage.setItem('pivault_favs', JSON.stringify(newFavs));
                    }} />
                  </div>
      
                  <h3 className="text-slate-900 font-semibold text-lg mb-1 truncate" title={folderPath}>{folderName}</h3>
                  <p className="text-slate-500 text-xs mb-4 font-mono truncate bg-slate-50 p-1.5 rounded-md border border-slate-100">
                      /{folderPath}
                  </p>
              </div>

              <Button onClick={() => window.location.href = `/files?path=${encodeURIComponent(folderPath)}`} className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white border-0">
                Open Folder
              </Button>
            </div>
          );
        })}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 font-medium mb-2 text-lg">No favorite folders found</h3>
          <p className="text-slate-500">Go to the File Explorer and click the Star icon on any folder to add it here.</p>
          <Button onClick={() => window.location.href = '/files'} variant="outline" className="mt-6">
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
