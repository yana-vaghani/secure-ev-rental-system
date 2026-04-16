import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Rehydrate on mount from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // Check if token not expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid stored token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
