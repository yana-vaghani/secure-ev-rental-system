import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StationMaster from "./pages/StationMaster.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* User Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<UserDashboard />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute
                    element={<BookingPage />}
                    requiredRole="user"
                  />
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<AdminDashboard />}
                    requiredRole="admin"
                  />
                }
              />

              {/* Station Master Routes */}
              <Route
                path="/station"
                element={
                  <ProtectedRoute
                    element={<StationMaster />}
                    requiredRole="station_master"
                  />
                }
              />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;