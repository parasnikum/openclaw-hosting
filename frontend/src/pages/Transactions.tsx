import { useState, useEffect } from 'react';
import { 
  History, Search, Filter, CheckCircle2, 
  Clock, XCircle, CreditCard, ArrowUpRight, 
  Loader2, Calendar, Copy, Check, Server
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Transaction {
  transaction_id: string;
  service_id: string;
  service_name: string; // From Join
  plan_name: string;    // From Join
  price: number;
  status: 'Paid' | 'Pending' | 'Failed';
  created_at: string;   // Database TIMESTAMP
  payment_mode: string;
  gateway: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/transactions/my`, { 
          credentials: "include" 
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        toast.error("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Transaction ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExactTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true 
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Paid': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'Failed': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-2">
            <History className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Financial Ledger</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">Verify your payments and subscription logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search ID or Service..." 
              className="pl-10 rounded-xl bg-muted/30 border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Summary - Removed Success Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-[2rem] border-border/40 bg-card/40 backdrop-blur-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Expenses</p>
              <p className="text-3xl font-black mt-1">
                ${transactions.reduce((acc, curr) => acc + (curr.status === 'Paid' ? Number(curr.price) : 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-border/40 bg-card/40 backdrop-blur-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pending Orders</p>
              <p className="text-3xl font-black mt-1">{transactions.filter(t => t.status === 'Pending').length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-500 border border-amber-500/10">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.transaction_id}
              className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2.5rem] bg-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "h-14 w-14 rounded-[1.25rem] flex items-center justify-center border transition-all",
                  getStatusStyles(tx.status)
                )}>
                  {tx.status === 'Paid' ? <CheckCircle2 className="h-6 w-6" /> : tx.status === 'Failed' ? <XCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-black text-foreground text-lg">{tx.service_name || 'Service Payment'}</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold px-2 py-0">
                      <Server className="h-3 w-3 mr-1" /> {tx.plan_name || 'Standard Plan'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold uppercase tracking-tighter">
                      <Calendar className="h-3 w-3" /> 
                      {formatExactTime(tx.created_at)} 
                    </div>
                    <div 
                      onClick={() => copyToClipboard(tx.transaction_id)}
                      className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors w-fit"
                    >
                      <span className="font-mono bg-muted/50 px-2 py-0.5 rounded">ID: {tx.transaction_id}</span>
                      {copiedId === tx.transaction_id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 mt-6 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">{tx.gateway || 'Razorpay'}</p>
                  <div className="flex items-center md:justify-end gap-2">
                    <p className="text-2xl font-black text-foreground">${tx.price}</p>
                    <Badge className={cn("text-[9px] font-black uppercase", getStatusStyles(tx.status))}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/5 rounded-[3rem] border-2 border-dashed border-border/50">
            <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold">No matching transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}