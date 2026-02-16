import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Cpu, ShieldCheck, LayoutGrid, Globe, Key, CreditCard, Loader2,
  CheckCircle2, Terminal, Code, Workflow, Box, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'Openclaw', icon: Box, color: 'text-orange-500', desc: 'AI-Powered automation agent' },
  { id: 'n8n', icon: Workflow, color: 'text-pink-500', desc: 'Workflow automation tool' },
  { id: 'Nodejs', icon: Terminal, color: 'text-green-500', desc: 'Javascript runtime environment' },
  { id: 'Python', icon: Code, color: 'text-blue-500', desc: 'General purpose script hosting' },
];

export default function CreateInstance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  
  // State 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    selectedPlanId: '',
    aiProvider: 'openai',
    aiApiKey: '',
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/plans/public/all`,
      {
        credentials : "include"
      }
    )
      .then(res => res.json())
      .then(data => setAvailablePlans(data))
      .catch(() => toast.error("Failed to fetch plans"));
      
  }, []);

  // Filter plans based on chosen category
  const filteredPlans = availablePlans.filter(p => p.category === selectedCategory);
  const selectedPlan = availablePlans.find(p => p.id === formData.selectedPlanId);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          service_name: formData.name,
          plan_id: formData.selectedPlanId,
          config: {
            ai: selectedCategory === 'Openclaw' ? { provider: formData.aiProvider, key: formData.aiApiKey } : null,
            category: selectedCategory
          }
        })
      });

      if (response.ok) {
        toast.success("Payment Successful!");
        navigate('/instances'); // Redirect to success view
      } else {
        toast.error("Transaction Failed");
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 animate-in fade-in duration-500">
      
      {/* 1. STEP INDICATOR */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("h-2 w-12 rounded-full transition-all", step >= i ? "bg-primary" : "bg-muted")} />
          </div>
        ))}
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <Card className="border-border/40 shadow-2xl bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 md:p-12">
          
          {/* PHASE 1: CHOOSE CATEGORY */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Select Technology</h1>
                <p className="text-muted-foreground">Choose the core engine for your new instance.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setStep(2); }}
                    className="flex items-start gap-4 p-6 rounded-3xl border-2 border-border/50 bg-background/50 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <cat.icon className={cn("h-6 w-6", cat.color)} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{cat.id}</h3>
                      <p className="text-xs text-muted-foreground leading-snug">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2: NAME & PLAN (All on one page) */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <Button variant="ghost" size="icon" onClick={() => setStep(1)}><ArrowLeft /></Button>
                <div>
                  <h2 className="text-2xl font-black">{selectedCategory} Configuration</h2>
                  <p className="text-sm text-muted-foreground">Setup your specific resource limits and identity.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Identity & Special Config */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black ml-1 text-primary tracking-widest">Instance Identity</Label>
                    <Input 
                      placeholder="e.g. My-First-Instance" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 rounded-xl bg-muted/20 border-border/50"
                    />
                  </div>

                  {selectedCategory === 'Openclaw' && (
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                      <Label className="text-[10px] uppercase font-black flex items-center gap-2"><Cpu className="h-3 w-3"/> AI Brain Requirements</Label>
                      <Select value={formData.aiProvider} onValueChange={(v) => setFormData({...formData, aiProvider: v})}>
                        <SelectTrigger className="bg-background h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                          <SelectItem value="google">Gemini 1.5 Pro</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="password" 
                        placeholder="API Access Key" 
                        value={formData.aiApiKey}
                        onChange={(e) => setFormData({...formData, aiApiKey: e.target.value})}
                        className="bg-background h-10"
                      />
                    </div>
                  )}
                </div>

                {/* Right: Plan Selection */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black ml-1 text-primary tracking-widest">Select Resource Plan</Label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        onClick={() => setFormData({...formData, selectedPlanId: plan.id})}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center",
                          formData.selectedPlanId === plan.id ? "border-primary bg-primary/5 shadow-sm" : "border-border/50"
                        )}
                      >
                        <div className="text-sm font-bold">{plan.plan_name}</div>
                        <div className="text-sm font-black text-primary">${plan.price}</div>
                      </div>
                    ))}
                    {filteredPlans.length === 0 && <p className="text-xs italic text-muted-foreground">No plans found for this category.</p>}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                disabled={!formData.name || !formData.selectedPlanId}
                onClick={() => setStep(3)}
              >
                Go to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* PHASE 3: CHECKOUT */}
          {step === 3 && (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black">Final Review</h2>
              </div>

              <div className="rounded-[2rem] bg-muted/20 p-8 border border-border/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Service</span>
                  <span className="font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Technology</span>
                  <span className="px-3 py-1 bg-background rounded-full text-[10px] font-black uppercase border">{selectedCategory}</span>
                </div>
                <div className="pt-6 border-t flex justify-between items-end">
                  <span className="text-sm font-black uppercase text-muted-foreground">Total to Pay</span>
                  <span className="text-5xl font-black text-primary">${selectedPlan?.price}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setStep(2)}>Modify Order</Button>
                <Button 
                  className="flex-[2] h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/30"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Pay & Provision Instance"}
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
      
      {/* System Note */}
      <p className="text-center text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] opacity-50">
        Secure Deployment Protocol v4.0
      </p>
    </div>
  );
}