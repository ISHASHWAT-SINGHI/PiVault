import { MoreVertical, Calendar, User, Clock, Share2, Download, Trash2, Star, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    thumbnail: string;
    images: number;
    size: string;
    collaborators: string[];
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function FileCard({ file, isSelected, onClick }: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState(`https://cloudnest.app/share/${file.id}`);

  const details = [
    { label: 'Type', value: 'Document', icon: null },
    { label: 'Size', value: file.size, icon: null },
    { label: 'Owner', value: 'Andrea', icon: User },
    { label: 'Modified', value: 'March 25, 2024', icon: Calendar },
    { label: 'Opened', value: '12:56 AM', icon: Clock },
  ];

  const handleDelete = () => {
    toast.success(`"${file.name}" has been deleted`);
    setShowDeleteDialog(false);
  };

  const handleDownload = () => {
    toast.success(`Downloading "${file.name}"...`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = () => {
    toast.success(`Share link generated for "${file.name}"`);
    setShowShareDialog(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`group bg-white dark:bg-slate-800 rounded-2xl p-4 border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden ${
          isSelected 
            ? 'border-blue-500 shadow-blue-500/20' 
            : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        {/* Image Section */}
        <div className="relative mb-4 transition-all duration-500 ease-in-out group-hover:mb-2">
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-full h-40 object-cover rounded-xl transition-all duration-500 ease-in-out group-hover:h-20"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-white shadow-sm"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareDialog(true);
                }}
                className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                <Star className="w-4 h-4 mr-2" />
                Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Basic Info - Always Visible */}
        <h3 className="text-slate-900 dark:text-white mb-1 transition-all duration-300">{file.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 transition-all duration-300">
          {file.images} images · {file.size}
        </p>

        {/* Collaborators - Visible by default, hidden on hover */}
        <div className="transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:max-h-0 max-h-10 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            {file.collaborators.map((avatar, index) => (
              <Avatar key={index} className="w-6 h-6 border-2 border-white dark:border-slate-800">
                <AvatarImage src={avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ))}
            {file.collaborators.length > 3 && (
              <span className="text-xs text-slate-400">+{file.collaborators.length - 3}</span>
            )}
          </div>
        </div>

        {/* Details Section - Visible on Hover */}
        <div className="max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-96 group-hover:opacity-100 overflow-hidden">
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {detail.icon && <detail.icon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />}
                  <span className="text-slate-500 dark:text-slate-500 text-sm">{detail.label}</span>
                </div>
                <span className="text-slate-900 dark:text-white text-sm">{detail.value}</span>
              </div>
            ))}
            
            {/* Collaborators in hover state */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">Collaborators</p>
              <div className="flex items-center gap-2">
                {file.collaborators.map((avatar, index) => (
                  <Avatar key={index} className="w-7 h-7 border-2 border-white dark:border-slate-800">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
                {file.collaborators.length > 3 && (
                  <span className="text-xs text-slate-400">+{file.collaborators.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">Delete File</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete "{file.name}"? This action cannot be undone and the file will be permanently removed from your storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Share "{file.name}"</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Share this file with others by copying the link below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Share with collaborators</p>
              <Input
                placeholder="Enter email address"
                type="email"
                className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(false)}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            >
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}