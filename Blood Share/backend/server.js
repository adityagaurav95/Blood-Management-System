require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Define port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (commented out for now as we don't have a real DB connection)
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.log('MongoDB Connection Error:', err));

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to BloodShare API!' });
});

// User routes (placeholder)
app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'donor' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'recipient' }
    ] 
  });
});

// Donations routes (placeholder)
app.get('/api/donations', (req, res) => {
  res.json({ 
    donations: [
      { id: 1, donor: 'John Doe', bloodType: 'A+', date: '2023-01-15', amount: '450ml' },
      { id: 2, donor: 'Alice Johnson', bloodType: 'O-', date: '2023-02-10', amount: '500ml' }
    ] 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 