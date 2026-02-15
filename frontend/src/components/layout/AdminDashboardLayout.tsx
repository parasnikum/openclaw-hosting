import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import AdminSidebar from '@/components/admin/Sidebar'; // Adjust path if needed

export function AdminDashboardLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        {/* Main Wrapper: Flex row to put Sidebar and Content side-by-side */}
        <div className="flex min-h-screen w-full bg-background overflow-hidden">
          
          {/* Sidebar: Fixed width, stays on the left */}
          <AdminSidebar />

          {/* Content Area: Occupies remaining space */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            
            {/* Main scrollable area for users, transactions, etc. */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
            
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}