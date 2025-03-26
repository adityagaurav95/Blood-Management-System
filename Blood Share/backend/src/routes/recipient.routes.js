const express = require('express');
const router = express.Router();
const {
  registerRecipient,
  createBloodRequest,
  getRecipientProfile,
  getRecipientRequests,
  updateRecipientProfile
} = require('../controllers/recipient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Register recipient
router.post('/register', authorize('recipient'), registerRecipient);

// Blood request routes
router.post('/requests', authorize('recipient'), createBloodRequest);
router.get('/me/requests', authorize('recipient'), getRecipientRequests);

// Profile routes
router.get('/me', authorize('recipient'), getRecipientProfile);
router.put('/me', authorize('recipient'), updateRecipientProfile);

module.exports = router; 