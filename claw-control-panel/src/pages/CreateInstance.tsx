import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Cpu, CreditCard, Loader2,
  CheckCircle2, Box, Key, Zap, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRazorpay } from "react-razorpay";

export default function CreateInstance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const { Razorpay } = useRazorpay();

  const [formData, setFormData] = useState({
    name: '',
    selectedPlanId: '',
    aiProvider: 'openai',
    aiApiKey: '',
  });

  // Fetch plans on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/plans/public/all`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        const openclawPlans = data.filter((p: any) => p.category === 'Openclaw');
        setAvailablePlans(openclawPlans);
      })
      .catch(() => toast.error("Failed to fetch infrastructure plans"));
  }, []);

  const selectedPlan = availablePlans.find(p => p.id === formData.selectedPlanId);

  // Helper to create order on backend
  const createOrder = async (amount: number, currency: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, currency })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to create order");
      return data.id; // Return the order_id directly
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // Helper to open Razorpay modal
  const initiatePayment = (amount: number, currency: string, orderId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!Razorpay) {
        return reject(new Error("Razorpay SDK not loaded"));
      }

      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: currency,
        name: formData.name,
        description: `Instance Deployment: ${formData.name}`,
        order_id: orderId, 
        handler: (response: any) => {
          resolve(response); 
        },
        modal: {
          ondismiss: () => reject(new Error("Payment window closed")),
        },
        prefill: {
          name: "BerryBox User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: { color: "#F37254" },
      };

      const razorpayInstance = new (Razorpay as any)(options);
      razorpayInstance.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      // 1. Create Order on Backend (use real plan price)
      const price = Number(selectedPlan.price);
      const generatedOrderId = await createOrder(price, "INR");

      // 2. Open Razorpay Modal and wait for success
      const paymentResponse = await initiatePayment(price, "INR", generatedOrderId);

      // 3. Finalize service creation
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          service_name: formData.name,
          plan_id: formData.selectedPlanId,
          payment_mode: "razorpay",
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          config: {
            env: {
              provider: formData.aiProvider,
              key: formData.aiApiKey,
            },
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Payment Verified! Provisioning Instance...");
        setTimeout(() => navigate('/instances'), 2000);
      } else {
        toast.error(result.msg || "Service creation failed");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Transaction aborted");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className={cn("h-1.5 w-16 rounded-full transition-all", step >= 1 ? "bg-primary" : "bg-muted")} />
        <div className={cn("h-1.5 w-16 rounded-full transition-all", step >= 2 ? "bg-primary" : "bg-muted")} />
      </div>

      <Card className="border-border/40 shadow-2xl bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 md:p-12">
          {step === 1 ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Box className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Openclaw Deployment</h1>
                  <p className="text-sm text-muted-foreground italic">Setup your AI-powered automation engine.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black text-primary tracking-widest ml-1">Instance Name</Label>
                    <Input
                      placeholder="e.g. Finance-Agent-01"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                    />
                  </div>

                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 shadow-inner">
                    <Label className="text-[10px] uppercase font-black flex items-center gap-2 tracking-widest">
                      <Cpu className="h-3.5 w-3.5 text-primary" /> AI Brain Config
                    </Label>
                    <Select value={formData.aiProvider} onValueChange={(v) => setFormData({ ...formData, aiProvider: v })}>
                      <SelectTrigger className="bg-background h-11 border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">Openai</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="anthropic">Antropic</SelectItem>
                        <SelectItem value="openrouter">Openrouter</SelectItem>
                        <SelectItem value="vercel-ai-gateway">Vercel Ai Gateway</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Secret API Access Key"
                        value={formData.aiApiKey}
                        onChange={(e) => setFormData({ ...formData, aiApiKey: e.target.value })}
                        className="bg-background h-11 pl-10 border-border/50 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-primary tracking-widest ml-1">Compute Infrastructure</Label>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {availablePlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setFormData({ ...formData, selectedPlanId: plan.id })}
                        className={cn(
                          "p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group",
                          formData.selectedPlanId === plan.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/50 bg-background/30 hover:border-primary/30"
                        )}
                      >
                        <div>
                          <div className="text-sm font-black group-hover:text-primary transition-colors">{plan.plan_name}</div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">{plan.duration}</p>
                        </div>
                        <div className="text-lg font-black text-foreground">${plan.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl"
                disabled={!formData.name || !formData.selectedPlanId || !formData.aiApiKey}
                onClick={() => setStep(2)}
              >
                Proceed to Verification <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Checkout Summary</h2>
              </div>

              <div className="rounded-[2.5rem] bg-muted/20 p-8 border border-border/50 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Instance</span>
                  <span className="font-bold text-lg">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Compute Tier</span>
                  <span className="font-bold">{selectedPlan?.plan_name}</span>
                </div>
                <div className="pt-6 border-t border-border/50 flex justify-between items-end">
                  <span className="text-5xl font-black text-primary">${selectedPlan?.price}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setStep(1)} disabled={isProcessing}>
                  Modify
                </Button>
                <Button
                  className="flex-[2] h-14 rounded-2xl font-black text-lg"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                >
                  {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : "Deploy & Pay Now"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}