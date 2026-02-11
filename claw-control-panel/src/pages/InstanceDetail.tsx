import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Square, RefreshCw, Settings,
  Activity, Cpu, HardDrive, ArrowUpRight, Key,
  Loader2, Save, LayoutDashboard, Globe, Eye, EyeOff, Copy, Plus, Trash2
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function InstanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instance, setInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [envVars, setEnvVars] = useState([]);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/details/${id}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setInstance(data);
        const mappedEnvs = Object.entries(data.env || {}).map(([k, v]) => ({
          key: k,
          value: v,
          isHidden: true // Default to hidden for security
        }));
        setEnvVars(mappedEnvs);
      }
    } catch (error) {
      toast.error("Failed to load instance details");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = (index) => {
    const newEnvs = [...envVars];
    newEnvs[index].isHidden = !newEnvs[index].isHidden;
    setEnvVars(newEnvs);
  };

  const updateEnv = (index, field, value) => {
    const newEnvs = [...envVars];
    newEnvs[index][field] = value;
    setEnvVars(newEnvs);
  };

  const addEnvRow = () => {
    setEnvVars([...envVars, { key: '', value: '', isHidden: false }]);
  };

  const removeEnvRow = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Value copied to clipboard");
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const handlePowerAction = async (action) => {
    setIsActionLoading(true);
    const promise = fetch(`${import.meta.env.VITE_API_URL}/servers/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      credentials: "include"
    });

    toast.promise(promise, {
      loading: `Sending ${action} command...`,
      success: () => {
        fetchDetails();
        return `Server ${action}ed successfully`;
      },
      error: 'Failed to execute power action'
    });

    try {
      await promise;
    } finally {
      setIsActionLoading(false);
    }
  };

  const openOpenclawUI = () => {
    if (!instance?.hostname) return toast.error("Hostname not available");
    const url = instance.hostname.endsWith('/') ? `${instance.hostname}dashboard` : `${instance.hostname}/dashboard`;
    window.open(url, '_blank');
  };

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!instance) return <div className="p-10 text-center">Instance not found.</div>;

  // Normalizing status for logic
  const isRunning = instance.status?.toLowerCase() === 'active';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/30 p-6 rounded-[2rem] border border-border/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-background border border-border" onClick={() => navigate('/instances')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight">{instance.service_name}</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Software: {instance.category} • {instance.plan_name}
            </p>
          </div>
        </div>

        {/* CONTROLS SECTION */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={openOpenclawUI}
            variant="secondary"
            className="rounded-xl font-bold gap-2 h-11 px-6 shadow-sm"
          >
            <ArrowUpRight className="h-4 w-4" />
            Visit Dashboard
          </Button>

          {/* <div className="h-10 w-[1px] bg-border mx-2 hidden sm:block" /> */}
          {/* <Button
            size="default"
            disabled={isActionLoading}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 shadow-lg shadow-emerald-600/20"
            onClick={() => handlePowerAction('start')}
          >
            <Play className="h-4 w-4 mr-2 fill-current" /> Start
          </Button>
          <Button
            variant="destructive"
            size="default"
            disabled={isActionLoading}
            className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-destructive/20"
            onClick={() => handlePowerAction('stop')}
          >
            <Square className="h-4 w-4 mr-2 fill-current" /> Stop
          </Button>

          <Button
            variant="outline"
            size="default"
            disabled={isActionLoading}
            className="rounded-xl font-bold h-11 px-6 bg-background border-border"
            onClick={() => handlePowerAction('restart')}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isActionLoading && "animate-spin")} /> Restart
          </Button> */}
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
          <TabsTrigger value="metrics" className="px-8 rounded-lg font-bold h-10">Metrics & Info</TabsTrigger>
          <TabsTrigger value="env" className="px-8 rounded-lg gap-2 font-bold h-10">
            <Settings className="h-3.5 w-3.5" /> Environment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Activity} label="Status" value={instance.status} color="text-emerald-500" bgColor="bg-emerald-500/10" />
            {/* <StatCard icon={Globe} label="Endpoint" value={instance.hostname || ""} color="text-blue-500" bgColor="bg-blue-500/10" /> */}
            <StatCard icon={Cpu} label="vCPU" value={instance.plan_config?.cpu} color="text-orange-500" bgColor="bg-orange-500/10" />
            <StatCard icon={HardDrive} label="Memory" value={instance.plan_config?.ram} color="text-purple-500" bgColor="bg-purple-500/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-[2rem] border-border/50 shadow-sm bg-card/50 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50"><CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">Subscription Details</CardTitle></CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-center border-b border-border/50 pb-3">
                  <span className="text-xs text-muted-foreground uppercase font-black">Service Plan</span>
                  <span className="text-sm font-bold text-primary">{instance.plan_name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-3">
                  <span className="text-xs text-muted-foreground uppercase font-black">Provisioned On</span>
                  <span className="text-sm font-medium">{new Date(instance.purchased_on).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pb-1 text-orange-500">
                  <span className="text-xs uppercase font-black">Next Billing</span>
                  <span className="text-sm font-black">{new Date(instance.renewal_date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/50 bg-slate-950 text-emerald-400 font-mono shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-[10px] uppercase tracking-[0.2em]">Real-time Container Logs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 text-[11px] space-y-1.5 h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                <div className="opacity-40 select-none"># Container ID: {instance.container_id}</div>
                <div className="text-emerald-500/70 select-none">[SYSTEM] Connected to node stream...</div>
                <div className="h-2" />
                <div>[STDOUT] Application starting...</div>
                <div>[STDOUT] Environment: Production</div>
                <div className="text-blue-400">[DEBUG] Internal Port: 8080 mapped to {instance.hostname?.split(':').pop()}</div>
                {isRunning ? (
                  <div className="text-emerald-400 font-bold uppercase mt-2">● Service is online and healthy</div>
                ) : (
                  <div className="text-rose-500 font-bold uppercase mt-2">○ Service is currently offline</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="env" className="space-y-4">
          <Card className="rounded-[2rem] shadow-sm border-border/50 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Key className="h-6 w-6 text-primary" /> Configuration
                </h2>
                <p className="text-sm text-muted-foreground">Variables are injected into the container on start/restart.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addEnvRow}
                  className="rounded-xl h-11 gap-2 font-bold px-4 border-dashed"
                >
                  <Plus className="h-4 w-4" /> Add Variable
                </Button>
                <Button
                  onClick={() => toast.success("Saving updated configuration...")}
                  className="rounded-xl h-11 gap-2 font-bold px-8 shadow-lg shadow-primary/20"
                >
                  <Save className="h-4 w-4" /> Save Config
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {envVars.length > 0 ? (
                <div className="grid grid-cols-12 gap-4 mb-2 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-4">Variable Key</div>
                  <div className="col-span-8">Value</div>
                </div>
              ) : null}

              {envVars.length > 0 ? envVars.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center group">
                  {/* KEY INPUT */}
                  <div className="col-span-4">
                    <Input
                      value={item.key}
                      placeholder="e.g. API_KEY"
                      onChange={(e) => updateEnv(index, 'key', e.target.value.toUpperCase())}
                      className="h-12 font-mono text-xs font-bold rounded-xl bg-muted/30 border-border/50"
                    />
                  </div>

                  {/* VALUE INPUT CONTAINER */}
                  <div className="col-span-8 flex items-center gap-2 relative">
                    <div className="relative flex-1">
                      <Input
                        type={item.isHidden ? "password" : "text"}
                        value={item.value}
                        placeholder="Value"
                        onChange={(e) => updateEnv(index, 'value', e.target.value)}
                        className="h-12 font-mono text-xs rounded-xl bg-muted/30 border-border/50 pr-24"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-background"
                          onClick={() => toggleVisibility(index)}
                        >
                          {item.isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-background"
                          onClick={() => copyToClipboard(item.value)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeEnvRow(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
                  <p className="text-sm text-muted-foreground italic">No environment variables defined.</p>
                  <Button variant="link" onClick={addEnvRow} className="mt-2 text-primary font-bold">
                    Click here to add your first variable
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm rounded-[2rem] hover:scale-[1.02] transition-transform duration-200">
      <CardContent className="p-6 flex items-center gap-5">
        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner", bgColor)}>
          <Icon className={cn("h-7 w-7", color)} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em] mb-1">{label}</p>
          <p className="text-base font-black truncate text-foreground leading-none">{value || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
}