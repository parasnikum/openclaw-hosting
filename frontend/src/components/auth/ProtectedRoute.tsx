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
  const [isSuspended, setIsSuspended] = useState(false);

  const location = useLocation();
  // Ensure we check this state to prevent unnecessary triggers
  const auth = isAuthenticated();

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const validateUser = async () => {
      const authToken = Cookies.get("jwt");

      if (!auth || !authToken) {
        if (isMounted) {
          setIsValidating(false);
          setIsAuthorized(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me?token=${authToken}`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const user = await res.json();

        if (isMounted) {
          if (user.is_suspended) {
            setIsSuspended(true);
            setIsAuthorized(false);
          } else if (requireAdmin && user.role !== "Admin") {
            setIsAuthorized(false);
            toast.error("Admin access required.");
          } else {
            setIsAuthorized(true);
          }
        }
      } catch (err) {
        // If the API fails, the token is likely garbage. 
        // Clear it to prevent the loop.
        Cookies.remove("jwt"); 
        if (isMounted) setIsAuthorized(false);
      } finally {
        if (isMounted) setIsValidating(false);
      }
    };

    validateUser();

    return () => { isMounted = false; };
  }, [auth, requireAdmin]); // Removed navigate from deps to prevent loops

  // 1. Loading State
  if (isValidating) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // 2. Suspended State (Custom UI to stop redirects)
  if (isSuspended) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-red-600">Account Suspended</h1>
        <p className="mt-2 text-gray-600">Please contact support.</p>
        <button
          onClick={() => { Cookies.remove("jwt"); window.location.href = "/login"; }}
          className="mt-4 text-blue-500 underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // 3. Final Check: If not authorized or auth is missing, send to login
  if (!auth || !isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Success
  return <Outlet />;
};

export default ProtectedRoute;