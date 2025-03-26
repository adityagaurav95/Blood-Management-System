#!/bin/bash

# Start Backend Server
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start Frontend Server
echo "Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for user to press Ctrl+C
echo "BloodShare application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000/api"
echo "Press Ctrl+C to stop both servers"

# Handle cleanup on script termination
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

# Keep the script running
wait 