import { FileText, Image as ImageIcon, Film, Folder } from 'lucide-react';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    isDir: boolean;
    size?: string;
    updatedAt: string;
  };
  onClick?: () => void;
}

export default function FileCard({ file, onClick }: FileCardProps) {
  const getIcon = () => {
    if (file.isDir) return <Folder className="w-8 h-8 text-blue-500" />;
    if (file.type?.includes('image')) return <ImageIcon className="w-8 h-8 text-emerald-500" />;
    if (file.type?.includes('video')) return <Film className="w-8 h-8 text-purple-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-4">
      <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 truncate mb-1">{file.name}</h4>
        <div className="flex items-center text-xs text-slate-500 gap-2">
          <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
          {file.size && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{file.size}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
