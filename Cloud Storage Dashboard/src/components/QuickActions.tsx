import { Upload, FolderPlus, Share2, Download, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import UploadDialog from './UploadDialog';
import CreateFolderDialog from './CreateFolderDialog';
import { toast } from 'sonner';

const actions = [
  {
    id: '1',
    name: 'Upload Files',
    description: 'Upload new files to your cloud storage',
    icon: Upload,
    color: 'from-blue-500 to-cyan-400',
    action: 'upload',
  },
  {
    id: '2',
    name: 'Create Folder',
    description: 'Organize your files with new folders',
    icon: FolderPlus,
    color: 'from-purple-500 to-pink-400',
    action: 'create-folder',
  },
  {
    id: '3',
    name: 'Share Files',
    description: 'Share files with family members',
    icon: Share2,
    color: 'from-green-500 to-emerald-400',
    action: 'share',
  },
  {
    id: '4',
    name: 'Download',
    description: 'Download files to your device',
    icon: Download,
    color: 'from-orange-500 to-yellow-400',
    action: 'download',
  },
  {
    id: '5',
    name: 'Get Link',
    description: 'Generate shareable links',
    icon: LinkIcon,
    color: 'from-cyan-500 to-blue-400',
    action: 'link',
  },
  {
    id: '6',
    name: 'Delete Files',
    description: 'Remove unwanted files',
    icon: Trash2,
    color: 'from-red-500 to-pink-400',
    action: 'delete',
  },
];

export default function QuickActions() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'upload':
        setShowUploadDialog(true);
        break;
      case 'create-folder':
        setShowCreateFolderDialog(true);
        break;
      case 'share':
        toast.info('Please select a file to share');
        break;
      case 'download':
        toast.info('Please select a file to download');
        break;
      case 'link':
        toast.info('Please select a file to generate a link');
        break;
      case 'delete':
        toast.info('Please select a file to delete');
        break;
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-blue-600 dark:text-blue-400 mb-2">Quick Actions</h1>
        <p className="text-slate-600 dark:text-slate-400">Fast access to common file operations</p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {actions.map((action) => (
          <div
            key={action.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all group shadow-sm"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <action.icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-slate-900 dark:text-white mb-2">{action.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{action.description}</p>

            <Button 
              onClick={() => handleAction(action.action)}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white"
            >
              Execute
            </Button>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
      <CreateFolderDialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog} />
    </div>
  );
}