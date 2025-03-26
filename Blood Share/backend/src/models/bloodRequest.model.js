const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please provide blood type needed']
  },
  units: {
    type: Number,
    required: [true, 'Please specify how many units needed'],
    min: [1, 'At least 1 unit must be requested']
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  hospital: {
    name: {
      type: String,
      required: [true, 'Please provide hospital name']
    },
    address: {
      type: String,
      required: [true, 'Please provide hospital address']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  neededBy: {
    type: Date,
    required: [true, 'Please provide the date by which blood is needed']
  },
  matchedDonors: [
    {
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
      },
      status: {
        type: String,
        enum: ['contacted', 'confirmed', 'donated', 'cancelled'],
        default: 'contacted'
      },
      contactedAt: {
        type: Date,
        default: Date.now
      },
      responseAt: Date,
      notes: String
    }
  ],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
});

// Create index for geospatial queries
BloodRequestSchema.index({ 'hospital.location.coordinates': '2dsphere' });

module.exports = mongoose.model('BloodRequest', BloodRequestSchema); 