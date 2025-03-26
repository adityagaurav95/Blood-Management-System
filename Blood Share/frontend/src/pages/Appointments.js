import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHospital } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [donationCenters, setDonationCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    centerId: '',
    notes: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, these would be actual API calls
        // For now, let's use mock data
        
        // Mock appointments data
        const mockAppointments = [
          {
            id: 1,
            date: '2023-09-15',
            time: '10:00 AM',
            centerName: 'City Hospital Blood Bank',
            centerAddress: '123 Main St, Downtown',
            status: 'confirmed'
          },
          {
            id: 2,
            date: '2023-10-20',
            time: '2:30 PM',
            centerName: 'Red Cross Donation Center',
            centerAddress: '456 Oak Ave, West Side',
            status: 'pending'
          }
        ];
        
        // Mock donation centers data
        const mockCenters = [
          {
            id: 1,
            name: 'City Hospital Blood Bank',
            address: '123 Main St, Downtown',
            phone: '555-1234',
            hours: '8:00 AM - 6:00 PM'
          },
          {
            id: 2,
            name: 'Red Cross Donation Center',
            address: '456 Oak Ave, West Side',
            phone: '555-5678',
            hours: '9:00 AM - 7:00 PM'
          },
          {
            id: 3,
            name: 'Community Health Clinic',
            address: '789 Pine Rd, East Side',
            phone: '555-9012',
            hours: '8:30 AM - 5:30 PM'
          }
        ];
        
        setAppointments(mockAppointments);
        setDonationCenters(mockCenters);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAppointment.date || !newAppointment.time || !newAppointment.centerId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // In a real application, this would be an actual API call
      // For now, let's simulate adding an appointment
      
      const selectedCenter = donationCenters.find(
        center => center.id === parseInt(newAppointment.centerId)
      );
      
      const newAppointmentData = {
        id: appointments.length + 1,
        date: newAppointment.date,
        time: newAppointment.time,
        centerName: selectedCenter.name,
        centerAddress: selectedCenter.address,
        status: 'pending',
        notes: newAppointment.notes
      };
      
      setAppointments([...appointments, newAppointmentData]);
      setNewAppointment({ date: '', time: '', centerId: '', notes: '' });
      setShowForm(false);
      setError(null);
    } catch (error) {
      setError('Failed to book appointment. Please try again.');
    }
  };

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
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Appointments
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaCalendarAlt className="-ml-1 mr-2 h-5 w-5" />
            {showForm ? 'Cancel' : 'Schedule Appointment'}
          </button>
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

      {showForm && (
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Schedule a New Appointment
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={newAppointment.date}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={newAppointment.time}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="centerId" className="block text-sm font-medium text-gray-700">
                  Donation Center
                </label>
                <select
                  id="centerId"
                  name="centerId"
                  value={newAppointment.centerId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                >
                  <option value="">Select a donation center</option>
                  {donationCenters.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={newAppointment.notes}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Upcoming Appointments
      </h3>

      {appointments.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.date)} at {appointment.time}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {appointment.centerName}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {appointment.centerAddress}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any upcoming appointments scheduled.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FaCalendarAlt className="-ml-1 mr-2 h-5 w-5" />
                Schedule Your First Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Donation Centers
        </h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {donationCenters.map((center) => (
              <li key={center.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-green-100">
                        <FaHospital className="text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {center.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {center.address}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <FaClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {center.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Appointments; 