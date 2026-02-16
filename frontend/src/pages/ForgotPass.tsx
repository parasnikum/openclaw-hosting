import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ChevronLeft, Zap, ShieldQuestion, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSent(true);
        toast.success(data.msg);
      } else {
        toast.error(data.msg || "Request failed");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background transition-colors duration-500">

      {/* Theme Toggle */}
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-12 w-12 rounded-xl border-border/50 bg-card/80 backdrop-blur-md shadow-lg hover:bg-accent transition-all"
        >
          {theme === 'light' ? <Moon className="h-5 w-5 text-slate-700" /> : <Sun className="h-5 w-5 text-yellow-500" />}
        </Button>
      </div>

      <div className="w-full max-w-[400px] space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-2">
            <Zap className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Recovery Portal</h1>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/70 dark:bg-card/80 rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-4 pt-8 text-center">
            <CardTitle className="text-xl">Forgot Password?</CardTitle>
            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/70">
              Identity Verification
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Registered Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@workspace.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Dispatch Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldQuestion className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Check your inbox for the recovery protocol instructions.</p>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate('/login')}>Return to Login</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Button variant="ghost" className="w-full text-muted-foreground text-[10px] font-black uppercase tracking-widest" onClick={() => navigate('/login')}>
          <ChevronLeft className="mr-2 h-3 w-3" /> Back to Gateway
        </Button>
      </div>
    </div>
  );
}