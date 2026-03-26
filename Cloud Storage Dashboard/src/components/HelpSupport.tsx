import { HelpCircle, Book, MessageCircle, Mail, FileText, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const helpResources = [
  {
    id: '1',
    title: 'Documentation',
    description: 'Browse our comprehensive guides',
    icon: Book,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: '2',
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides',
    icon: Video,
    color: 'from-purple-500 to-pink-400',
  },
  {
    id: '3',
    title: 'FAQs',
    description: 'Find answers to common questions',
    icon: FileText,
    color: 'from-green-500 to-emerald-400',
  },
  {
    id: '4',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: MessageCircle,
    color: 'from-orange-500 to-yellow-400',
  },
];

export default function HelpSupport() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-blue-600 dark:text-blue-400 mb-2">Help & Support</h1>
        <p className="text-slate-600 dark:text-slate-400">Get help with your CloudNest NAS</p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {helpResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all group shadow-sm"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <resource.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-slate-900 dark:text-white mb-2">{resource.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{resource.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white">Contact Support</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Send us a message and we'll get back to you</p>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">Subject</label>
            <Input
              placeholder="What do you need help with?"
              className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">Message</label>
            <Textarea
              placeholder="Describe your issue or question..."
              rows={6}
              className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500"
            />
          </div>

          <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30">
            Send Message
          </Button>
        </form>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-6 border border-blue-200 dark:border-blue-500/30 shadow-sm">
        <h3 className="text-slate-900 dark:text-white mb-3">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600 dark:text-slate-400">CloudNest Version</p>
            <p className="text-slate-900 dark:text-white">v2.5.1</p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Last Updated</p>
            <p className="text-slate-900 dark:text-white">November 17, 2024</p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Support ID</p>
            <p className="text-slate-900 dark:text-white">#CN-2024-891234</p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Status</p>
            <p className="text-green-600 dark:text-green-400">All Systems Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}