import { useState } from 'react';
import {
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const instances = [
  { id: '1', name: 'Production Bot', status: 'running' },
  { id: '2', name: 'Dev Bot', status: 'stopped' },
  { id: '3', name: 'Test Bot', status: 'running' },
];

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const [selectedInstance, setSelectedInstance] = useState(instances[0]);

  const themeIcon = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };
  const handleLogout = () => {
    Cookies.remove('jwt');             // Clear the cookie
    navigate('/login', { replace: true }); // Redirect to login
  };
  return (
    <header className="h-header border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggle}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md  flex items-center justify-center">
            {/* <span className="text-primary-foreground font-semibold text-sm">O</span> */}
            <img src="openclaw.png" alt="BerryBox.cloud Logo" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">BerryBox Cloud</span>
        </div>

        {/* <div className="h-5 w-px bg-border mx-2 hidden sm:block" /> */}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-2 text-sm font-normal">
              <div className={`h-2 w-2 rounded-full ${selectedInstance.status === 'running' ? 'bg-success' : 'bg-muted-foreground'}`} />
              <span className="hidden sm:inline">{selectedInstance.name}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Switch Instance
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {instances.map((instance) => (
              <DropdownMenuItem 
                key={instance.id}
                onClick={() => setSelectedInstance(instance)}
                className="gap-2"
              >
                <div className={`h-2 w-2 rounded-full ${instance.status === 'running' ? 'bg-success' : 'bg-muted-foreground'}`} />
                {instance.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {themeIcon[theme]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
              <Sun className="h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
              <Moon className="h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
              <Monitor className="h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="font-medium text-sm">John Doe</span>
                <span className="text-xs text-muted-foreground">john@example.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="gap-2 text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
