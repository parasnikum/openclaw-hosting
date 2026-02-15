import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false); // Track suspension state
  
  const location = useLocation();
  const auth = isAuthenticated();

  useEffect(() => {
    const validateUser = async () => {
      // 1. If no local auth session exists, stop immediately
      if (!auth) {
        setIsValidating(false);
        return;
      }

      const authToken = Cookies.get("jwt");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me?token=${authToken}`,
          { 
            method: "GET", 
            credentials : "include" 
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const user = await res.json();

        // 2. Handle Suspension (The Loop Breaker)
        if (user.is_suspended) {
          setIsSuspended(true);
          setIsAuthorized(false);
          toast.error("Account suspended. Contact support.");
          // Optional: Clear local cookies here if you want them logged out
          // Cookies.remove("jwt");
        } 
        // 3. Handle Admin Requirements
        else if (requireAdmin && user.role !== "Admin") {
          setIsAuthorized(false);
          toast.error("Admin access required.");
        } 
        // 4. Success
        else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateUser();
  }, [auth, requireAdmin]);

  // --- RENDERING LOGIC ---

  // 1. Show nothing or a spinner while the API is talking
  if (isValidating) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // 2. Not logged in at all
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in, but the account is suspended
  // We render a message instead of a redirect to break the infinite loop
  if (isSuspended) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-red-600">Account Suspended</h1>
        <p className="mt-2 text-gray-600">Please contact the administrator for support.</p>
        <button 
          onClick={() => { Cookies.remove("jwt"); window.location.href = "/login"; }}
          className="mt-4 text-blue-500 underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // 4. Logged in, but lacks permissions (e.g., not an Admin)
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // 5. Everything is fine
  return <Outlet />;
};

export default ProtectedRoute;