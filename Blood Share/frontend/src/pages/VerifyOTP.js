import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaKey, FaArrowLeft, FaRedo, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showMockOtp, setShowMockOtp] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const navigate = useNavigate();
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Get the email from localStorage
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
      // If email is not found, redirect back to forgot password page
      navigate('/forgot-password');
      return;
    }
    
    setEmail(resetEmail);
    
    // If in development, check for mockOTP
    if (API_URL.includes('localhost')) {
      const storedMockOtp = localStorage.getItem('mockOTP');
      if (storedMockOtp) {
        setMockOtp(storedMockOtp);
      }
    }
  }, [navigate, API_URL]);

  const handleInputChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input field if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const toggleMockOtp = () => {
    setShowMockOtp(!showMockOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // For development/mock environment
      if (API_URL.includes('localhost')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the stored mock OTP
        const mockOTP = localStorage.getItem('mockOTP');
        
        if (otpString === mockOTP) {
          // Store validation status
          localStorage.setItem('otpVerified', 'true');
          
          // Redirect to reset password page
          navigate('/reset-password');
        } else {
          setError('Invalid verification code. Please try again.');
        }
      } else {
        // In production, make a real API call
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { 
          email, 
          otp: otpString 
        });
        
        if (response.data.success) {
          localStorage.setItem('otpVerified', 'true');
          navigate('/reset-password');
        } else {
          setError(response.data.message || 'Invalid verification code');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      setLoading(true);
      
      // For development/mock environment
      if (API_URL.includes('localhost')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate new mock OTP
        const newMockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`New mock OTP for ${email}: ${newMockOTP}`);
        
        localStorage.setItem('mockOTP', newMockOTP);
        setMockOtp(newMockOTP);
        setShowMockOtp(true);
        alert(`A new verification code has been generated: ${newMockOTP}`);
      } else {
        // In production, make a real API call
        await axios.post(`${API_URL}/auth/resend-otp`, { email });
        alert(`A new verification code has been sent to ${email}`);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError(error.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {API_URL.includes('localhost') && (
            <div className="mb-6">
              <button
                type="button"
                onClick={toggleMockOtp}
                className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-900 py-2 transition-colors"
              >
                <FaInfoCircle className="mr-2" />
                {showMockOtp ? 'Hide developer info' : 'Show developer info'}
              </button>
              
              {showMockOtp && mockOtp && (
                <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Development mode - Your verification code is:</p>
                  <p className="text-xl font-bold tracking-widest text-center text-primary">{mockOtp}</p>
                </div>
              )}
            </div>
          )}

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
              <label htmlFor="otp-0" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1 flex justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Verifying...' : 'Verify and Continue'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-red-800 flex items-center"
              >
                <FaArrowLeft className="mr-1" /> Back
              </Link>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-primary hover:text-red-800 flex items-center"
              >
                <FaRedo className="mr-1" /> Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP; 