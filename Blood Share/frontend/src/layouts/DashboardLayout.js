import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserAlt, FaTint, FaCalendarAlt, FaSignOutAlt, FaChartLine, FaBars, FaTimes, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = ({ isAdmin = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Define navigation links based on user role
  const navigationLinks = isAdmin ? [
    { to: "/admin", icon: <FaChartLine />, label: "Dashboard" },
    { to: "/admin/users", icon: <FaUsers />, label: "Users" },
    { to: "/admin/appointments", icon: <FaClipboardList />, label: "Appointments" }
  ] : [
    { to: "/dashboard", icon: <FaChartLine />, label: "Dashboard" },
    { to: "/donations", icon: <FaTint />, label: "Donations" },
    { to: "/appointments", icon: <FaCalendarAlt />, label: "Appointments" },
    { to: "/profile", icon: <FaUserAlt />, label: "Profile" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <FaTimes className="h-6 w-6 text-white" />
            </button>
          </div>
          {/* Sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-primary">BloodShare</h1>
              {isAdmin && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Admin</span>}
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationLinks.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon} 
                  label={link.label} 
                  currentPath={location.pathname} 
                />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-primary transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Log out</span>
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary">BloodShare</h1>
              {isAdmin && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Admin</span>}
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationLinks.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon} 
                  label={link.label} 
                  currentPath={location.pathname} 
                />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-primary transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FaBars className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper component for sidebar links
const SidebarLink = ({ to, icon, label, currentPath }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
};

export default DashboardLayout; 