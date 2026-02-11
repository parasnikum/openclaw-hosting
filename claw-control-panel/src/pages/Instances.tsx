import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Play, Square, MoreVertical, Search, Plus, Sparkles, Activity, Loader2, Globe } from 'lucide-react';
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

  // 1. Fetch user-specific services from the backend
  const fetchMyServices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/my`, {
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setInstances(data);
        console.log(data);

      }
    } catch (error) {
      toast.error("Could not sync instances");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const filteredInstances = instances.filter((i) =>
    i.service_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (action: string, id: string) => {
    toast.info(`${action} requested...`);
    // Here you would call your status update route
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Deployment Fleet</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage your active Openclaw and script instances.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-lg bg-muted/30 border-border/50"
            />
          </div>
          <Button onClick={() => navigate('/create')} className="rounded-lg shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> New Instance
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstances.map((instance) => (
          <div
            key={instance.id}
            className={cn(
              "group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md",
              instance.status === 'Active' ? "hover:border-primary/40" : "opacity-80"
            )}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 border border-primary/10">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate pr-2">{instance.service_name.length > 20
                    ? instance.service_name.slice(0, 20) + "..."
                    : instance.service_name}</h3>
                  <StatusBadge status={instance.status.toLowerCase()} />
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => navigate(`/instances/${instance}`)}>View Console</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('Restart', instance.id)}>Force Restart</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Terminate Service</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Metrics */}
            {/* <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border/40">
              <div className="space-y-1">
                <span className="flex items-center text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                  <Globe className="h-3 w-3 mr-1" /> Endpoint
                </span>
                <p className="text-xs font-mono font-bold truncate">
                    {instance.hostname ? `${instance.hostname}` : 'Allocating...'}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <span className="block text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Purchased On</span>
                <p className="text-xs font-bold">{new Date(instance.purchased_on).toLocaleDateString()}</p>
              </div>
            </div> */}

            {/* Tech Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold uppercase text-muted-foreground">
                {instance.plan_name || 'Generic Plan'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-auto">
              {/* <Button 
                variant={instance.status === 'Active' ? "outline" : "default"}
                size="sm"
                className="flex-1 rounded-xl h-10 font-bold"
                onClick={() => handleAction('Power', instance.id)}
                disabled={instance.status === 'Suspended'}
              >
                {instance.status === 'Active' ? (
                  <><Square className="h-3 w-3 mr-2 fill-current" /> Stop</>
                ) : (
                  <><Play className="h-3 w-3 mr-2 fill-current" /> Start</>
                )}
              </Button> */}
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 rounded-xl h-10 font-bold"
                onClick={() => navigate(`/instances/${instance.id}`)}
              >
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInstances.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-[2rem] border border-dashed border-border/60">
          <Server className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-xl">No instances found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            You don't have any active deployments yet. Launch your first bot to get started.
          </p>
          <Button onClick={() => navigate('/create')} className="mt-6 rounded-xl h-11 px-8">
            Create First Instance
          </Button>
        </div>
      )}
    </div>
  );
}