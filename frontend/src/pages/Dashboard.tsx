import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Play, Square, Plus, Loader2, Zap, LayoutDashboard } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [instances, setInstances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    running: 0,
    stopped: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/my`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        
        if (res.ok) {
          setInstances(data);

          const running = data.filter((i: any) => i.status === 'Active').length;
          const stopped = data.filter((i: any) => i.status !== 'Active').length;

          setSummary({
            total: data.length,
            running: running,
            stopped: stopped,
          });
        }
      } catch (error) {
        toast.error("Dashboard synchronization failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total Nodes', value: summary.total.toString(), icon: <Server className="h-4 w-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active', value: summary.running.toString(), icon: <Play className="h-4 w-4" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Inactive', value: summary.stopped.toString(), icon: <Square className="h-4 w-4" />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">

      {/* Sleek Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-black tracking-tight uppercase italic">Overview</h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">Real-time infrastructure telemetry.</p>
        </div>
        <Button onClick={() => navigate('/create')} className="rounded-2xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Deploy Node</span>
          <span className="sm:hidden text-xs">Deploy</span>
        </Button>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-border/40 shadow-sm bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden group hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", s.bg, s.color)}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em]">
                  {s.title}
                </p>
                <p className="text-2xl font-black tracking-tighter">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main List Area */}
        <Card className="border-border/40 shadow-xl bg-card/20 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-border/40 bg-muted/5">
            <CardTitle className="text-base font-black uppercase tracking-widest text-foreground/80">Active Fleet</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-8 px-4 font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-full"
              onClick={() => navigate('/instances')}
            >
              View Full Fleet
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {instances.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-border/40 group"
                  onClick={() => navigate(`/instances/${item.id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Zap className={cn("h-6 w-6 text-primary group-hover:text-white transition-colors", item.status === 'Active' && "fill-current")} />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-black truncate text-foreground tracking-tight">{item.service_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-70 mt-0.5">
                        {item.plan_name || 'Generic Node'} • <span className="font-mono">{item.id.slice(0, 8).toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <StatusBadge status={item.status.toLowerCase()} />
                  </div>
                </div>
              ))}

              {instances.length === 0 && (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <Server className="h-12 w-12 text-muted-foreground/20" />
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                    No nodes provisioned.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}