import { useEffect, useState } from 'react';
import { User, Shield, Key, Palette, Bell, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type Section = 'profile' | 'security' | 'appearance' | 'notifications';

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Section>('profile');
  const [profile, setprofile] = useState<{ email: string, fname: string, lname: string }>();
  const menuItems = [
    { id: 'profile' as Section, label: 'Profile', icon: User },
    { id: 'security' as Section, label: 'Security', icon: Shield },
    { id: 'appearance' as Section, label: 'Appearance', icon: Palette },
    // { id: 'notifications' as Section, label: 'Notifications', icon: Bell },
  ];
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "user@example.com",
            }),
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);


  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your personal and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
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

        {/* Content Area */}
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
                    <Input id="firstName" defaultValue="John" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" value={profile.email} className="bg-background" />
                </div>
                <Button className="gap-2 rounded-xl">
                  <Save className="h-4 w-4" /> Save Profile
                </Button>
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
                    <Input type="password" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button variant="secondary" className="rounded-xl">Update Password</Button>
                </div>
                {/* <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Auth</Label>
                    <p className="text-xs text-muted-foreground">Require a code via email.</p>
                  </div>
                  <Switch />
                </div> */}
              </CardContent>
            </Card>
          )}

          {/* {activeTab === 'api' && (
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Secret tokens for external integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Production', 'Development'].map((key) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl border bg-background/50">
                    <div>
                      <p className="text-sm font-bold">{key} Key</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">oc_{key.toLowerCase()}_••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg h-8">Regen</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed rounded-xl">+ Create New Key</Button>
              </CardContent>
            </Card>
          )} */}

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

          {activeTab === 'notifications' && (
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: 'Email Notifications', desc: 'Direct alerts to your inbox.' },
                  { label: 'Instance Status', desc: 'Alert when a bot stops running.' },
                  { label: 'Billing Alerts', desc: 'Warn when balance is low.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}