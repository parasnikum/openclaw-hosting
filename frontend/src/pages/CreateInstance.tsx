import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Cpu, CreditCard, Loader2, Plus,
  CheckCircle2, Box, Key, Zap, ShieldCheck, Trash2,
  MessageSquare, Hash, Shield, Globe, Phone, Users, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRazorpay } from "react-razorpay";
import { SocialIcon } from 'react-social-icons';

export default function CreateInstance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const { Razorpay } = useRazorpay();

  const [formData, setFormData] = useState({
    name: '',
    selectedPlanId: '',
    aiConfigs: [
      { provider: 'openai', apiKey: '' }
    ],
    channels: {
      slack: { enabled: false, mode: 'http', botToken: '', signingSecret: '', appToken: '', webhookPath: '/slack/events' },
      discord: { enabled: false, token: '' },
      telegram: { enabled: false, botToken: '', dmPolicy: 'pairing' },
      whatsapp: { enabled: false, dmPolicy: 'pairing', allowFrom: '', groupAllowFrom: '' }
    }
  });
  const usedProviders = formData.aiConfigs.map(c => c.provider);


  // Validation Logic
  const isFormValid = () => {
    if (!formData.name.trim() || !formData.selectedPlanId) return false;
    if (formData.aiConfigs.some(c => !c.apiKey.trim())) return false;

    const { slack, discord, telegram, whatsapp } = formData.channels;
    if (slack.enabled) {
      if (!slack.botToken.trim()) return false;
      if (slack.mode === 'http' && (!slack.signingSecret.trim() || !slack.webhookPath.trim())) return false;
      if (slack.mode === 'socket' && !slack.appToken.trim()) return false;
    }
    if (discord.enabled && !discord.token.trim()) return false;
    if (telegram.enabled && !telegram.botToken.trim()) return false;
    if (whatsapp.enabled && (!whatsapp.allowFrom.trim() || !whatsapp.groupAllowFrom.trim())) return false;

    return true;
  };

  const addAiConfig = () => {
    const allProviders = ['openai', 'google', 'anthropic', 'openrouter', 'vercel-ai-gateway'];
    // Find the first provider not yet in the list
    const nextProvider = allProviders.find(p => !usedProviders.includes(p));

    if (!nextProvider) {
      toast.error("All available AI providers have been added.");
      return;
    }

    setFormData({
      ...formData,
      aiConfigs: [...formData.aiConfigs, { provider: nextProvider, apiKey: '' }]
    });
  };

  const removeAiConfig = (index: number) => {
    const newConfigs = formData.aiConfigs.filter((_, i) => i !== index);
    setFormData({ ...formData, aiConfigs: newConfigs });
  };

  const updateAiConfig = (index: number, field: 'provider' | 'apiKey', value: string) => {
    const newConfigs = [...formData.aiConfigs];
    newConfigs[index][field] = value;
    setFormData({ ...formData, aiConfigs: newConfigs });
  };

  const toggleChannel = (ch: keyof typeof formData.channels) => {
    setFormData(prev => ({
      ...prev,
      channels: { ...prev.channels, [ch]: { ...prev.channels[ch], enabled: !prev.channels[ch].enabled } }
    }));
  };

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

  const createOrder = async (amount: number, currency: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ amount, currency })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Failed to create order");
    return data.id;
  };

  const initiatePayment = (amount: number, currency: string, orderId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!Razorpay) return reject(new Error("Razorpay SDK not loaded"));
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: formData.name,
        description: `Instance Deployment: ${formData.name}`,
        order_id: orderId,
        handler: (res: any) => resolve(res),
        modal: { ondismiss: () => reject(new Error("Payment window closed")) },
        theme: { color: "#F37254" },
      };
      const rzp = new (Razorpay as any)(options);
      rzp.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      const price = Number(selectedPlan.price);
      const orderId = await createOrder(price, "INR");
      const payment = await initiatePayment(price, "INR", orderId);

      const finalChannels: any = {};
      const { slack, discord, telegram, whatsapp } = formData.channels;

      if (slack.enabled) {
        if (slack.mode === 'http') {
          finalChannels["slack-http"] = { enabled: true, mode: "http", botToken: slack.botToken, signingSecret: slack.signingSecret, webhookPath: slack.webhookPath };
        } else {
          finalChannels["slack-socket"] = { enabled: true, mode: "socket", appToken: slack.appToken, botToken: slack.botToken };
        }
      }
      if (discord.enabled) finalChannels["discord"] = { enabled: true, token: discord.token };
      if (telegram.enabled) finalChannels["telegram"] = { enabled: true, botToken: telegram.botToken, dmPolicy: telegram.dmPolicy, groups: { "*": { requireMention: true } } };
      if (whatsapp.enabled) {
        finalChannels["whatsapp"] = {
          dmPolicy: whatsapp.dmPolicy,
          allowFrom: whatsapp.allowFrom.split(',').map(n => n.trim()),
          groupPolicy: "allowlist",
          groupAllowFrom: whatsapp.groupAllowFrom.split(',').map(n => n.trim())
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          service_name: formData.name,
          plan_id: formData.selectedPlanId,
          payment_mode: "razorpay",
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_signature: payment.razorpay_signature,
          config: { env: { ai_credentials: formData.aiConfigs, channels: finalChannels } },
        })
      });

      if (response.ok) {
        toast.success("Payment Verified! Provisioning...");
        setTimeout(() => navigate('/instances'), 2000);
      } else {
        const err = await response.json();
        toast.error(err.msg || "Creation failed");
      }
    } catch (error: any) {
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
                  <img src="openclaw.png" alt="Openclaw" className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-foreground">Openclaw Deployment</h1>
                  <p className="text-sm text-muted-foreground italic">Setup your AI-powered automation engine.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black text-primary tracking-widest ml-1">Instance Display Name</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Finance-Agent-01"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 pl-10 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <Label className="text-[10px] uppercase font-black flex items-center gap-2 tracking-widest text-primary">
                        <Cpu className="h-3.5 w-3.5" /> AI Brain Configs
                      </Label>
                      <Button variant="ghost" size="sm" onClick={addAiConfig} className="h-7 text-[10px] font-black uppercase bg-primary/5 hover:bg-primary/10">
                        <Plus className="h-3 w-3 mr-1" /> Add Provider
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.aiConfigs.map((config, index) => (
                        <div key={index} className="space-y-1.5 animate-in slide-in-from-left-2">
                          <Label className="text-[9px] font-bold uppercase ml-1 text-muted-foreground">Provider {index + 1}</Label>
                          <div className="flex gap-2 items-center group">
                            <Select value={config.provider} onValueChange={(v) => updateAiConfig(index, 'provider', v)}>
                              <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/50 rounded-lg text-xs font-bold">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                {[
                                  { id: 'openai', label: 'OpenAI' },
                                  { id: 'google', label: 'Google' },
                                  { id: 'anthropic', label: 'Anthropic' },
                                  { id: 'openrouter', label: 'OpenRouter' },
                                  { id: 'vercel-ai-gateway', label: 'Vercel AI' },
                                  { id: 'opencode', label: 'Opencode' },
                                  { id: 'synthetic', label: 'Synthetic' },
                                  { id: 'minimax', label: 'Mini Max' },
                                  { id: 'zai', label: 'Zai' },
                                  { id: 'kimi', label: 'Kimi' },
                                  { id: 'moonshot', label: 'Moonshot' }
                                ].map((opt) => {
                                  // Check if this option is already used in ANOTHER row
                                  const isUsed = usedProviders.includes(opt.id) && config.provider !== opt.id;

                                  if (isUsed) return null; // Hide if already selected elsewhere

                                  return (
                                    <SelectItem key={opt.id} value={opt.id}>
                                      {opt.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <div className="relative flex-1">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <Input
                                type="password" placeholder="Enter API Key" value={config.apiKey}
                                onChange={(e) => updateAiConfig(index, 'apiKey', e.target.value)}
                                className="h-10 pl-9 bg-background/50 border-border/50 rounded-lg text-xs"
                              />
                            </div>
                            {formData.aiConfigs.length > 1 && (
                              <Button variant="ghost" size="icon" onClick={() => removeAiConfig(index)} className="h-10 w-10 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <Label className="text-[10px] uppercase font-black flex items-center gap-2 tracking-widest text-primary">
                      <Zap className="h-3.5 w-3.5" /> Deployment Channels
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['slack', 'discord', 'telegram', 'whatsapp'].map((ch) => (
                        <Button
                          key={ch} variant="outline" size="sm"
                          className={cn("h-12 rounded-xl uppercase font-black text-[10px] gap-3 px-3", formData.channels[ch as keyof typeof formData.channels].enabled ? "border-primary bg-primary/5" : "opacity-50")}
                          onClick={() => toggleChannel(ch as any)}
                        >
                          <SocialIcon
                            network={ch}
                            style={{ height: 20, width: 20 }}
                            fgColor="currentColor"
                            bgColor="transparent"
                          />
                          {ch}
                        </Button>
                      ))}
                    </div>

                    {/* Channel Specific Inputs with Labels */}
                    {formData.channels.slack.enabled && (
                      <div className="p-4 rounded-xl bg-muted/30 space-y-4 animate-in fade-in border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase text-muted-foreground">Slack Settings</span>
                          <div className="flex gap-1">
                            <Button variant={formData.channels.slack.mode === 'http' ? 'default' : 'outline'} size="xs" className="h-6 text-[9px]" onClick={() => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, mode: 'http' } } })}>HTTP</Button>
                            <Button variant={formData.channels.slack.mode === 'socket' ? 'default' : 'outline'} size="xs" className="h-6 text-[9px]" onClick={() => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, mode: 'socket' } } })}>SOCKET</Button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-bold uppercase ml-1">Bot Token (Required)</Label>
                          <Input type="password" placeholder="xoxb-..." value={formData.channels.slack.botToken} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, botToken: e.target.value } } })} className="h-9 text-xs" />
                        </div>
                        {formData.channels.slack.mode === 'http' ? (
                          <>
                            <div className="space-y-1.5">
                              <Label className="text-[9px] font-bold uppercase ml-1">Signing Secret (Required)</Label>
                              <Input type="password" placeholder="Secret" value={formData.channels.slack.signingSecret} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, signingSecret: e.target.value } } })} className="h-9 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[9px] font-bold uppercase ml-1">Webhook Path (Required)</Label>
                              <Input placeholder="/slack/events" value={formData.channels.slack.webhookPath} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, webhookPath: e.target.value } } })} className="h-9 text-xs" />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold uppercase ml-1">App Token (Required)</Label>
                            <Input type="password" placeholder="xapp-..." value={formData.channels.slack.appToken} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, slack: { ...formData.channels.slack, appToken: e.target.value } } })} className="h-9 text-xs" />
                          </div>
                        )}
                      </div>
                    )}

                    {formData.channels.discord.enabled && (
                      <div className="p-4 rounded-xl bg-muted/30 space-y-2 animate-in fade-in border border-border/50">
                        <Label className="text-[9px] font-bold uppercase ml-1">Discord Bot Token (Required)</Label>
                        <Input type="password" placeholder="Enter Discord Token" value={formData.channels.discord.token} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, discord: { ...formData.channels.discord, token: e.target.value } } })} className="h-9 text-xs" />
                      </div>
                    )}

                    {formData.channels.telegram.enabled && (
                      <div className="p-4 rounded-xl bg-muted/30 space-y-2 animate-in fade-in border border-border/50">
                        <Label className="text-[9px] font-bold uppercase ml-1">Telegram Bot Token (Required)</Label>
                        <Input type="password" placeholder="Enter Bot Token" value={formData.channels.telegram.botToken} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, telegram: { ...formData.channels.telegram, botToken: e.target.value } } })} className="h-9 text-xs" />
                      </div>
                    )}

                    {formData.channels.whatsapp.enabled && (
                      <div className="p-4 rounded-xl bg-muted/30 space-y-4 animate-in fade-in border border-border/50">
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-bold uppercase ml-1">Allowed Numbers (Required)</Label>
                          <Input placeholder="918888888888, 917777777777" value={formData.channels.whatsapp.allowFrom} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, whatsapp: { ...formData.channels.whatsapp, allowFrom: e.target.value } } })} className="h-9 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-bold uppercase ml-1">Group Allow List (Required)</Label>
                          <Input placeholder="Group ID, Group ID" value={formData.channels.whatsapp.groupAllowFrom} onChange={(e) => setFormData({ ...formData, channels: { ...formData.channels, whatsapp: { ...formData.channels.whatsapp, groupAllowFrom: e.target.value } } })} className="h-9 text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black text-primary tracking-widest ml-1">Compute Infrastructure</Label>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar font-bold">
                    {availablePlans.map((plan) => (
                      <div
                        key={plan.id} onClick={() => setFormData({ ...formData, selectedPlanId: plan.id })}
                        className={cn("p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group", formData.selectedPlanId === plan.id ? "border-primary bg-primary/5 shadow-md" : "border-border/50 bg-background/30 hover:border-primary/30")}
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
                disabled={!isFormValid()}
                onClick={() => setStep(2)}
              >
                Proceed to Verification <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20"><ShieldCheck className="h-8 w-8 text-primary" /></div>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Checkout Summary</h2>
              </div>
              <div className="rounded-[2.5rem] bg-muted/20 p-8 border border-border/50 space-y-5">
                <div className="flex justify-between items-center"><span className="text-muted-foreground uppercase text-[10px] tracking-widest">Instance</span><span className="font-bold text-lg">{formData.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground uppercase text-[10px] tracking-widest">Compute Tier</span><span className="font-bold text-lg">{selectedPlan?.plan_name}</span></div>
                <div className="pt-6 border-t border-border/50 flex justify-between items-end"><span className="text-5xl font-black text-primary">${selectedPlan?.price}</span></div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setStep(1)} disabled={isProcessing}>Modify Settings</Button>
                <Button className="flex-[2] h-14 rounded-2xl font-black text-lg" disabled={isProcessing} onClick={handlePlaceOrder}>
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