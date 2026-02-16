import { useEffect, useState } from 'react';
import { User, Shield, Palette, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import { toast } from 'sonner'; // Ensure you have sonner or change to your toast library

type Section = 'profile' | 'security' | 'appearance' | 'notifications';

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Section>('profile');
  const [profile, setProfile] = useState({ email: '', fname: '', lname: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const menuItems = [
    { id: 'profile' as Section, label: 'Profile', icon: User },
    { id: 'security' as Section, label: 'Security', icon: Shield },
    { id: 'appearance' as Section, label: 'Appearance', icon: Palette },
  ];

  const authToken = Cookies.get("jwt") || "" ;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me?token=${authToken}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data) {
          setProfile({ email: data.email, fname: data.first_name, lname: data.last_name });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [authToken]);

  // 1. Save Profile Function
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile?token=${authToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.fname,
          last_name: profile.lname,
          email: profile.email
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Update Password Function
  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password?token=${authToken}`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      if (res.ok) {
        toast.success("Password updated successfully");
        setPasswords({ current: '', new: '', confirm: '' }); // Clear inputs
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id === 'firstName' ? 'fname' : id === 'lastName' ? 'lname' : id]: value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your personal and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 max-w-2xl">
          {activeTab === 'profile' && (
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={profile.fname} onChange={handleInputChange} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={profile.lname} onChange={handleInputChange} className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile.email} onChange={handleInputChange} className="bg-background" />
                </div>
                {/* <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 rounded-xl">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile
                </Button> */}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input 
                        type="password" 
                        value={passwords.current} 
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input 
                        type="password" 
                        value={passwords.new} 
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input 
                        type="password" 
                        value={passwords.confirm} 
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={isSaving} 
                    variant="secondary" 
                    className="rounded-xl"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Switch between light and dark themes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Interface Theme</Label>
                  <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                    <SelectTrigger className="w-full rounded-xl bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">Follow System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}