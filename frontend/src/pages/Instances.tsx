import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, Search, Plus, Sparkles, Loader2, 
  Globe, Cpu, Zap, ArrowRight, LayoutDashboard, Terminal 
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Instances() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [instances, setInstances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyServices = async () => {
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/my`, {
        method :  "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) setInstances(data);
      
    } catch (error) {
      toast.error("Could not sync instances");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMyServices(); }, []);

  const filteredInstances = instances.filter((i) =>
    i.service_name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* Sleek Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">System Live</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight italic">Fleet.</h1>
          <p className="text-sm text-muted-foreground font-medium">Monitoring {instances.length} active deployments.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 w-full md:w-64 rounded-xl bg-muted/20 border-border/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <Button onClick={() => navigate('/create')} className="rounded-xl h-11 px-5 font-bold shadow-lg shadow-primary/10">
            <Plus className="h-4 w-4 mr-2" /> New Node
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstances.map((instance) => {
          const isOpenClaw = instance.category?.toLowerCase() === 'openclaw';
          
          return (
            <div
              key={instance.id}
              className="group relative flex flex-col rounded-[2rem] border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Status & Options */}
              <div className="flex items-center justify-between mb-5">
                <StatusBadge status={instance.status.toLowerCase()} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl">
                    <DropdownMenuItem className="font-bold text-xs p-3" onClick={() => navigate(`/instances/${instance.id}`)}>Console</DropdownMenuItem>
                    <DropdownMenuItem className="font-bold text-xs p-3">Reboot</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="font-bold text-xs p-3 text-destructive">Terminate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Main Branding Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:shadow-inner",
                  isOpenClaw ? "bg-orange-500/10 border-orange-500/20" : "bg-primary/5 border-primary/10"
                )}>
                  {isOpenClaw ? (
                    <img src="/openclaw.png" alt="" className="h-7 w-7 object-contain" />
                  ) : (
                    <Terminal className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-lg tracking-tight truncate leading-tight">
                    {instance.service_name}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    {instance.plan_name || 'Standard Node'}
                  </p>
                </div>
              </div>

              {/* Mini Info Panel */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="px-3 py-2 rounded-xl bg-muted/10 border border-border/20 flex items-center gap-2">
                  <Globe className="h-3 w-3 text-primary/60" />
                  <span className="text-[10px] font-mono font-bold truncate opacity-70">
                    {instance.status || 'pending...'}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-muted/10 border border-border/20 flex items-center gap-2">
                  <Cpu className="h-3 w-3 text-primary/60" />
                  <span className="text-[10px] font-mono font-bold truncate opacity-70">
                    ID:{instance.id.slice(0, 6)}
                  </span>
                </div>
              </div>

              {/* Compact Action */}
              <Button
                variant="secondary"
                onClick={() => navigate(`/instances/${instance.id}`)}
                className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest bg-muted/50 hover:bg-primary hover:text-white transition-all group"
              >
                Access Hub <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInstances.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] bg-muted/5">
          <div className="h-14 w-14 rounded-3xl bg-muted/10 flex items-center justify-center mb-5">
            <LayoutDashboard className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="font-black text-xl tracking-tight">Fleet Empty</h3>
          <p className="text-xs font-medium text-muted-foreground mt-1 max-w-[240px]">
            No instances deployed on this cluster yet.
          </p>
          <Button onClick={() => navigate('/create')} className="mt-8 rounded-xl h-11 px-8 font-bold text-xs uppercase tracking-widest">
            Deploy Node
          </Button>
        </div>
      )}
    </div>
  );
}