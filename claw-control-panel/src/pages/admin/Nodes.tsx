import { useState, useEffect } from 'react';
import {
    Plus, Edit3, Trash2, Server, Globe,
    Activity, XCircle, Cpu, Network, Link2,
    AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const emptyNode = {
    node_id: '',
    max_servers: 50,
    domain: '',
    ip: '',
    port: 8080,
    allowed: true,
    resource_limits: [
        { key: 'cpu', value: '8', unit: 'Cores' },
        { key: 'ram', value: '32768', unit: 'MB' },
        { key: 'disk', value: '500', unit: 'GB' }
    ]
};

export default function AdminNodes() {
    const [nodes, setNodes] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentNode, setCurrentNode] = useState<any>(emptyNode);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNodes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/nodes`, {
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) setNodes(data);
            console.log(data);
            
        } catch (error) {
            toast.error("Failed to fetch node cluster data");
        }
    };

    useEffect(() => { fetchNodes(); }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // FIX 1: Trim the ID and ensure path matches router.patch("/:nodeId")
            const url = isEditMode
                ? `${import.meta.env.VITE_API_URL}/nodes/${currentNode.node_id.trim()}` 
                : `${import.meta.env.VITE_API_URL}/nodes/create`;

            const formattedLimits = Object.fromEntries(
                currentNode.resource_limits.map((r: any) => [r.key, `${r.value} ${r.unit}`.trim()])
            );

            const payload = {
                ...currentNode,
                resource_limits: formattedLimits,
                max_servers: parseInt(currentNode.max_servers),
                port: parseInt(currentNode.port)
            };

            const response = await fetch(url, {
                method: isEditMode ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(payload), // Body should be sent as JSON string
            });

            if (response.ok) {
                toast.success(`Infrastructure ${isEditMode ? 'updated' : 'provisioned'}`);
                setIsEditing(false);
                fetchNodes();
            } else {
                const err = await response.json();
                toast.error(err.msg || "Operation failed");
            }
        } catch (error) {
            toast.error("Backend communication error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(`Permanently decommission node ${id}?`)) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/nodes/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });
            if (res.ok) {
                toast.success("Node removed from cluster");
                fetchNodes();
            } else {
                const err = await res.json();
                toast.error(err.msg || "Decommission failed");
            }
        } catch (error) {
            toast.error("Deletion request failed");
        }
    };

    const openCreate = () => {
        setCurrentNode(emptyNode);
        setIsEditMode(false);
        setIsEditing(true);
    };

    const openEdit = (node: any) => {
        const uiLimits = Object.entries(node.resource_limits || {}).map(([key, val]: any) => {
            const parts = (val as string).split(' ');
            return { key, value: parts[0], unit: parts[1] || '' };
        });
        setCurrentNode({ ...node, resource_limits: uiLimits });
        setIsEditMode(true);
        setIsEditing(true);
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin: Manage Nodes</h1>
                    <p className="text-sm text-muted-foreground italic">Cluster-wide hardware management.</p>
                </div>

                <Dialog open={isEditing} onOpenChange={(open) => {
                    setIsEditing(open);
                    if(!open) setIsEditMode(false); // FIX 2: Reset mode on close
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate} className="rounded-xl shadow-lg">
                            <Plus className="h-4 w-4 mr-2" /> Register Node
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl rounded-3xl bg-card/95 backdrop-blur-xl border-border/50">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Server className="h-5 w-5 text-primary" /> {isEditMode ? 'Update' : 'Register'} Node
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                            <div className="space-y-4 md:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black ml-1">Node ID</Label>
                                        <Input
                                            disabled={isEditMode} // FIX 3: Primary key should not change
                                            placeholder="node-01"
                                            value={currentNode.node_id}
                                            onChange={(e) => setCurrentNode({ ...currentNode, node_id: e.target.value })}
                                            className="rounded-xl bg-muted/20 border-border/50 font-mono uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black ml-1">Max Capacity</Label>
                                        <Input type="number" value={currentNode.max_servers} onChange={(e) => setCurrentNode({ ...currentNode, max_servers: e.target.value })} className="rounded-xl bg-muted/20 border-border/50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[10px] uppercase font-black ml-1">IP Address</Label>
                                        <div className="relative">
                                            <Network className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="192.168.1.1" value={currentNode.ip} onChange={(e) => setCurrentNode({ ...currentNode, ip: e.target.value })} className="pl-9 rounded-xl bg-muted/20 border-border/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black ml-1">Port</Label>
                                        <Input type="number" value={currentNode.port} onChange={(e) => setCurrentNode({ ...currentNode, port: e.target.value })} className="rounded-xl bg-muted/20 border-border/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black ml-1">Domain</Label>
                                    <Input placeholder="node.BerryBox.host" value={currentNode.domain} onChange={(e) => setCurrentNode({ ...currentNode, domain: e.target.value })} className="rounded-xl bg-muted/20 border-border/50" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card className="border-border/50 bg-muted/10 p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold">Node Allowed</Label>
                                        <Switch checked={currentNode.allowed} onCheckedChange={(v) => setCurrentNode({ ...currentNode, allowed: v })} />
                                    </div>
                                    <div className={cn("p-3 rounded-xl border flex items-center gap-3", currentNode.allowed ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                                        {currentNode.allowed ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{currentNode.allowed ? 'Ready' : 'Locked'}</span>
                                    </div>
                                </Card>
                            </div>

                            <div className="md:col-span-3 space-y-4 pt-2">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                    <Label className="text-[10px] uppercase font-black text-primary flex items-center gap-2"><Cpu className="h-3.5 w-3.5" /> Hardware Limits</Label>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentNode({ ...currentNode, resource_limits: [...currentNode.resource_limits, { key: '', value: '', unit: '' }] })} className="h-7 text-[9px] font-black uppercase">Add Limit</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {currentNode.resource_limits.map((lim: any, i: number) => (
                                        <div key={i} className="flex flex-col p-3 rounded-xl bg-muted/10 border border-border/50 relative group">
                                            <Input className="h-6 border-none bg-transparent font-mono text-[9px] uppercase p-0 mb-1" value={lim.key} placeholder="KEY" onChange={(e) => {
                                                const nl = [...currentNode.resource_limits]; nl[i].key = e.target.value; setCurrentNode({ ...currentNode, resource_limits: nl });
                                            }} />
                                            <div className="flex gap-1 items-center">
                                                <Input className="h-8 bg-background rounded-lg text-xs font-bold border-border/50" value={lim.value} placeholder="0" onChange={(e) => {
                                                    const nl = [...currentNode.resource_limits]; nl[i].value = e.target.value; setCurrentNode({ ...currentNode, resource_limits: nl });
                                                }} />
                                                <Input className="h-8 w-16 bg-muted/20 rounded-lg text-[10px] font-black uppercase text-center" value={lim.unit} placeholder="UNIT" onChange={(e) => {
                                                    const nl = [...currentNode.resource_limits]; nl[i].unit = e.target.value; setCurrentNode({ ...currentNode, resource_limits: nl });
                                                }} />
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setCurrentNode({ ...currentNode, resource_limits: currentNode.resource_limits.filter((_: any, idx: number) => idx !== i) })} className="h-5 w-5 absolute -top-2 -right-2 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100"><XCircle className="h-3 w-3" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSave} disabled={isLoading} className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20">
                                {isLoading ? "Saving..." : isEditMode ? "Update Node" : "Deploy Node"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node) => (
                    <Card key={node.node_id} className="border-border/50 hover:border-primary/40 transition-all bg-card/40 rounded-3xl overflow-hidden shadow-sm group">
                        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Server className="h-5 w-5" /></div>
                                <CardTitle className="text-sm font-bold font-mono uppercase">{node.node_id}</CardTitle>
                            </div>
                            <div className={cn("h-2 w-2 rounded-full", node.allowed ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest"><Activity className="h-3 w-3 inline mr-1" /> Slots</p>
                                    <p className="text-sm font-bold">{node.allocated_servers} / {node.max_servers}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest"><Link2 className="h-3 w-3 inline mr-1" /> Address</p>
                                    <p className="text-sm font-bold font-mono">{node.ip}:{node.port}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {Object.entries(node.resource_limits || {}).slice(0, 2).map(([k, v]: any) => (
                                        <span key={k} className="px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 text-[8px] font-black uppercase text-muted-foreground">{v}</span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10" onClick={() => openEdit(node)}><Edit3 className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive/70" onClick={() => handleDelete(node.node_id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}