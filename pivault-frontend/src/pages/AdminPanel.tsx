import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Edit, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import api from '../services/api';

import { toast } from 'sonner';
import AddUserDialog from '../components/AddUserDialog';
import EditUserDialog from '../components/EditUserDialog';

interface UserItem {
  id: string;
  username: string;
  email?: string;
  role: string;
  avatar?: string;
  joined?: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, username: string) => {
    if (username === 'pi3s') {
      toast.error('Cannot delete the root system administrator.');
      return;
    }
    if (!confirm(`Are you sure you want to completely erase the Linux user ${username}? Their storage will be left behind but the profile will be destroyed.`)) return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('System user deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
    setOpenDropdown(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-400', statColor: 'text-blue-600' },
    { label: 'Active Users', value: users.length, icon: Shield, color: 'from-emerald-400 to-teal-500', statColor: 'text-emerald-600' },
    { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: Shield, color: 'from-purple-500 to-fuchsia-400', statColor: 'text-purple-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading user management...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-red-50 p-6 rounded-2xl border border-red-100 max-w-lg mx-auto mt-10 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-700 mt-2">Access Denied</h2>
        <p className="text-slate-600">You may not have the required permissions to view this panel, or the backend is unreachable.</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white border-0">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-600">Manage all users and their permissions</p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 text-white shadow-md w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.statColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-white"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <TableRow key={user.id || user.username}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-slate-900 font-semibold">{user.username}</p>
                      <p className="text-slate-500 text-xs">{user.email || 'No email'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">active</Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right relative">
                  <Button 
                    variant="outline" 
                    className="h-8 w-8 p-0 border-transparent text-slate-400 hover:text-slate-900 bg-transparent"
                    onClick={() => setOpenDropdown(openDropdown === user.username ? null : user.username)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  
                  {openDropdown === user.username && (
                    <div className="absolute right-8 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                      <button onClick={() => { setEditingUser(user); setOpenDropdown(null); }} className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
                        <Edit className="w-4 h-4 mr-2 text-slate-400" /> Edit
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left cursor-not-allowed opacity-50">
                        <Shield className="w-4 h-4 mr-2 text-slate-400" /> Role
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button onClick={() => handleDelete(user.id, user.username)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <Trash2 className="w-4 h-4 mr-2 text-red-400" /> Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onSuccess={fetchUsers} />
      <EditUserDialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)} user={editingUser} onSuccess={fetchUsers} />
    </div>
  );
}
