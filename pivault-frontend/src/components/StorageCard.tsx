import type { ElementType } from 'react';

interface StorageCardProps {
  type: string;
  icon: ElementType;
  used: number;
  total: number;
  files: number;
  color: string;
}

export default function StorageCard({ type, icon: Icon, used, total, files, color }: StorageCardProps) {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const percentage = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {files} files
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{type}</h3>
      <p className="text-sm text-slate-500 mb-4">{formatBytes(used)} / {formatBytes(total)}</p>
      
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
