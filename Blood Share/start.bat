@echo off
echo Starting BloodShare Application...

:: Start Backend Server
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

:: Start Frontend Server
echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo BloodShare application is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000/api
echo.
echo Frontend and Backend servers are running in separate windows.
echo Close those windows to stop the servers.
echo. 