import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaTint, FaCalendarAlt, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    nextAppointment: null,
    eligibilityStatus: 'Eligible',
    daysUntilNextEligible: 0,
    bloodType: 'O+',
    lastDonation: '2023-07-15'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For development purposes, let's simulate API responses
        // In production, these would be real API calls
        
        // Simulated stats data
        const mockStats = {
          totalDonations: 5,
          nextAppointment: {
            date: '2023-11-15',
            time: '10:30 AM',
            center: 'City Hospital Blood Bank'
          },
          eligibilityStatus: 'Eligible',
          daysUntilNextEligible: 0,
          bloodType: 'O+',
          lastDonation: '2023-07-15'
        };
        
        // Simulated activity data
        const mockActivity = [
          {
            id: 1,
            type: 'donation',
            title: 'Blood Donation Completed',
            description: 'You donated 450ml of blood at City Hospital',
            date: '2023-08-15'
          },
          {
            id: 2,
            type: 'appointment',
            title: 'Appointment Scheduled',
            description: 'You have an upcoming appointment on Sept 5 at Red Cross Center',
            date: '2023-08-10'
          },
          {
            id: 3,
            type: 'notification',
            title: 'Urgent Blood Need',
            description: 'Your blood type is needed urgently at Memorial Hospital',
            date: '2023-08-05'
          }
        ];
        
        // In production, these would be actual API calls:
        // const [statsResponse, activityResponse] = await Promise.all([
        //   axios.get(`${API_URL}/dashboard/stats`),
        //   axios.get(`${API_URL}/dashboard/activity`)
        // ]);
        // setStats(statsResponse.data);
        // setRecentActivity(activityResponse.data);
        
        setStats(mockStats);
        setRecentActivity(mockActivity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_URL]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ item }) => (
    <li className="py-4">
      <div className="flex space-x-3">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          item.type === 'donation' ? 'bg-red-100' : 
          item.type === 'appointment' ? 'bg-blue-100' : 
          item.type === 'notification' ? 'bg-yellow-100' : 'bg-gray-100'
        }`}>
          {item.type === 'donation' && <FaTint className="text-red-600" />}
          {item.type === 'appointment' && <FaCalendarAlt className="text-blue-600" />}
          {item.type === 'notification' && <FaCheckCircle className="text-yellow-600" />}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
          </div>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      </div>
    </li>
  );

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
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {currentUser.displayName || currentUser.email}
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Donations card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTint className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Donations
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.totalDonations}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/donations" className="font-medium text-primary hover:text-red-800">
                View donation history
              </Link>
            </div>
          </div>
        </div>

        {/* Next Appointment card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Next Appointment
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.nextAppointment ? (
                        `${formatDate(stats.nextAppointment.date)}`
                      ) : (
                        'No upcoming appointments'
                      )}
                    </div>
                    {stats.nextAppointment && (
                      <div className="text-sm text-gray-500">
                        {stats.nextAppointment.time} at {stats.nextAppointment.center}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/appointments" className="font-medium text-primary hover:text-red-800">
                Manage appointments
              </Link>
            </div>
          </div>
        </div>

        {/* Eligibility card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaChartLine className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Donation Status
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.eligibilityStatus}
                    </div>
                    {stats.daysUntilNextEligible > 0 && (
                      <div className="text-sm text-gray-500">
                        Eligible again in {stats.daysUntilNextEligible} days
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-red-800">
                Learn about eligibility
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Profile */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Your Blood Profile</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your blood type and donation history.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{stats.bloodType}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Donation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.lastDonation ? formatDate(stats.lastDonation) : 'No previous donations'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Donations</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{stats.totalDonations}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Current Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  stats.eligibilityStatus === 'Eligible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {stats.eligibilityStatus}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
              <FaCalendarAlt className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Link to="/appointments" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true"></span>
              <p className="text-sm font-medium text-gray-900">Schedule Donation</p>
              <p className="text-sm text-gray-500">Book your next appointment</p>
            </Link>
          </div>
        </div>

        <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
              <FaTint className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Link to="/donations" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true"></span>
              <p className="text-sm font-medium text-gray-900">Donation History</p>
              <p className="text-sm text-gray-500">View your past donations</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 