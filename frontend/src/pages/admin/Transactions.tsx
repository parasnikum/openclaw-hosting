import { useState, useEffect } from 'react';
import { 
  Search, CreditCard, ChevronLeft, ChevronRight, 
  ArrowDownLeft, ArrowUpRight, Hash, Calendar, 
  User as UserIcon, Tag, ExternalLink 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TransactionLogs() {
  const [txs, setTxs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/transactions/all?page=${page}&search=${search}`, { credentials: "include" });
      const data = await res.json();
      setTxs(data.transactions);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch transactions");
    }
  };

  useEffect(() => { fetchTransactions(); }, [page, search]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground font-medium">View system-wide revenue and payment logs.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Order ID or User..." 
            className="pl-10 rounded-xl bg-muted/20 border-border/50 h-11"
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/10">
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Transaction / Order</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">User</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Amount</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Gateway</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {txs.map((tx: any) => (
                <tr key={tx.transaction_id} className="group hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center border",
                        tx.status === 'Paid' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      )}>
                        {tx.status === 'Paid' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs font-mono uppercase truncate w-32">{tx.order_id}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                          <Tag className="h-3 w-3" /> {tx.service_name || 'Add Funds / Other'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/30 border border-border/50">
                      <UserIcon className="h-3 w-3 text-primary" />
                      <span className="text-xs font-bold">{tx.username}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <p className="text-sm font-black text-foreground">${tx.price}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">
                      {tx.gateway || tx.payment_mode}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border",
                      tx.status === 'Paid' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                      tx.status === 'Pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-[10px] font-bold text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-[9px] text-muted-foreground/60 uppercase font-black">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {txs.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground font-medium">No transactions found.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/5">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Audit Log Protected</p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-lg" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold px-4">{page} / {totalPages}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-lg" 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}