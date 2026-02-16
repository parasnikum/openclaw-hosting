import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Database, Shield, Zap, 
  Terminal, Activity, Plus, Trash2, Cpu, HardDrive 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for editable resources
  const [resources, setResources] = useState([
    { key: 'cpu', value: '2.0 Cores', icon: Cpu },
    { key: 'ram', value: '4096MB', icon: Database },
    { key: 'storage', value: '50GB', icon: HardDrive },
  ]);

  // State for env vars
  const [envVars, setEnvVars] = useState([
    { key: 'NODE_ENV', value: 'production' },
    { key: 'LOG_LEVEL', value: 'verbose' },
    { key: 'DB_CONN', value: 'internal-cluster-01' },
  ]);

  const handleUpdate = () => {
    // Convert back to JSON for the API
    const finalResources = Object.fromEntries(resources.map(r => [r.key, r.value]));
    const finalEnv = Object.fromEntries(envVars.map(e => [e.key, e.value]));
    
    toast.success("Service configuration updated successfully");
  };

  const addField = (type: 'res' | 'env') => {
    if (type === 'res') setResources([...resources, { key: '', value: '', icon: Zap }]);
    else setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeField = (index: number, type: 'res' | 'env') => {
    if (type === 'res') setResources(resources.filter((_, i) => i !== index));
    else setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: 'key' | 'value', val: string, type: 'res' | 'env') => {
    if (type === 'res') {
      const newRes = [...resources];
      newRes[index][field] = val;
      setResources(newRes);
    } else {
      const newEnv = [...envVars];
      newEnv[index][field] = val;
      setEnvVars(newEnv);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border" onClick={() => navigate('/services')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Infrastructure Management</h1>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase border border-primary/20">{id}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium italic">Instance: prod-node-alpha</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button onClick={handleUpdate} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" /> Deploy Changes
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar: Status & Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> Entity Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-primary mb-1">Owner Name</p>
                <p className="text-sm font-bold">Paras Nikum</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-[10px] uppercase font-bold text-primary mb-1">Current Node</p>
                <p className="text-sm font-bold">Aiven-PG-Cluster-01</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/[0.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" /> Force Override
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full text-[11px] font-bold border-destructive/20 hover:bg-destructive/10 text-destructive rounded-lg">
                Suspend Node
              </Button>
              <Button variant="destructive" className="w-full text-[11px] font-bold rounded-lg shadow-md shadow-destructive/10">
                Hard Deletion
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Config Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="resource" className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl w-full md:w-auto mb-4 border border-border/50">
              <TabsTrigger value="resource" className="rounded-lg gap-2 px-6 text-xs font-bold">
                <Zap className="h-3.5 w-3.5" /> Resources
              </TabsTrigger>
              <TabsTrigger value="env" className="rounded-lg gap-2 px-6 text-xs font-bold">
                <Terminal className="h-3.5 w-3.5" /> Environment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resource" className="space-y-4 outline-none">
              <Card className="border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm font-bold">Compute & Storage Allocation</CardTitle>
                        <CardDescription className="text-[11px]">Direct hardware limit overrides for this container.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addField('res')} className="h-8 text-[10px] font-bold uppercase rounded-lg">
                        <Plus className="h-3 w-3 mr-1" /> Add Limit
                    </Button>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((res, i) => (
                      <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl border border-border/50 bg-muted/10 relative group">
                         <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2">
                             {res.icon && <res.icon className="h-3 w-3 text-primary" />} Parameter Name
                         </Label>
                         <div className="flex gap-2">
                            <Input 
                              value={res.key} 
                              onChange={(e) => updateField(i, 'key', e.target.value, 'res')}
                              className="h-9 text-xs font-mono bg-background" 
                            />
                            <Input 
                              value={res.value} 
                              onChange={(e) => updateField(i, 'value', e.target.value, 'res')}
                              className="h-9 text-xs font-bold text-primary bg-background" 
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeField(i, 'res')} className="h-9 w-9 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="env" className="space-y-4 outline-none">
              <Card className="border-border/50 overflow-hidden">
                 <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm font-bold">OS-Level Variables</CardTitle>
                        <CardDescription className="text-[11px]">Injected environment variables for runtime execution.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addField('env')} className="h-8 text-[10px] font-bold uppercase rounded-lg">
                        <Plus className="h-3 w-3 mr-1" /> New Variable
                    </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  {envVars.map((env, i) => (
                    <div key={i} className="flex gap-3 items-end group">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Key</Label>
                        <Input 
                          value={env.key} 
                          onChange={(e) => updateField(i, 'key', e.target.value, 'env')}
                          className="h-10 text-xs font-mono bg-muted/20" 
                        />
                      </div>
                      <div className="flex-[2] space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Value</Label>
                        <Input 
                          value={env.value} 
                          onChange={(e) => updateField(i, 'value', e.target.value, 'env')}
                          className="h-10 text-xs bg-background" 
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeField(i, 'env')} className="h-10 w-10 text-destructive mb-0.5 opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}