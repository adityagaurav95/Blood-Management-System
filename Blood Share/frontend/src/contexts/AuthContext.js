import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default authorization header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // For development - If API_URL includes localhost, use mock data
          if (API_URL.includes('localhost')) {
            // Check if it's our mock token
            if (token === 'mock-jwt-token-for-testing') {
              // Try to parse stored user from localStorage
              const storedUser = localStorage.getItem('mockUser');
              if (storedUser) {
                try {
                  setCurrentUser(JSON.parse(storedUser));
                } catch (e) {
                  // If parsing fails, set a basic mock user
                  setCurrentUser({
                    id: 'mock-user-123',
                    name: 'Test User',
                    email: 'test@example.com',
                    bloodType: 'O+',
                    userType: 'donor'
                  });
                }
              } else {
                // No stored user, set a basic mock user
                const mockUser = {
                  id: 'mock-user-123',
                  name: 'Test User',
                  email: 'test@example.com',
                  bloodType: 'O+',
                  userType: 'donor'
                };
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                setCurrentUser(mockUser);
              }
            } else {
              // Invalid token, clear it
              localStorage.removeItem('token');
              localStorage.removeItem('mockUser');
              delete axios.defaults.headers.common['Authorization'];
            }
          } else {
            // Verify token and get user info from real API
            const response = await axios.get(`${API_URL}/auth/me`);
            
            if (response.data && response.data.user) {
              setCurrentUser(response.data.user);
            }
          }
        } catch (error) {
          // If token is invalid or expired, remove it
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('mockUser');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (email, password) => {
    try {
      setError('');
      
      // For development - If API_URL includes localhost, use mock data
      if (API_URL.includes('localhost')) {
        // Get stored user data
        const storedUser = localStorage.getItem('mockUser');
        const storedUserData = storedUser ? JSON.parse(storedUser) : null;
        
        // Check if user exists and password matches
        if (email && password && storedUserData && email === storedUserData.email && password === storedUserData.password) {
          // Check if this is an admin login
          const isAdmin = email.toLowerCase().includes('admin');
          
          // Create mock user data
          const mockUser = {
            id: storedUserData.id,
            name: storedUserData.name || email.split('@')[0],
            email: email,
            bloodType: isAdmin ? null : storedUserData.bloodType || 'O+',
            userType: isAdmin ? 'admin' : storedUserData.userType || 'donor',
            isAdmin: isAdmin,
            createdAt: storedUserData.createdAt || new Date().toISOString()
          };
          
          const mockToken = 'mock-jwt-token-for-testing';
          
          // Store user data and token
          localStorage.setItem('token', mockToken);
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          setCurrentUser(mockUser);
          
          console.log('Mock login successful:', mockUser);
          
          // Return mock data
          return { user: mockUser, token: mockToken };
        } else {
          // Mock authentication failure
          let errorMessage = 'Invalid login credentials';
          if (!email) errorMessage = 'Email is required';
          else if (!password) errorMessage = 'Password is required';
          else if (!storedUserData) errorMessage = 'User not found. Please register first.';
          else if (email !== storedUserData.email) errorMessage = 'Invalid email address';
          else if (password !== storedUserData.password) errorMessage = 'Invalid password';
          
          throw new Error(errorMessage);
        }
      }
      
      // Real API call for production
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setCurrentUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to login';
      setError(message);
      throw error;
    }
  };
  
  const signup = async (userData) => {
    try {
      setError('');
      
      // For development - If API_URL includes localhost, use mock data
      if (API_URL.includes('localhost')) {
        // Basic validation
        if (!userData.email || !userData.password) {
          throw new Error('Email and password are required');
        }
        if (userData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Mock successful signup
        console.log('Mock signup with data:', userData);
        
        // Create mock response with unique ID
        const mockUser = {
          id: `mock-user-${new Date().getTime()}`,
          ...userData,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'mock-jwt-token-for-testing';
        
        // Store user data and token
        localStorage.setItem('token', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        setCurrentUser(mockUser);
        
        console.log('Mock signup successful:', mockUser);
        
        // Return mock data
        return { user: mockUser, token: mockToken };
      }
      
      // Real API call for production
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setCurrentUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to signup';
      setError(message);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      // For development - If API_URL includes localhost, use mock data
      if (API_URL.includes('localhost')) {
        console.log('Mock logout');
      } else {
        // Real API call for production
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('mockUser'); // Make sure to remove mockUser
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };
  
  const updateProfile = async (userData) => {
    try {
      setError('');
      
      // For development - If API_URL includes localhost, use mock data
      if (API_URL.includes('localhost')) {
        console.log('Mock update profile with data:', userData);
        
        // Create updated user by merging current user with new data
        const updatedUser = {
          ...currentUser,
          ...userData,
          updatedAt: new Date().toISOString()
        };
        
        // Update current user state
        setCurrentUser(updatedUser);
        
        // Return mock data
        return updatedUser;
      }
      
      // Real API call for production
      const response = await axios.put(`${API_URL}/user/profile`, userData);
      
      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      setError(message);
      throw error;
    }
  };
  
  const clearError = () => {
    setError('');
  };
  
  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    error,
    setError,
    clearError,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 