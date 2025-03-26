import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mockOtpVisible, setMockOtpVisible] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const navigate = useNavigate();
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // For development/mock environment
      if (API_URL.includes('localhost')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store email in localStorage for the OTP verification page
        localStorage.setItem('resetEmail', email);
        
        // Mock OTP generated (in a real app, this would be generated on the server)
        const generatedMockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Mock OTP for ${email}: ${generatedMockOTP}`);
        
        // In development, store the OTP in localStorage (NEVER do this in production)
        localStorage.setItem('mockOTP', generatedMockOTP);
        
        // Set mock OTP for display
        setMockOtp(generatedMockOTP);
        setMockOtpVisible(true);
        
        // Set a success message
        setMessage(`Since this is a development environment, no actual email is sent. You can use the OTP shown below to proceed with the password reset.`);
      } else {
        // In production, make a real API call
        const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        setMessage(response.data.message || 'Password reset email sent. Please check your inbox.');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a one-time password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mockOtpVisible ? (
            <div className="rounded-md bg-gray-50 p-4 mb-4">
              <div className="flex">
                <div className="ml-3 w-full">
                  <h3 className="text-sm font-medium text-gray-800">Development Mode</h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{message}</p>
                  </div>
                  <div className="mt-4 bg-white border border-gray-300 p-4 rounded text-center">
                    <p className="text-sm text-gray-500 mb-2">Your OTP for {email} is:</p>
                    <p className="text-2xl font-bold tracking-widest text-primary">{mockOtp}</p>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => navigate('/verify-otp')}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Continue to Verification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : message ? (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/verify-otp')}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Continue to Verification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
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
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:text-red-800 flex items-center"
                >
                  <FaArrowLeft className="mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 