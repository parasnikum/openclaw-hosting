import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Instances from "@/pages/Instances";
import InstanceDetail from "@/pages/InstanceDetail";
import CreateInstance from "@/pages/CreateInstance";
import Monitoring from "@/pages/Monitoring";
import Billing from "@/pages/Billing";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { CheckoutFailed, CheckoutPending, CheckoutSuccess } from "./pages/CheckoutStatus";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminServiceDetail from "./pages/ServiceId";
import AdminServices from "./pages/Services";
import AdminPlans from "./pages/admin/Plans";
import AdminNodes from "./pages/admin/Nodes";
import AdminDashboard from "./pages/admin/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import TransactionsPage from "./pages/Transactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/instances" element={<Instances />} />
            <Route path="/instances/:id" element={<InstanceDetail />} />
            <Route path="/services" element={<AdminServices />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/nodes" element={<AdminNodes />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/services/:id" element={<AdminServiceDetail />} />
            <Route path="/create" element={<CreateInstance />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failed" element={<CheckoutFailed />} />
            <Route path="/checkout/pending" element={<CheckoutPending />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
