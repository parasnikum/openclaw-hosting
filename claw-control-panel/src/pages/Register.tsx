import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Zap, ArrowRight, ChevronLeft,
  ShieldCheck, Moon, Sun 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // 1. Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 2. Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });
      console.log(`${import.meta.env.VITE_API_URL}/auth/register`);
      
      const data = await response.json();
      console.log(response);

      if (response.ok) {
        toast.success('Account created! Please check your email to verify.');
        // Redirect to login since user cannot enter dashboard until verified
        navigate('/login');
      } else {
        toast.error(data.msg || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error. Could not reach server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background transition-colors duration-500">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] dark:bg-purple-500/5" />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] dark:bg-primary/5" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-12 w-12 rounded-xl border-border/50 bg-card/80 backdrop-blur-md shadow-lg hover:bg-accent transition-all duration-300"
        >
          {theme === 'light' ? <Moon className="h-5 w-5 text-slate-700" /> : <Sun className="h-5 w-5 text-yellow-500" />}
        </Button>
      </div>

      <div className="w-full max-w-[480px] space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-2">
          <div 
            className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-2 cursor-pointer transition-transform hover:scale-110 group"
            onClick={() => navigate('/login')}
          >
            <Zap className="h-8 w-8 text-primary-foreground fill-current group-hover:animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground font-medium px-4">Join the CloudNode developer network</p>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/70 dark:bg-card/80 rounded-[2rem] overflow-hidden mx-auto">
          <div className="h-1.5 w-full bg-muted/30">
            <div className="h-full bg-primary w-1/3 transition-all duration-500" />
          </div>

          <CardHeader className="space-y-1 pb-4 pt-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Register</CardTitle>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/70">
              Provisioning Instance
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    placeholder="paras_developer" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl text-sm" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="alex@workspace.io" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl text-sm" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl text-sm" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Confirm</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirm" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl text-sm" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2 px-1">
                <Checkbox id="terms" className="h-5 w-5 rounded-md border-border/50" required />
                <Label htmlFor="terms" className="text-[11px] leading-snug text-muted-foreground font-medium cursor-pointer">
                  I accept the <span className="text-primary font-bold hover:underline">Agreement</span> and system <span className="text-primary font-bold hover:underline">Protocol</span>.
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 mt-4" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Initialize Account <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 bg-muted/10 border-t border-border/30 pt-6 pb-8 mt-6">
            <p className="text-center text-xs text-muted-foreground font-medium">
              Already have an active node?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary font-black hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </CardFooter>
        </Card>

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-[0.2em] h-10"
          onClick={() => navigate('/login')}
        >
          <ChevronLeft className="mr-2 h-3 w-3" /> Return to Gateway
        </Button>
      </div>
    </div>
  );
}