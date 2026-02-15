import { useState, useEffect } from 'react';
import { 
  Server, Search, Filter, Activity, 
  Terminal, Globe, MoreHorizontal, 
  ChevronLeft, ChevronRight, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statuses = ['All', 'Active', 'Pending', 'Provisioning', 'Suspended'];

export default function Services() {
  const [data, setData] = useState({ services: [], total: 0, pages: 1 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/admin/billing/services/all?page=${page}&status=${filter}&search=${search}`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Error fetching services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [page, filter, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Instance Fleet</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage and monitor all active deployments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search instances..." 
              className="pl-9 rounded-xl bg-muted/20 border-border/50 h-11"
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/20 border border-border/50 rounded-2xl w-fit">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={filter === s ? "secondary" : "ghost"}
            className={cn(
              "rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
              filter === s ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
            )}
            onClick={() => { setFilter(s); setPage(1); }}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* Services Table */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border/50">
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Deployment Name</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Owner</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Plan</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.services.map((s: any) => (
                <tr key={s.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Box className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none">{s.service_name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-60 truncate w-32">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold">{s.username}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{s.email}</p>
                  </td>
                  <td className="p-5 text-center">
                    <div className="inline-block px-3 py-1 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-[10px] font-black uppercase text-foreground">{s.plan_name}</p>
                      <p className="text-[8px] font-black uppercase text-primary tracking-tighter">{s.category}</p>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase border",
                      s.status === 'Active' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      s.status === 'Suspended' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                    )}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                      <Terminal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.services.length === 0 && !loading && (
            <div className="p-20 text-center">
              <Server className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No matching instances found</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/5">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Total Units: {data.total}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-xs font-bold px-4">{page} / {data.pages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled={page === data.pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}