import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <span className="text-primary">⚡</span>
            <span>EV Rental</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link to="/admin" className="hover:text-primary transition">
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === "station_master" && (
                  <Link to="/station" className="hover:text-primary transition">
                    Station Dashboard
                  </Link>
                )}
                {user?.role === "user" && (
                  <>
                    <Link to="/dashboard" className="hover:text-primary transition">
                      My Bookings
                    </Link>
                    <Link to="/bookings" className="hover:text-primary transition">
                      Book Vehicle
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user?.name || "User"}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-danger hover:bg-red-600 px-3 py-2 rounded transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-green-600 px-4 py-2 rounded transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Items */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                {user?.role === "user" && (
                  <>
                    <Link to="/dashboard" className="block hover:text-primary">
                      My Bookings
                    </Link>
                    <Link to="/bookings" className="block hover:text-primary">
                      Book Vehicle
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="block hover:text-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
