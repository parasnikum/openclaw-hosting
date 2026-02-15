import { useState, useEffect } from 'react';
import { Clock, User, AlertCircle, Mail, DollarSign, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PendingOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/billing/orders/pending`, { credentials: "include" });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Pending Orders</h1>
          <p className="text-sm text-muted-foreground font-medium">Invoices awaiting payment fulfillment.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-black text-amber-500 uppercase">{orders.length} Awaiting Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-card/40 backdrop-blur-md border-border/50 p-5 hover:border-amber-500/40 transition-all group rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-none mb-1.5 uppercase tracking-tight">{order.service_name}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <User className="h-3 w-3" /> {order.username}
                    <span className="opacity-30">•</span>
                    <Mail className="h-3 w-3" /> {order.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 opacity-60">Total Due</p>
                  <p className="text-2xl font-black text-foreground tracking-tighter">${order.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl border-border/50 font-bold text-xs h-10 px-5 hover:bg-primary/5">
                    View Invoice
                  </Button>
                  <Button className="rounded-xl shadow-lg shadow-primary/20 font-bold text-xs h-10 px-5">
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {!loading && orders.length === 0 && (
          <div className="py-20 text-center bg-muted/5 rounded-3xl border border-dashed border-border/50">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No pending orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}