BloodShare - Blood Donation Management System

A comprehensive web application designed to connect blood donors with recipients, manage donations, appointments, and streamline the blood donation process.

## Features

- **User Authentication**: Secure login and registration for donors and recipients
- **Dashboard**: Visual overview of donation statistics and recent activities
- **Profile Management**: Update personal information and medical history
- **Donation Tracking**: Record and monitor blood donation history
- **Appointment Scheduling**: Schedule, manage, and cancel donation appointments
- **Donation Centers**: View information about available donation centers

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```
   - Create a `.env` file in the frontend directory:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

5. Start the backend server
   ```
   cd backend
   npm run dev
   ```

6. Start the frontend
   ```
   cd frontend
   npm start
   ```

7. Visit `http://localhost:3000` to view the application

## Project Structure

```
bloodshare/
├── backend/              # Backend code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Entry point
│
├── frontend/             # Frontend code
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # Reusable components
│       ├── contexts/     # Context providers
│       ├── layouts/      # Page layouts
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── utils/        # Utility functions
│       ├── App.js        # Main component
│       └── index.js      # Entry point

