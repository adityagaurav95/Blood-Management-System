import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center">
          <FaExclamationTriangle className="h-24 w-24 text-yellow-400" />
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          404
        </h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-base text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaHome className="mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 