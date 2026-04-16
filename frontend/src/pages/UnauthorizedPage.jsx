import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={64} className="mx-auto text-danger mb-4" />
        <h1 className="text-4xl font-bold text-secondary mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link to="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
