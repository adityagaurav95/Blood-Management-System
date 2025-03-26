import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaCalendarCheck, FaCalendarPlus, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // For development, use mock data
        if (API_URL.includes('localhost')) {
          // Generate mock appointment data
          const mockAppointments = [
            {
              id: 'apt-1',
              donorId: 'user-1',
              donorName: 'John Doe',
              donorEmail: 'john@example.com',
              donorPhone: '555-123-4567',
              donorBloodType: 'O+',
              date: '2023-06-15',
              time: '10:00 AM',
              centerName: 'Downtown Blood Center',
              centerAddress: '123 Main St, Downtown',
              status: 'pending',
              notes: 'First time donor'
            },
            {
              id: 'apt-2',
              donorId: 'user-2',
              donorName: 'Jane Smith',
              donorEmail: 'jane@example.com',
              donorPhone: '555-987-6543',
              donorBloodType: 'A-',
              date: '2023-06-16',
              time: '2:30 PM',
              centerName: 'Westside Medical Center',
              centerAddress: '456 Oak Ave, West Side',
              status: 'confirmed',
              notes: ''
            },
            {
              id: 'apt-3',
              donorId: 'user-4',
              donorName: 'Emily Davis',
              donorEmail: 'emily@example.com',
              donorPhone: '555-234-5678',
              donorBloodType: 'B+',
              date: '2023-06-18',
              time: '9:15 AM',
              centerName: 'Downtown Blood Center',
              centerAddress: '123 Main St, Downtown',
              status: 'pending',
              notes: 'Has donated twice before'
            },
            {
              id: 'apt-4',
              donorId: 'user-5',
              donorName: 'Michael Wilson',
              donorEmail: 'michael@example.com',
              donorPhone: '555-876-5432',
              donorBloodType: 'O-',
              date: '2023-06-20',
              time: '11:45 AM',
              centerName: 'Eastside Health Clinic',
              centerAddress: '789 Pine Rd, East Side',
              status: 'completed',
              notes: ''
            },
            {
              id: 'apt-5',
              donorId: 'user-1',
              donorName: 'John Doe',
              donorEmail: 'john@example.com',
              donorPhone: '555-123-4567',
              donorBloodType: 'O+',
              date: '2023-06-25',
              time: '3:00 PM',
              centerName: 'Downtown Blood Center',
              centerAddress: '123 Main St, Downtown',
              status: 'cancelled',
              notes: 'Cancelled due to illness'
            }
          ];
          
          setAppointments(mockAppointments);
        } else {
          // In production, fetch from API
          const response = await axios.get(`${API_URL}/admin/appointments`);
          setAppointments(response.data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [API_URL]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      
      // For development
      if (API_URL.includes('localhost')) {
        // Mock status update
        setAppointments(
          appointments.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: newStatus }
              : apt
          )
        );
        console.log(`Mock update appointment ${appointmentId} to ${newStatus}`);
      } else {
        // Real API call
        await axios.patch(`${API_URL}/admin/appointments/${appointmentId}`, { status: newStatus });
        
        // Update local state
        setAppointments(
          appointments.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: newStatus }
              : apt
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search term and status filter
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.donorBloodType && apt.donorBloodType.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = statusFilter === 'all' || apt.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Manage Appointments
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/admin/appointments/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaCalendarPlus className="-ml-1 mr-2 h-5 w-5" />
            Create Appointment
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="relative flex-1 min-w-0 mr-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by donor name, email, blood type, or center"
            />
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <FaFilter className="mr-2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {apt.donorName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{apt.donorName}</div>
                              <div className="text-sm text-gray-500">{apt.donorEmail}</div>
                              <div className="text-sm text-gray-500">Blood Type: {apt.donorBloodType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(apt.date)}</div>
                          <div className="text-sm text-gray-500">{apt.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{apt.centerName}</div>
                          <div className="text-sm text-gray-500">{apt.centerAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            apt.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : apt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : apt.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {apt.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(apt.id, 'confirmed')} 
                                className="text-green-600 hover:text-green-900 mr-4"
                              >
                                <FaCheck className="h-5 w-5 inline" /> Approve
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(apt.id, 'cancelled')} 
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTimes className="h-5 w-5 inline" /> Reject
                              </button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <button 
                              onClick={() => handleStatusUpdate(apt.id, 'completed')} 
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <FaCalendarCheck className="h-5 w-5 inline" /> Mark Completed
                            </button>
                          )}
                          <Link 
                            to={`/admin/appointments/${apt.id}`} 
                            className="text-primary hover:text-red-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No appointments found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments; 