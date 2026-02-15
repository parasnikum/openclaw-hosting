import { useState, useEffect } from 'react';
import { Receipt, ChevronLeft, ChevronRight, ExternalLink, Filter, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function GlobalInvoices() {
  const [data, setData] = useState({ invoices: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/billing/invoices/all?page=${page}`, { credentials: "include" })
      .then(res => res.json())
      .then(setData);
  }, [page]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Global Invoices</h1>
          <p className="text-sm text-muted-foreground font-medium">Platform-wide financial audit logs.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="rounded-xl border-border/50 h-10 font-bold text-xs uppercase">
             <Filter className="h-3.5 w-3.5 mr-2" /> Filter
           </Button>
           <div className="flex items-center bg-muted/20 rounded-xl border border-border/50 px-2">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
             <span className="text-[10px] font-black px-3 tabular-nums">{page} / {data.pages}</span>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.min(data.pages, p+1))} disabled={page === data.pages}><ChevronRight className="h-4 w-4" /></Button>
           </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border/50">
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Invoice Ref</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Entity</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Amount</th>
                <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.invoices.map((inv: any) => (
                <tr key={inv.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="p-5">
                    <p className="text-xs font-mono font-bold text-foreground">#{inv.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{inv.service_name}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold text-foreground">{inv.username}</p>
                    <p className="text-[10px] text-muted-foreground font-medium italic">{new Date(inv.expiry_date).toLocaleDateString()}</p>
                  </td>
                  <td className="p-5 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border",
                      inv.status === 'Paid' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>{inv.status}</span>
                  </td>
                  <td className="p-5 text-right">
                    <p className="font-black text-sm tracking-tighter">${inv.price}</p>
                  </td>
                  <td className="p-5 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </Button>
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