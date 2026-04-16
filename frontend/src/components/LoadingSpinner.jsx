import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
    </div>
  );
}

export function LoadingButton({ loading, children, ...props }) {
  return (
    <button
      disabled={loading}
      className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      {...props}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
      {children}
    </button>
  );
}
