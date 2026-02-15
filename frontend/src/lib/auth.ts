// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const isAuthenticated = (): boolean => {
  const token = Cookies.get("jwt");

  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      Cookies.remove("jwt"); // ✅ fixed cookie name
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const isAdmin = (): boolean => {
  const token = Cookies.get("jwt");

  if (!token) return false;

  try {
    const decoded: { exp: number; role: string } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      Cookies.remove("jwt"); // ✅ fixed cookie name
      return false;
    }
    return decoded.role === "Admin";
  } catch {
    return false;
  }
};
