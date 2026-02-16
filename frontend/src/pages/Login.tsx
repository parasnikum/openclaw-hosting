import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Mail, Zap, ArrowRight, Github, Chrome, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedin = await isAuthenticated();
      if (isLoggedin) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully logged in');
        Cookies.set('jwt', data.token, {
          expires: 7,
          secure: true,
          sameSite: 'Lax'
        });
        navigate('/dashboard');
      } else {
        if (response.status === 403) {
          toast.error(data.msg || "Please verify your email.");
        } else {
          toast.error(data.msg || "Invalid credentials");
        }
      }
    } catch (error) {
      toast.error("Could not connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background transition-colors duration-500">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] dark:bg-primary/5" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] dark:bg-blue-500/5" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-11 w-11 rounded-xl border-border/50 bg-card/80 backdrop-blur-md shadow-lg hover:bg-accent transition-all duration-300 group"
        >
          {theme === 'light' ? <Moon className="h-5 w-5 text-slate-700 transition-all group-hover:rotate-12" /> : <Sun className="h-5 w-5 text-yellow-500 transition-all group-hover:rotate-45" />}
        </Button>
      </div>

      <div className="w-full max-w-[400px] space-y-6 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl  flex items-center justify-center mb-2 transform transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate('/')}>
            {/* <Zap className="h-8 w-8 text-primary-foreground fill-current" /> */}
            <img src="Berry_Box_Logo.png" alt="BerryBox Logo" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">BerryBox Cloud</h1>
          <p className="text-sm text-muted-foreground font-medium px-4">Instance Management Portal</p>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/70 dark:bg-card/80 rounded-3xl overflow-hidden mx-auto">
          <div className="h-1.5 w-full bg-primary/20">
             <div className="h-full bg-primary w-full" />
          </div>
          <CardHeader className="space-y-1 pb-4 pt-6">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/70">
              Secure access required
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@berrybox.cloud"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                  {/* FIXED: Added forgot password navigation */}
                  <button 
                    type="button" 
                    onClick={() => navigate('/forgot-password')}
                    className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                  >
                    Forgot Secret?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 h-12 bg-muted/30 border-border/50 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Access Dashboard <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>

            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="bg-card dark:bg-[#1c1c1f] px-3 text-muted-foreground tracking-widest">Sso Gateway</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-11 rounded-xl border-border/50 bg-muted/20 hover:bg-muted/40 font-bold text-[10px] uppercase tracking-widest">
                <Github className="mr-2 h-4 w-4" /> Github
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-border/50 bg-muted/20 hover:bg-muted/40 font-bold text-[10px] uppercase tracking-widest">
                <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
            </div> */}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <p className="text-center text-xs text-muted-foreground font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary font-black hover:underline underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </CardFooter>
        </Card>

        {/* System Status Footer */}
        <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Core Online
          </div>
          <span className="opacity-30">|</span>
          <div className="hover:text-primary transition-colors cursor-help">Internal v2.4.1</div>
        </div>
      </div>
    </div>
  );
}