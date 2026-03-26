import { Folder } from 'lucide-react';

interface FolderListProps {
  folders: Array<{
    id: string;
    name: string;
    date: string;
    size: string;
  }>;
  viewMode: 'grid' | 'list';
}

export default function FolderList({ folders, viewMode }: FolderListProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Folder className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-slate-900 dark:text-white">{folder.name}</h4>
                <p className="text-slate-500 dark:text-slate-500 text-xs">{folder.date}</p>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm">{folder.size}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all flex items-center gap-3 shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-slate-900 dark:text-white">{folder.name}</h4>
            <p className="text-slate-500 dark:text-slate-500 text-xs">{folder.date}</p>
          </div>
          <span className="text-blue-600 dark:text-blue-400 text-sm">{folder.size}</span>
        </div>
      ))}
    </div>
  );
}