import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Plus, 
  CreditCard, 
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/instances', icon: Server, label: 'Instances' },
  { to: '/create', icon: Plus, label: 'Create Instance' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const location = useLocation();

  return (
    <>
      {/* MOBILE OVERLAY */}
      {!collapsed && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" 
          onClick={toggle}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out lg:sticky lg:top-header lg:h-[calc(100vh-var(--header-height))]",
          collapsed 
            ? "-translate-x-full lg:translate-x-0 lg:w-[70px]" 
            : "translate-x-0 w-[280px]"
        )}
      >
        <nav className="flex flex-col h-full py-4">
          {/* Mobile Header */}
          <div className={cn(
            "flex items-center px-4 mb-4 lg:hidden",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && <span className="font-bold text-lg">Menu</span>}
            <Button variant="ghost" size="icon" onClick={toggle}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 px-3 space-y-2">
            <TooltipProvider>
              {navItems.map((item) => {
                const isActive = location.pathname === item.to || 
                  (item.to !== '/' && location.pathname.startsWith(item.to));
                
                return (
                  <Tooltip key={item.to} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.to}
                        onClick={() => {
                          if (window.innerWidth < 1024) toggle();
                        }}
                        className={cn(
                          "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                          collapsed ? "justify-center h-10 w-10 p-0 mx-auto" : "px-3 py-2.5 gap-3",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                        
                        <div className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          collapsed ? "w-0 opacity-0" : "w-full opacity-100"
                        )}>
                          {item.label}
                        </div>
                      </NavLink>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" sideOffset={20}>
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Bottom Toggle Button */}
          <div className="hidden lg:block px-3 border-t border-sidebar-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className={cn(
                "w-full text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed ? "justify-center p-0 h-10" : "justify-start px-3"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-xs font-semibold">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}