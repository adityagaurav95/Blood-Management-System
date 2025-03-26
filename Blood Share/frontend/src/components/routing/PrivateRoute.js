import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // If the authentication is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated and has the required role
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // If there are children, return them directly
  if (children) {
    return children;
  }

  // Otherwise, render the nested routes
  return <Outlet />;
};

export default PrivateRoute; 