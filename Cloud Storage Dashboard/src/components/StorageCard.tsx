import { LucideIcon } from 'lucide-react';
import { Progress } from './ui/progress';

interface StorageCardProps {
  type: string;
  icon: LucideIcon;
  used: number;
  total: number;
  files: number;
  color: string;
}

export default function StorageCard({ type, icon: Icon, used, total, files, color }: StorageCardProps) {
  const percentage = (used / total) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      
      <h3 className="text-slate-900 dark:text-white mb-1">{type}</h3>
      <p className="text-blue-600 dark:text-blue-400 mb-1">{used}GB</p>
      <p className="text-slate-500 dark:text-slate-500 text-sm mb-3">{files} Files</p>
      
      <Progress value={percentage} className="h-2 mb-2" />
      
      <div className="flex justify-between text-xs text-slate-500">
        <span>{used}GB</span>
        <span>{total}GB</span>
      </div>
    </div>
  );
}