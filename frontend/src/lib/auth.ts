// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const isAuthenticated = (): boolean => {
  // 1. Get token from cookie (replace 'token' with your actual cookie name)
  const token = Cookies.get("jwt"); 

  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // 2. Check Expiration
    if (decoded.exp < currentTime) {
      // Clean up the expired cookie
      Cookies.remove("token");
      return false;
    }

    return true;
  } catch (error) {
    // If token is malformed
    return false;
  }
};