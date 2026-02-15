import { useState, useEffect } from 'react';
import { 
  Search, User, Mail, Eye, ChevronLeft, ChevronRight, 
  Server, Receipt, ExternalLink, ShieldAlert, CheckCircle2,
  Lock, UserX, UserCheck, RefreshCw, ShieldQuestion,
  ArrowUpRight, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState({ users: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>({ services: [], invoices: [] });
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?page=${page}&search=${search}`, { credentials: "include" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (user: any) => {
    setSelectedUser(user);
    setNewPassword(''); // Clear password field when switching users
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${user.id}/details`, { credentials: "include" });
      const json = await res.json();
      setUserDetails(json);
    } catch (error) {
      toast.error("Could not load user details");
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const status = !selectedUser.is_suspended;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: "include"
      });
      if (res.ok) {
        toast.success(`User ${status ? 'Suspended' : 'Activated'}`);
        setSelectedUser({ ...selectedUser, is_suspended: status });
        fetchUsers();
      }
    } catch (e) { toast.error("Update failed"); }
    finally { setIsUpdating(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters");
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser.id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Password updated successfully");
        setNewPassword('');
      } else {
        toast.error("Failed to reset password");
      }
    } catch (e) { toast.error("Network error"); }
    finally { setIsUpdating(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Users</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage accounts and platform access.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search username or email..." 
            className="flex h-11 w-full rounded-xl border border-border/50 bg-muted/20 pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>
      
      {/* Users Table */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/10">
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Identity & Verification</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Joined On</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.users.map((user: any) => (
                <tr key={user.id} className={cn("group hover:bg-primary/5 transition-colors", user.is_suspended && "opacity-60")}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 text-primary font-bold relative">
                        {user.username[0].toUpperCase()}
                        <div className="absolute -top-1 -right-1">
                          {user.is_verified ? 
                            <CheckCircle2 className="h-4 w-4 text-green-500 bg-background rounded-full p-0.5" /> : 
                            <ShieldAlert className="h-4 w-4 text-amber-500 bg-background rounded-full p-0.5" />
                          }
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-sm leading-none">{user.username}</p>
                           <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded border", 
                             user.is_verified ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                           )}>
                             {user.is_verified ? 'Verified' : 'Pending'}
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                      user.is_suspended ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                    )}>{user.is_suspended ? 'Suspended' : 'Active'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="rounded-xl border-border/50" onClick={() => fetchUserDetails(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader className="flex flex-row items-center gap-4 border-b border-border/50 pb-4">
            <div className="text-left flex-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
                {selectedUser?.username} 
                {selectedUser?.is_verified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </DialogTitle>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">User Details & Controls</p>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Deployments List */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Server className="h-3.5 w-3.5" /> Deployments ({userDetails.services.length})
              </h3>
              <div className="space-y-2">
                {userDetails.services.map((s: any) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex justify-between items-center group hover:border-primary/50 transition-all">
                    <div>
                      <p className="text-sm font-bold">{s.service_name}</p>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">{s.plan_name} • {s.category}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="rounded-lg h-8 text-[10px] font-black uppercase"
                      onClick={() => navigate(`/instances/${s.id}`)}
                    >
                      Manage <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {userDetails.services.length === 0 && <p className="text-xs text-muted-foreground italic">No active services.</p>}
              </div>
            </div>

            {/* Management Sidebar */}
            <div className="space-y-6 border-l border-border/50 pl-6">
                <section className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <ShieldQuestion className="h-3.5 w-3.5" /> Access Control
                    </h3>
                    <Button 
                        variant={selectedUser?.is_suspended ? "default" : "outline"}
                        className={cn("w-full rounded-xl h-11 font-bold", selectedUser?.is_suspended && "bg-green-600 hover:bg-green-700")}
                        onClick={handleToggleStatus}
                        disabled={isUpdating}
                    >
                        {selectedUser?.is_suspended ? <UserCheck className="h-4 w-4 mr-2" /> : <UserX className="h-4 w-4 mr-2" />}
                        {selectedUser?.is_suspended ? "Activate User" : "Suspend User"}
                    </Button>
                </section>

                <section className="space-y-3 pt-4 border-t border-border/50">
                    <h3 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" /> Password Reset
                    </h3>
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">New Secure Password</Label>
                        <Input 
                            type="password"
                            placeholder="••••••••" 
                            className="rounded-xl h-10 bg-muted/10 border-border/50" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button 
                            variant="secondary" 
                            className="w-full rounded-xl h-10 font-bold text-xs"
                            onClick={handleResetPassword}
                            disabled={isUpdating}
                        >
                            <RefreshCw className={cn("h-3 w-3 mr-2", isUpdating && "animate-spin")} />
                            Set New Password
                        </Button>
                    </div>
                </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}