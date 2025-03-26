const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please provide blood type']
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
    },
    address: {
      type: String,
      required: [true, 'Please provide your address']
    },
    city: {
      type: String,
      required: [true, 'Please provide your city']
    },
    state: {
      type: String,
      required: [true, 'Please provide your state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide your zip code']
    }
  },
  medicalInfo: {
    lastDonated: Date,
    medicalConditions: [String],
    medications: [String],
    isEligible: {
      type: Boolean,
      default: true
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  donationHistory: [
    {
      date: {
        type: Date,
        required: true
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      hospital: String,
      notes: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for geospatial queries
DonorSchema.index({ 'location.coordinates': '2dsphere' });

// Static method to get donors by radius and blood type
DonorSchema.statics.getNearbyDonors = async function(longitude, latitude, distance, bloodType) {
  const donors = await this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: distance * 1000 // Convert to meters
      }
    },
    'availability': true,
    'medicalInfo.isEligible': true,
    ...(bloodType ? { bloodType } : {})
  }).populate({
    path: 'user',
    select: 'name email phone'
  });

  return donors;
};

module.exports = mongoose.model('Donor', DonorSchema); 