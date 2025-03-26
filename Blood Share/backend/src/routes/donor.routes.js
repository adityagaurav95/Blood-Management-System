const express = require('express');
const router = express.Router();
const {
  registerDonor,
  getNearbyDonors,
  getDonorProfile,
  updateDonorProfile,
  updateAvailability
} = require('../controllers/donor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/nearby', getNearbyDonors);

// Protected routes
router.use(protect);
router.post('/register', authorize('donor'), registerDonor);
router.get('/me', authorize('donor'), getDonorProfile);
router.put('/me', authorize('donor'), updateDonorProfile);
router.put('/me/availability', authorize('donor'), updateAvailability);

module.exports = router; 