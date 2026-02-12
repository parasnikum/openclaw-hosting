// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = isAuthenticated();
  console.log(auth);
  
  if (!auth) {
    // Redirect to login, saving the attempted URL for later redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log(auth);
  

  // Optional: Role-based check for Admin routes
  if (requireAdmin) {
    const token = localStorage.getItem("token");
    const decoded: any = jwtDecode(token!);
    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />; // Send non-admins back to user dashboard
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;