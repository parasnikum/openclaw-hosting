import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

export function DashboardLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
