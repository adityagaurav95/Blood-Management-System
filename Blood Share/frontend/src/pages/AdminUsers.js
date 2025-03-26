import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaUser, FaUserMd } from 'react-icons/fa';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // For development, use mock data
        if (API_URL.includes('localhost')) {
          // Generate mock user data
          const mockUsers = [
            {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '555-123-4567',
              bloodType: 'O+',
              userType: 'donor',
              registeredDate: '2023-05-01',
              lastDonation: '2023-05-15',
              totalDonations: 3
            },
            {
              id: 'user-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '555-987-6543',
              bloodType: 'A-',
              userType: 'donor',
              registeredDate: '2023-04-10',
              lastDonation: '2023-05-20',
              totalDonations: 1
            },
            {
              id: 'user-3',
              name: 'Dr. Robert Williams',
              email: 'robert@hospital.com',
              phone: '555-456-7890',
              bloodType: null,
              userType: 'admin',
              registeredDate: '2023-01-15',
              lastDonation: null,
              totalDonations: 0
            },
            {
              id: 'user-4',
              name: 'Emily Davis',
              email: 'emily@example.com',
              phone: '555-234-5678',
              bloodType: 'B+',
              userType: 'donor',
              registeredDate: '2023-05-05',
              lastDonation: '2023-06-01',
              totalDonations: 2
            },
            {
              id: 'user-5',
              name: 'Michael Wilson',
              email: 'michael@example.com',
              phone: '555-876-5432',
              bloodType: 'O-',
              userType: 'donor',
              registeredDate: '2023-03-22',
              lastDonation: null,
              totalDonations: 0
            }
          ];
          
          setUsers(mockUsers);
        } else {
          // In production, fetch from API
          const response = await axios.get(`${API_URL}/admin/users`);
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_URL]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    
    if (!confirmDelete) {
      return;
    }
    
    try {
      setLoading(true);
      
      // For development
      if (API_URL.includes('localhost')) {
        // Mock delete
        setUsers(users.filter(user => user.id !== userId));
        console.log(`Mock delete user ${userId}`);
      } else {
        // Real API call
        await axios.delete(`${API_URL}/admin/users/${userId}`);
        
        // Update local state
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term and user type filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.bloodType && user.bloodType.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = userTypeFilter === 'all' || user.userType === userTypeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && users.length === 0) {
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
            Manage Users
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/admin/users/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaUser className="-ml-1 mr-2 h-5 w-5" />
            Create User
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
              placeholder="Search by name, email, phone, or blood type"
            />
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <FaFilter className="mr-2 h-5 w-5 text-gray-400" />
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">All Users</option>
              <option value="donor">Donors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.userType === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.userType === 'admin' ? (
                              <>
                                <FaUserMd className="mr-1 h-3 w-3 mt-0.5" />
                                Admin
                              </>
                            ) : (
                              <>
                                <FaUser className="mr-1 h-3 w-3 mt-0.5" />
                                Donor
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.userType === 'donor' ? (
                            <>
                              <div className="text-sm text-gray-900">
                                Blood Type: <span className="font-medium">{user.bloodType || 'Unknown'}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Donations: <span className="font-medium">{user.totalDonations}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Last Donation: <span className="font-medium">{formatDate(user.lastDonation)}</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.registeredDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/admin/users/${user.id}/edit`} 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FaEdit className="h-5 w-5 inline" /> Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(user.id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="h-5 w-5 inline" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found matching your search criteria.
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

export default AdminUsers; 