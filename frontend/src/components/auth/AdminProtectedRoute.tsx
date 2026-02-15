// src/components/auth/AdminProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin } from "@/lib/auth"; // Using your helper
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const auth = isAuthenticated();
  const localIsAdmin = isAdmin(); 

  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    const validateAdmin = async () => {
      if (!auth) {
        setIsValidating(false);
        return;
      }

      if (!localIsAdmin) {
        setIsValidating(false);
        return;
      }

      const authToken = Cookies.get("jwt");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me?token=${authToken}`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();

        if (user.is_suspended) {
          setIsSuspended(true);
          setIsAuthorized(false);
          toast.error("Account suspended.");
        } else if (user.role !== "Admin") {
          setIsAuthorized(false);
          toast.error("Admin access required.");
        } else {
          setIsAuthorized(true); 
        }
      } catch (err) {
        console.error("Auth validation failed", err);
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAdmin();
  }, [auth, localIsAdmin]);

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!localIsAdmin) {
    return <Navigate to="/" replace />;
  }

  if (isValidating) {
    return <div className="p-8 text-center">Verifying permissions...</div>;
  }

  if (isSuspended) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold text-red-500">Access Denied</h1>
        <p>Your account is suspended. Please contact support.</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;