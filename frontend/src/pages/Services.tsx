import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Box, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

// Mock Data matching your PG Schema
const servicesData = [
  { id: 'srv_101', name: 'Alpha Bot', user: 'Paras Nikum', plan: 'Premium Node', status: 'Active', category: 'Bot Hosting', date: '2024-02-01' },
  { id: 'srv_102', name: 'Beta API', user: 'John Doe', plan: 'Starter', status: 'Pending', category: 'Web App', date: '2024-02-05' },
  { id: 'srv_103', name: 'Gamma DB', user: 'Alex Smith', plan: 'Enterprise', status: 'Suspended', category: 'Database', date: '2024-01-20' },
];

export default function AdminServices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Services</h1>
          <p className="text-sm text-muted-foreground">Monitor and configure all user deployments.</p>
        </div>
        <Button onClick={() => navigate('/admin/plans/create')} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" /> Create New Plan
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon={Box} label="Total Services" value="128" color="text-blue-500" />
        <QuickStat icon={CheckCircle2} label="Active" value="112" color="text-green-500" />
        <QuickStat icon={Clock} label="Pending" value="12" color="text-orange-500" />
        <QuickStat icon={AlertCircle} label="Suspended" value="4" color="text-destructive" />
      </div>

      {/* Filter Bar */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-3 md:p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by service, user or ID..." 
              className="pl-10 bg-muted/20 border-border/50 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-border/50 gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="rounded-xl border-border/50">
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/50">
              <tr className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                <th className="px-6 py-4">Service Details</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {servicesData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.id} • {item.plan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.user}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status.toLowerCase() as any} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold uppercase">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => navigate(`/services/${item.id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                          <DropdownMenuItem>Suspend Service</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="border-border/50 shadow-sm bg-card">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl bg-muted/50", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}