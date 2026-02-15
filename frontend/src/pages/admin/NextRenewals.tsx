import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ArrowUpRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NextRenewals() {
  const [renewals, setRenewals] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/billing/renewals/upcoming`, { credentials: "include" })
      .then(res => res.json())
      .then(setRenewals);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Next Renewals</h1>
        <p className="text-sm text-muted-foreground font-medium">Services expiring within the next 30 days.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {renewals.map((r) => (
          <Card key={r.id} className="bg-card/40 backdrop-blur-sm border-border/50 p-6 rounded-[2rem] overflow-hidden relative group">
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <RefreshCw className="h-32 w-32 rotate-12" />
            </div>

            <div className="space-y-4 relative">
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                  {r.plan_name}
                </div>
                <div className="text-right">
                  <p className="text-xl font-black tracking-tighter">${r.price}</p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">{r.duration}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-tight truncate">{r.service_name}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-muted-foreground">
                   <UserIcon className="h-3 w-3" /> {r.username}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">{new Date(r.renewal_date).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}