import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateFolderDialog({ open, onOpenChange }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('root');

  const handleCreate = () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    toast.success(`Folder "${folderName}" created successfully!`);
    setFolderName('');
    setParentFolder('root');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Create New Folder</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Create a new folder to organize your files
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-slate-700 dark:text-slate-300">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">Parent Folder</Label>
            <Select value={parentFolder} onValueChange={setParentFolder}>
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="root" className="text-slate-900 dark:text-white">Root Directory</SelectItem>
                <SelectItem value="documents" className="text-slate-900 dark:text-white">Documents</SelectItem>
                <SelectItem value="images" className="text-slate-900 dark:text-white">Images</SelectItem>
                <SelectItem value="videos" className="text-slate-900 dark:text-white">Videos</SelectItem>
                <SelectItem value="projects" className="text-slate-900 dark:text-white">Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
