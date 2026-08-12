import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-[#00ff88]/20"></div>
        <div className="text-sm font-tech text-[#00ff88] tracking-widest uppercase animate-pulse">
          INITIALIZING ARENA SECURITY MESH...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};
