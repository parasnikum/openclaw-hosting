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
import Profile from "@/pages/Profile";
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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPass";
import ResetPasswordPage from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import { AdminDashboardLayout } from "./components/layout/AdminDashboardLayout";
import UserManagement from "./pages/admin/Users";
import PendingOrders from "./pages/admin/PendingOrders";
import GlobalInvoices from "./pages/admin/Invoices";
import NextRenewals from "./pages/admin/NextRenewals";
import PrivacyPolicy from "./pages/legal/Privacy";
import RefundPolicy from "./pages/legal/Refund";
import TermsAndConditions from "./pages/legal/TermsAndConditions";

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/instances" element={<Instances />} />
              <Route path="/instances/:id" element={<InstanceDetail />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/services/:id" element={<AdminServiceDetail />} />
              <Route path="/create" element={<CreateInstance />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/failed" element={<CheckoutFailed />} />
              <Route path="/checkout/pending" element={<CheckoutPending />} />
            </Route>
          </Route>
          <Route element={<AdminDashboardLayout />}>

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/nodes" element={<AdminNodes />} />
              <Route path="/admin/plans" element={<AdminPlans />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/transactions" element={<TransactionsPage />} />
              <Route path="/admin/renewals" element={<NextRenewals />} />
              <Route path="/admin/invoices" element={<GlobalInvoices />} />
              <Route path="/admin/orders" element={<PendingOrders />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
