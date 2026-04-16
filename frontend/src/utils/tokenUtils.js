import { jwtDecode } from "jwt-decode";

export const tokenUtils = {
  // Get token from localStorage
  getToken: () => localStorage.getItem("token"),

  // Set token in localStorage
  setToken: (token) => localStorage.setItem("token", token),

  // Clear token from localStorage
  clearToken: () => localStorage.removeItem("token"),

  // Decode token and return payload
  decodeToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  },

  // Get user info from token
  getUserInfo: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      return null;
    }
  },
};
