import { useState, useEffect } from 'react';
import {
  CalendarClock, History, CreditCard, ArrowRight,
  ShieldCheck, AlertTriangle, Loader2, Zap,
  Copy, Check, Server,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Link } from 'react-router-dom';

export default function Billing() {
  const [services, setServices] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { isLoading: isRzpLoading, Razorpay } = useRazorpay();

  const fetchData = async () => {
    try {
      const [serviceRes, txRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/services/my`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_URL}/billing/transactions/my`, { credentials: "include" })
      ]);

      if (serviceRes.ok) setServices(await serviceRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
    } catch (error) {
      toast.error("Billing synchronization failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getDaysRemaining = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("ID Copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExactTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const handleRenew = async (serviceId: string, planId: string) => {
    if (isRzpLoading || !Razorpay) {
      toast.error("Payment gateway is still loading...");
      return;
    }

    setIsRenewing(serviceId);
    try {
      const orderReq = await fetch(`${import.meta.env.VITE_API_URL}/billing/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ serviceId, planId })
      });
      const orderData = await orderReq.json();

      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Service Renewal",
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyReq = await fetch(`${import.meta.env.VITE_API_URL}/billing/verify-renewal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ...response, serviceId, planId })
          });

          if (verifyReq.ok) {
            toast.success("Renewal Successful!");
            fetchData();
          }
        },
        prefill: { email: "user@example.com" },
        theme: { color: "#3B82F6" }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment initiation failed");
    } finally {
      setIsRenewing(null);
    }
  };

  if (isLoading) return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Billing & Assets</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage recurring subscriptions and check service logs.</p>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-5 py-2 rounded-2xl border transition-all duration-500 shadow-sm",
          services.some(s => getDaysRemaining(s.renewal_date) <= 15)
            ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
            : "bg-green-500/10 border-green-500/20 text-green-600"
        )}>
          {services.some(s => getDaysRemaining(s.renewal_date) <= 15) ? (
            <><AlertTriangle className="h-4 w-4 animate-bounce" /> <span className="text-[10px] font-black uppercase tracking-widest">Action Required</span></>
          ) : (
            <><ShieldCheck className="h-4 w-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Status Healthy</span></>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-2">
            <CalendarClock className="h-4 w-4" /> Active Subscriptions
          </h2>

          <div className="grid gap-4">
            {services.map((service) => {
              const daysLeft = getDaysRemaining(service.renewal_date);
              const isUrgent = daysLeft <= 15;
              const isCritical = daysLeft <= 3;

              return (
                /* REMOVED overflow-hidden FROM CARD TO FIX TOOLTIP CLIPPING */
                <Card key={service.id} className={cn(
                  "relative transition-all duration-300 border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem]",
                  isCritical ? "border-red-500/50" : isUrgent ? "border-amber-500/50" : "hover:border-primary/40"
                )}>
                  <CardContent className="p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "h-14 w-14 rounded-[1.25rem] flex items-center justify-center border shadow-sm transition-transform hover:scale-105",
                          isCritical ? "bg-red-500 text-white shadow-red-500/20" : isUrgent ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-primary/5 text-primary border-primary/20"
                        )}>
                          <Zap className={cn("h-7 w-7", isUrgent && "fill-current")} />
                        </div>
                        <div>
                          <p className="text-xl font-black text-foreground leading-none mb-2">{service.service_name}</p>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                            <span className={cn(
                              "px-3 py-1 rounded-full",
                              isCritical ? "bg-red-500/20 text-red-600" : isUrgent ? "bg-amber-500/20 text-amber-600" : "bg-green-500/10 text-green-600"
                            )}>
                              {daysLeft <= 0 ? "Expired" : `${daysLeft} Days Remaining`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-8 sm:border-l sm:pl-10 border-border/50">
                        <div className="text-right">
                          <p className="text-2xl font-black text-foreground tracking-tighter">${service.price || '0.00'}</p>
                          <p className="text-[9px] uppercase text-muted-foreground font-black tracking-widest opacity-70">Monthly Cycle</p>
                        </div>

                        {daysLeft <= 15 ? (
                          <Button
                            onClick={() => handleRenew(service.id, service.plan_id)}
                            disabled={!!isRenewing || isRzpLoading}
                            className={cn(
                              "rounded-2xl h-12 px-8 font-black transition-all active:scale-95 shadow-lg",
                              isUrgent
                                ? "bg-primary text-primary-foreground shadow-primary/30"
                                : "bg-primary/90 text-primary-foreground"
                            )}
                          >
                            {isRenewing === service.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Renew Now"}
                          </Button>
                        ) : (
                          <TooltipProvider delayDuration={100} skipDelayDuration={0}>
                            <Tooltip>
                              {/* 1. Added asChild and ensured no nested buttons to prevent click conflicts */}
                              <TooltipTrigger asChild>
                                <div
                                  /* 2. Added ontouchstart to help some mobile browsers recognize the hit area */
                                  onTouchStart={(e) => e.currentTarget.focus()}
                                  className="flex items-center gap-2 bg-muted/30 px-5 py-3 rounded-2xl border border-border/50 cursor-help transition-all hover:bg-muted/50 active:bg-muted/80 group relative z-10 select-none"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500 transition-transform group-hover:scale-110" />
                                  <span className="text-[11px] font-black uppercase text-muted-foreground tracking-tight">
                                    Subscription Active
                                  </span>
                                  <Info className="h-3.5 w-3.5 text-primary animate-pulse" />
                                </div>
                              </TooltipTrigger>

                              <TooltipContent
                                side="top"
                                sideOffset={10}
                                /* 3. Added high z-index and fixed pointer events for mobile overlay */
                                className="z-[9999] bg-popover border-border p-4 rounded-2xl shadow-2xl max-w-[240px] animate-in zoom-in-95 pointer-events-auto"
                                /* 4. This ensures the tooltip closes when you tap outside on mobile */
                                onPointerDownOutside={(e) => e.preventDefault()}
                              >
                                <div className="space-y-2">
                                  <p className="text-[11px] leading-relaxed font-bold text-foreground">
                                    Payment Restricted
                                  </p>
                                  <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                                    Renewal is unlocked when your instance has <span className="text-primary font-bold">15 days or less</span> remaining.
                                    Currently you have <span className="text-foreground font-bold">{daysLeft} days</span> of runtime left.
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Transactions</h3>
              <Link to="/transactions" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all group">
                Full Logs <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.transaction_id} className="flex flex-col p-5 rounded-[1.5rem] bg-muted/20 border border-transparent hover:border-border/50 transition-all group shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <Server className="h-3.5 w-3.5" /> {tx.service_name || 'Infrastructure Credit'}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                        {formatExactTime(tx.created_at)}
                      </p>
                    </div>
                    <span className="text-sm font-black text-foreground tracking-tighter">${tx.price}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/10">
                    <button
                      onClick={() => copyToClipboard(tx.transaction_id)}
                      className="flex items-center gap-1.5 text-[8px] font-mono text-muted-foreground hover:text-primary transition-colors"
                    >
                      ID: {tx.transaction_id.slice(0, 12).toUpperCase()}
                      {copiedId === tx.transaction_id ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Copy className="h-2.5 w-2.5" />}
                    </button>
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                      tx.status === 'Paid' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      <div className={cn(
                        "h-1 w-1 rounded-full",
                        tx.status === 'Paid' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 animate-pulse"
                      )} />
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}

              {transactions.length === 0 && (
                <div className="text-center py-12 bg-muted/10 rounded-[2rem] border border-dashed border-border/50 flex flex-col items-center gap-3">
                  <History className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">No activity logged.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}