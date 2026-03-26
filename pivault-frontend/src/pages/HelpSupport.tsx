import { Book, Video, FileText, MessageCircle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';

export default function HelpSupport() {
  const helpResources = [
    { title: 'Documentation', description: 'Browse our comprehensive guides', icon: Book, color: 'from-blue-500 to-cyan-400' },
    { title: 'Video Tutorials', description: 'Watch step-by-step video guides', icon: Video, color: 'from-purple-500 to-fuchsia-400' },
    { title: 'FAQs', description: 'Find answers to common questions', icon: FileText, color: 'from-emerald-400 to-teal-500' },
    { title: 'Live Chat', description: 'Chat with our support team', icon: MessageCircle, color: 'from-orange-400 to-rose-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Help & Support</h1>
        <p className="text-slate-600">Get help with your CloudNest NAS</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {helpResources.map((resource) => (
          <div key={resource.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform shadow-sm`}>
              <resource.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">{resource.title}</h3>
            <p className="text-slate-500 text-sm">{resource.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900 font-bold text-lg">Contact Support</h2>
              <p className="text-slate-500 text-sm">Send us a message and we'll get back to you</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label className="text-slate-700">Subject</Label>
              <Input placeholder="What do you need help with?" className="bg-slate-50 border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Message</Label>
              <Textarea placeholder="Describe your issue or question..." rows={6} className="bg-slate-50 border-slate-200 resize-none h-40" />
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8">
              Send Message
            </Button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-slate-900 font-bold mb-6 text-lg border-b border-slate-200 pb-4">System Information</h3>
          <div className="space-y-6">
            <div>
              <p className="text-slate-500 text-sm mb-1">CloudNest Version</p>
              <p className="text-slate-900 font-semibold">v3.0.0-production</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Architecture</p>
              <p className="text-slate-900 font-semibold">New React/Tailwind Runtime</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Support ID</p>
              <p className="text-slate-900 font-mono text-sm bg-slate-200 px-2 py-1 rounded w-max">#CN-2026-NATIVE</p>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-1">Status</p>
              <div className="flex items-center text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
