import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaTint, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // For development/mock environment
        if (API_URL.includes('localhost')) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Generate mock donations data
          const mockDonations = [
            {
              id: 'don-1',
              date: '2023-04-15',
              center: 'Downtown Blood Center',
              units: 1,
              bloodType: currentUser.bloodType || 'O+',
              status: 'completed',
              notes: 'Regular donation'
            },
            {
              id: 'don-2',
              date: '2023-05-20',
              center: 'Westside Medical Center',
              units: 1,
              bloodType: currentUser.bloodType || 'O+',
              status: 'completed',
              notes: 'Plasma donation'
            },
            {
              id: 'don-3',
              date: '2023-06-25',
              center: 'Downtown Blood Center',
              units: 1,
              bloodType: currentUser.bloodType || 'O+',
              status: 'completed',
              notes: ''
            }
          ];
          
          setDonations(mockDonations);
        } else {
          // In production, make a real API call
          const response = await axios.get(`${API_URL}/donations`);
          setDonations(response.data);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to load donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [API_URL, currentUser]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Donations
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your donation history and schedule new appointments.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/appointments"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaCalendarPlus className="-ml-1 mr-2 h-5 w-5" />
            Schedule Donation
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {donations.length === 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 text-center">
          <FaTint className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No donations yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any blood donations yet. Schedule your first donation today.
          </p>
          <div className="mt-6">
            <Link
              to="/appointments"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaCalendarPlus className="-ml-1 mr-2 h-5 w-5" />
              Schedule Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <li key={donation.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <FaTint className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(donation.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {donation.center}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right">
                        <div className="text-sm text-gray-900">
                          Blood Type: <span className="font-medium">{donation.bloodType}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Units: {donation.units}
                        </div>
                      </div>
                      <div className="ml-5">
                        <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                          <FaCalendarCheck className="inline-block mr-1" />
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  {donation.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="sm:flex sm:justify-between">
                        <div>Notes: {donation.notes}</div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-8 bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Donation Information</h2>
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            <strong>Blood Type:</strong> {currentUser.bloodType || 'Not specified'}
          </p>
          <p>
            <strong>Total Donations:</strong> {donations.length}
          </p>
          <p>
            <strong>Last Donation:</strong> {donations.length > 0 ? formatDate(donations[0].date) : 'N/A'}
          </p>
          <p>
            <strong>Next Eligible Date:</strong> {donations.length > 0 
              ? formatDate(new Date(new Date(donations[0].date).setDate(new Date(donations[0].date).getDate() + 56))) 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donations; 