import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Zap, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return toast.error("Passwords mismatch");
    if (!token) return toast.error("Invalid token");

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });
      if (response.ok) {
        toast.success("Access Restored.");
        navigate('/login');
      } else {
        const data = await response.json();
        toast.error(data.msg || "Reset failed");
      }
    } catch (error) {
      toast.error("Server error.");
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
          className="h-12 w-12 rounded-xl border-border/50 bg-card/80 backdrop-blur-md shadow-lg transition-all"
        >
          {theme === 'light' ? <Moon className="h-5 w-5 text-slate-700" /> : <Sun className="h-5 w-5 text-yellow-500" />}
        </Button>
      </div>

      <div className="w-full max-w-[400px] space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Zap className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Secure Update</h1>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/70 dark:bg-card/80 rounded-[2rem] overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardHeader className="pb-6 pt-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">New Password</CardTitle>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/70">
              Protocol: AES-256 Override
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Cipher</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Cipher</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Credentials"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}