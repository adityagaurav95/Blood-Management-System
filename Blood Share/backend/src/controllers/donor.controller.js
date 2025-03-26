const Donor = require('../models/donor.model');
const User = require('../models/user.model');

// @desc    Register donor
// @route   POST /api/donors/register
// @access  Private
exports.registerDonor = async (req, res, next) => {
  try {
    const {
      bloodType,
      location,
      medicalInfo
    } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ user: req.user.id });
    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: 'Donor profile already exists'
      });
    }

    // Create donor profile
    const donor = await Donor.create({
      user: req.user.id,
      bloodType,
      location,
      medicalInfo
    });

    res.status(201).json({
      success: true,
      data: donor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating donor profile',
      error: err.message
    });
  }
};

// @desc    Get nearby donors
// @route   GET /api/donors/nearby
// @access  Public
exports.getNearbyDonors = async (req, res, next) => {
  try {
    const { longitude, latitude, distance = 10, bloodType } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    const donors = await Donor.getNearbyDonors(
      parseFloat(longitude),
      parseFloat(latitude),
      parseFloat(distance),
      bloodType
    );

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error finding nearby donors',
      error: err.message
    });
  }
};

// @desc    Get donor profile
// @route   GET /api/donors/me
// @access  Private
exports.getDonorProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user.id }).populate({
      path: 'user',
      select: 'name email phone'
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error getting donor profile',
      error: err.message
    });
  }
};

// @desc    Update donor profile
// @route   PUT /api/donors/me
// @access  Private
exports.updateDonorProfile = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user.id });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    // Update donor profile
    const updatedDonor = await Donor.findByIdAndUpdate(
      donor._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedDonor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error updating donor profile',
      error: err.message
    });
  }
};

// @desc    Update donor availability
// @route   PUT /api/donors/me/availability
// @access  Private
exports.updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const donor = await Donor.findOne({ user: req.user.id });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    donor.availability = availability;
    await donor.save();

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: err.message
    });
  }
}; 