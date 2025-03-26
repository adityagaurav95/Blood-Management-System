import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This component handles protected routes
const PrivateRoute = ({ requireAdmin = false }) => {
  const { currentUser, loading } = useAuth();

  // Wait until auth is loaded
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If route requires admin access but user is not an admin, redirect to dashboard
  if (requireAdmin && !currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the protected component
  return <Outlet />;
};

export default PrivateRoute;