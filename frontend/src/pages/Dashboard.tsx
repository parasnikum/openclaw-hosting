import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Play, Square, CreditCard, AlertCircle, Plus, Loader2, Zap } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [instances, setInstances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    running: 0,
    stopped: 0,
    totalBill: 0
  });

  // 1. Fetch Real Data from your services and invoices routes
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/my`, {
          credentials: "include"
        });
        const data = await res.json();
        
        if (res.ok) {
          setInstances(data);
          
          // Calculate stats from the fetched array
          const running = data.filter((i: any) => i.status === 'Active').length;
          const stopped = data.filter((i: any) => i.status === 'Suspended' || i.status === 'Pending').length;
          
          // Sum up the price from each service for a dummy "Current Bill"
          const bill = data.reduce((acc: number, curr: any) => acc + parseFloat(curr.price || 0), 0);

          setSummary({
            total: data.length,
            running: running,
            stopped: stopped,
            totalBill: bill
          });
        }
      } catch (error) {
        toast.error("Dashboard sync failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total', value: summary.total.toString(), icon: <Server className="h-4 w-4" />, color: 'text-blue-500' },
    { title: 'Running', value: summary.running.toString(), icon: <Play className="h-4 w-4" />, color: 'text-green-500' },
    { title: 'Stopped', value: summary.stopped.toString(), icon: <Square className="h-4 w-4" />, color: 'text-slate-500' },
    { title: 'Bill', value: `$${summary.totalBill.toFixed(2)}`, icon: <CreditCard className="h-4 w-4" />, color: 'text-primary' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs md:text-sm text-muted-foreground">System status at a glance.</p>
        </div>
        <Button onClick={() => navigate('/create')} size="sm" className="rounded-xl h-9 px-3 md:px-4 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-1 md:mr-2" />
          <span className="text-xs md:text-sm">New Instance</span>
        </Button>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-none shadow-sm bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted/50 hidden sm:block ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  {s.title}
                </p>
                <p className="text-lg md:text-xl font-black">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Instances List */}
        <Card className="lg:col-span-2 shadow-sm border-border/50 bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-4 md:px-6 border-b border-border/50">
            <CardTitle className="text-sm md:text-base font-bold">Active Deployments</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[11px] h-7 font-bold text-primary hover:bg-primary/5" 
              onClick={() => navigate('/instances')}
            >
              View All fleet
            </Button>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="space-y-1">
              {instances.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-border/50 group"
                  onClick={() => navigate(`/instances/${item.id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold truncate">{item.service_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        {item.plan_name || 'Compute Node'} • {item.ip || 'Provisioning...'}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 shrink-0">
                    <StatusBadge status={item.status.toLowerCase()} />
                  </div>
                </div>
              ))}
              {instances.length === 0 && (
                <div className="py-10 text-center text-muted-foreground text-sm italic">
                    No active services found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Alerts Sidebar */}
        <Card className="shadow-sm border-dashed bg-muted/10 border-border/50">
          <CardHeader className="py-4 px-4 md:px-6">
            <CardTitle className="text-sm md:text-base font-bold">Infrastructure Alerts</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {summary.stopped > 0 && (
                <div className="flex gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 animate-pulse">
                    <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                        <p className="text-[11px] md:text-xs font-bold leading-tight">Service Interruption</p>
                        <p className="text-[10px] md:text-[11px] text-muted-foreground truncate">{summary.stopped} node(s) require attention.</p>
                    </div>
                </div>
            )}
            <div className="flex gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                    <p className="text-[11px] md:text-xs font-bold leading-tight">Network Status</p>
                    <p className="text-[10px] md:text-[11px] text-muted-foreground truncate">All clusters are operational.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}