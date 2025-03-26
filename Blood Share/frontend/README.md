# BloodShare Frontend

This directory contains the React-based frontend for the BloodShare Blood Donation Management System.

## Features

- Responsive UI built with React and Tailwind CSS
- Protected routes with authentication
- Dashboard with real-time statistics
- User profile management
- Donation tracking and history
- Appointment scheduling system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the project root with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The app will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── layouts/        # Page layout components
├── pages/          # Main page components
├── services/       # API service functions
├── utils/          # Utility functions
├── App.js          # Main application component
├── App.css         # Global styles
└── index.js        # Application entry point
```

## Key Components

### Pages
- `Login.js` - User authentication
- `Register.js` - New user registration
- `Dashboard.js` - Main dashboard with statistics
- `Profile.js` - User profile management
- `Donations.js` - Donation history and tracking
- `Appointments.js` - Appointment scheduling

### Components
- `PrivateRoute.js` - Route protection for authenticated users
- Various UI components for forms, cards, tables, etc.

### Contexts
- `AuthContext.js` - Authentication state management
