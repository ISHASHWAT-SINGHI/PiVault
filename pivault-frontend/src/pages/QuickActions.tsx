import { Upload, FolderPlus, Download, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import UploadDialog from '../components/UploadDialog';
import CreateFolderDialog from '../components/CreateFolderDialog';

export default function QuickActions() {
  const navigate = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const actions = [
    { name: 'Upload Files', description: 'Upload new files to your cloud storage', icon: Upload, color: 'from-blue-500 to-cyan-400' },
    { name: 'Create Folder', description: 'Organize your files with new folders', icon: FolderPlus, color: 'from-purple-500 to-fuchsia-400' },
    { name: 'Delete Files', description: 'Remove unwanted files', icon: Trash2, color: 'from-red-500 to-pink-500' },
    { name: 'Download', description: 'Download files to your device', icon: Download, color: 'from-orange-400 to-rose-400' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Quick Actions</h1>
        <p className="text-slate-600">Fast access to common file operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {actions.map((action) => (
          <div 
            key={action.name} 
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col cursor-pointer"
            onClick={() => {
              if (action.name === 'Upload Files') setUploadOpen(true);
              else if (action.name === 'Create Folder') setCreateOpen(true);
              else {
                toast.info(`Please navigate to the File Manager to ${action.name.toLowerCase()}.`);
                navigate('/files');
              }
            }}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform shadow-md`}>
              <action.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2">{action.name}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">{action.description}</p>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white border-0 pointer-events-none">
              Execute
            </Button>
          </div>
        ))}
      </div>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateFolderDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
