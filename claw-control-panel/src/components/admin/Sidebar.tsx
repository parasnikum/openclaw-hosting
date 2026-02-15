import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Server, Zap, ShieldCheck, 
  Database, History, CreditCard, Settings, LogOut,
  HardDrive, Terminal, RefreshCw, Key, ShieldAlert,
  ChevronRight, Box, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuGroups = [
  {
    group: "Core Fleet",
    items: [
      { name: "Global Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
      { name: "User Directory", icon: Users, path: "/admin/users" },
      { name: "Instance Fleet", icon: Server, path: "/admin/services" },
    ]
  },
  {
    group: "Infrastructure",
    items: [
      { name: "Cluster Nodes", icon: Zap, path: "/admin/nodes" },
      { name: "Hosting Plans", icon: Box, path: "/admin/plans" },
      { name: "System Envs", icon: Key, path: "/admin/envs" },
      { name: "Backup Vaults", icon: Database, path: "/admin/backups" },
    ]
  },
  {
    group: "Financials",
    items: [
      { name: "Transactions", icon: History, path: "/admin/transactions" },
      { name: "Pending Orders", icon: Clock, path: "/admin/orders" },
      { name: "Next Renewals", icon: RefreshCw, path: "/admin/renewals" },
      { name: "Global Invoices", icon: CreditCard, path: "/admin/invoices" },
    ]
  },
  {
    group: "Security",
    items: [
      { name: "Auth Logs", icon: ShieldCheck, path: "/admin/auth-logs" },
      { name: "Global Config", icon: Settings, path: "/admin/settings" },
    ]
  }
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-72 h-screen bg-card/30 backdrop-blur-xl border-r border-border/50 flex flex-col sticky top-0 overflow-hidden">
      {/* Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">BerryBox</h2>
            <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Cloud</p>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-8 pb-10">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "group-hover:text-primary")} />
                      <span className="text-xs font-bold tracking-tight">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-sm mb-3">
          <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-xs">
            PN
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black truncate uppercase tracking-tighter">Paras Nikum</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Root Admin</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl h-10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout Terminal
        </Button>
      </div>
    </div>
  );
}