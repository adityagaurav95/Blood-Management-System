import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaCalendarCheck, FaTint, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRecipients: 0,
    totalAppointments: 0,
    totalDonations: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For development, use mock data
        if (API_URL.includes('localhost')) {
          // Mock stats data
          const mockStats = {
            totalUsers: 42,
            totalDonors: 32,
            totalRecipients: 10,
            totalAppointments: 25,
            totalDonations: 18,
            pendingAppointments: 7
          };
          
          setStats(mockStats);
        } else {
          // In production, fetch from API
          const response = await axios.get(`${API_URL}/admin/stats`);
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome, {currentUser?.name || 'Administrator'}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<FaUserFriends className="h-6 w-6 text-blue-600" />} 
          detail={`${stats.totalDonors} donors, ${stats.totalRecipients} recipients`}
          linkTo="/admin/users"
          linkText="View all users"
        />
        <StatCard 
          title="Appointments" 
          value={stats.totalAppointments} 
          icon={<FaCalendarCheck className="h-6 w-6 text-green-600" />} 
          detail={`${stats.pendingAppointments} pending approvals`}
          linkTo="/admin/appointments"
          linkText="Manage appointments"
        />
        <StatCard 
          title="Total Donations" 
          value={stats.totalDonations} 
          icon={<FaTint className="h-6 w-6 text-red-600" />} 
          detail="Across all blood types"
          linkTo="/admin/donations"
          linkText="View donation history"
        />
      </div>

      {/* Quick Action Links */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink 
          title="Manage Users" 
          description="View and manage donor and recipient accounts" 
          icon={<FaUserFriends />} 
          to="/admin/users" 
        />
        <QuickLink 
          title="Manage Appointments" 
          description="View and approve pending appointment requests" 
          icon={<FaCalendarCheck />} 
          to="/admin/appointments" 
        />
        <QuickLink 
          title="System Reports" 
          description="View donation statistics and reports" 
          icon={<FaChartLine />} 
          to="/admin/reports" 
        />
      </div>
    </div>
  );
};

// Statistic Card Component
const StatCard = ({ title, value, icon, detail, linkTo, linkText }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
              {detail && <p className="text-sm text-gray-500">{detail}</p>}
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {linkTo && (
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link to={linkTo} className="font-medium text-primary hover:text-red-800">
            {linkText}
          </Link>
        </div>
      </div>
    )}
  </div>
);

// Quick Action Link Component
const QuickLink = ({ title, description, icon, to }) => (
  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
    <div className="flex-shrink-0">
      <div className="h-10 w-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
        <span className="text-primary">{icon}</span>
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <Link to={to} className="focus:outline-none">
        <span className="absolute inset-0" aria-hidden="true"></span>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </Link>
    </div>
  </div>
);

export default AdminDashboard; 