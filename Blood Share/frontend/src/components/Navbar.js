import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userRole, logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                BloodDonate
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link to="/" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              {isAuthenticated && userRole === 'donor' && (
                <Link to="/donor/dashboard" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                  Donor Dashboard
                </Link>
              )}
              {isAuthenticated && userRole === 'recipient' && (
                <Link to="/recipient/dashboard" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                  Recipient Dashboard
                </Link>
              )}
              {isAuthenticated && userRole === 'admin' && (
                <Link to="/admin/dashboard" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-red-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="text-white hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            {isAuthenticated && userRole === 'donor' && (
              <Link to="/donor/dashboard" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                Donor Dashboard
              </Link>
            )}
            {isAuthenticated && userRole === 'recipient' && (
              <Link to="/recipient/dashboard" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                Recipient Dashboard
              </Link>
            )}
            {isAuthenticated && userRole === 'admin' && (
              <Link to="/admin/dashboard" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 