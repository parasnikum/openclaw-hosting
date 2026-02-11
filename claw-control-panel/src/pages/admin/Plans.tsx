import { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Layers, DollarSign, 
  Zap, ShieldCheck, XCircle, Code, Cpu, 
  Workflow, Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Openclaw': return <Workflow className="h-4 w-4 text-red-500" />;
    case 'n8n': return <Workflow className="h-4 w-4 text-pink-500" />;
    case 'Nodejs': return <Terminal className="h-4 w-4 text-green-500" />;
    case 'Python': return <Code className="h-4 w-4 text-blue-500" />;
    default: return <Layers className="h-4 w-4 text-primary" />;
  }
};

const emptyPlan = {
  plan_name: '',
  price: '',
  duration: 'Monthly',
  category: 'Nodejs',
  status: 'Active',
  config: [
    { key: 'cpu', value: '1', unit: 'Cores' },
    { key: 'ram', value: '1024', unit: 'MB' },
    { key: 'disk', value: '10', unit: 'GB' }
  ],
  features: ['24/7 Uptime', 'DDoS Protection']
};

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(emptyPlan);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Plans on Load
  const fetchPlans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/plans/admin/all`, {
        credentials : "include"
      });
      const data = await response.json();
      if (response.ok) setPlans(data);
    } catch (error) {
      toast.error("Failed to load plans");
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // 2. Handle Save (Create or Update)
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const isUpdate = !!currentPlan.id;
      const url = isUpdate 
        ? `${import.meta.env.VITE_API_URL}/plans/update/${currentPlan.id}`
        : `${import.meta.env.VITE_API_URL}/plans/create`;

      // Transform UI config array to PG JSONB object
      const formattedConfig = Object.fromEntries(
        currentPlan.config.map((c: any) => [c.key, `${c.value} ${c.unit}`.trim()])
      );

      const payload = {
        ...currentPlan,
        config: formattedConfig,
        price: parseFloat(currentPlan.price)
      };

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials : "include"
      });

      if (response.ok) {
        toast.success(`Plan ${isUpdate ? 'updated' : 'created'} successfully`);
        setIsEditing(false);
        fetchPlans();
      } else {
        const err = await response.json();
        toast.error(err.msg || "Operation failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Linked services may prevent deletion.")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/plans/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Plan deleted");
        fetchPlans();
      } else {
        const err = await response.json();
        toast.error(err.msg || "Delete failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // 4. Open Edit Modal and Parse JSONB back to UI Array
  const openEdit = (plan: any) => {
    const uiConfig = Object.entries(plan.config || {}).map(([key, val]: any) => {
      const parts = val.split(' ');
      return { key, value: parts[0], unit: parts[1] || '' };
    });
    setCurrentPlan({ ...plan, config: uiConfig });
    setIsEditing(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Tiers</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage deployment configurations and pricing.</p>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentPlan(emptyPlan)} className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" /> New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {currentPlan.id ? 'Update' : 'Configure'} Plan Tier
              </DialogTitle>
              <DialogDescription>Setup pricing, categories, and hardware limits.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Plan Name</Label>
                  <Input placeholder="e.g. n8n Enterprise" value={currentPlan.plan_name} onChange={(e) => setCurrentPlan({...currentPlan, plan_name: e.target.value})} className="rounded-xl h-11 bg-muted/20 border-border/50" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Price ($)</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
                        <Input type="number" value={currentPlan.price} onChange={(e) => setCurrentPlan({...currentPlan, price: e.target.value})} className="pl-9 rounded-xl h-11 bg-muted/20 border-border/50 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Category</Label>
                    <Select value={currentPlan.category} onValueChange={(v) => setCurrentPlan({...currentPlan, category: v})}>
                        <SelectTrigger className="rounded-xl h-11 bg-muted/20 border-border/50 font-semibold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Openclaw">Openclaw</SelectItem>
                            <SelectItem value="n8n">n8n</SelectItem>
                            <SelectItem value="Nodejs">Nodejs</SelectItem>
                            <SelectItem value="Python">Python</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Visibility Status</Label>
                  <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
                    <Button 
                        variant={currentPlan.status === 'Active' ? 'secondary' : 'ghost'} 
                        className={cn("flex-1 rounded-lg text-xs h-9 font-bold", currentPlan.status === 'Active' && "bg-background shadow-sm")}
                        onClick={() => setCurrentPlan({...currentPlan, status: 'Active'})}
                    >Active</Button>
                    <Button 
                        variant={currentPlan.status === 'Inactive' ? 'secondary' : 'ghost'} 
                        className={cn("flex-1 rounded-lg text-xs h-9 font-bold", currentPlan.status === 'Inactive' && "bg-background shadow-sm")}
                        onClick={() => setCurrentPlan({...currentPlan, status: 'Inactive'})}
                    >Inactive</Button>
                  </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Billing Cycle</Label>
                    <Select value={currentPlan.duration} onValueChange={(v) => setCurrentPlan({...currentPlan, duration: v})}>
                        <SelectTrigger className="rounded-xl h-11 bg-muted/20 border-border/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Monthly">Monthly Billing</SelectItem>
                            <SelectItem value="Quarterly">Quarterly Billing</SelectItem>
                            <SelectItem value="Yearly">Yearly Billing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4 pt-2">
                 <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5" /> Hardware Limits (JSONB)
                    </Label>
                    <Button variant="outline" size="sm" onClick={() => {
                        const newConfig = [...currentPlan.config, { key: '', value: '', unit: '' }];
                        setCurrentPlan({...currentPlan, config: newConfig});
                    }} className="h-7 text-[9px] font-black uppercase rounded-lg border-primary/20 hover:bg-primary/5">
                      <Plus className="h-3 w-3 mr-1" /> Add Spec
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentPlan.config.map((cfg: any, i: number) => (
                        <div key={i} className="flex flex-col p-3 rounded-xl bg-muted/10 border border-border/50 relative group hover:border-primary/30 transition-colors">
                            <Input 
                                className="h-6 border-none bg-transparent font-mono text-[9px] uppercase p-0 focus-visible:ring-0 mb-1 text-muted-foreground" 
                                value={cfg.key} 
                                placeholder="KEY"
                                onChange={(e) => {
                                    const nc = [...currentPlan.config];
                                    nc[i].key = e.target.value;
                                    setCurrentPlan({...currentPlan, config: nc});
                                }}
                            />
                            <div className="flex gap-1 items-center">
                                <Input className="h-8 bg-background rounded-lg text-xs font-bold border-border/50" value={cfg.value} placeholder="Value"
                                    onChange={(e) => {
                                        const nc = [...currentPlan.config];
                                        nc[i].value = e.target.value;
                                        setCurrentPlan({...currentPlan, config: nc});
                                    }}
                                />
                                <Input className="h-8 w-16 bg-muted/20 rounded-lg text-[10px] font-black uppercase border-dashed text-center" value={cfg.unit} placeholder="Unit"
                                    onChange={(e) => {
                                        const nc = [...currentPlan.config];
                                        nc[i].unit = e.target.value;
                                        setCurrentPlan({...currentPlan, config: nc});
                                    }}
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {
                                const nc = currentPlan.config.filter((_: any, idx: number) => idx !== i);
                                setCurrentPlan({...currentPlan, config: nc});
                            }} className="h-5 w-5 absolute -top-2 -right-2 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100">
                                <XCircle className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                 <Label className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> Marketing Perks
                 </Label>
                 <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/10 border border-border/50 border-dashed">
                    {currentPlan.features.map((feat: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border border-border/50 shadow-sm animate-in zoom-in-95">
                            <span className="text-xs font-bold text-foreground/80">{feat}</span>
                            <button onClick={() => {
                                const nf = currentPlan.features.filter((_: any, idx: number) => idx !== i);
                                setCurrentPlan({...currentPlan, features: nf});
                            }}><XCircle className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
                        </div>
                    ))}
                    <Input placeholder="+ Add perk" className="w-32 h-8 text-xs border-none bg-transparent focus-visible:ring-0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                    setCurrentPlan({...currentPlan, features: [...currentPlan.features, val]});
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }
                        }}
                    />
                 </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button onClick={handleSave} disabled={isLoading} className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 text-base">
                {isLoading ? "Saving..." : "Confirm & Deploy Tier"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-border/50 hover:border-primary/50 transition-all group shadow-sm bg-card/40 backdrop-blur-sm overflow-hidden rounded-2xl">
             <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50">
                        {getCategoryIcon(plan.category)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none mb-1">{plan.plan_name}</h3>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black text-muted-foreground tracking-tighter">
                            <span className="text-primary/80">{plan.category}</span>
                            <span className="opacity-30">•</span>
                            <span>{plan.duration} Cycle</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-8 md:gap-12">
                    <div className="text-left md:text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5 opacity-60">Price</p>
                        <p className="text-xl font-black text-foreground tracking-tight">${plan.price}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1.5 opacity-60">Visibility</p>
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border",
                            plan.status === 'Active' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>{plan.status}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 border-border/50" onClick={() => openEdit(plan)}>
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-destructive/10 text-destructive/70 hover:bg-destructive/10" onClick={() => handleDelete(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}