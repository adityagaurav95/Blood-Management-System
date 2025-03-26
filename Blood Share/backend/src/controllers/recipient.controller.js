const Recipient = require('../models/recipient.model');
const BloodRequest = require('../models/bloodRequest.model');
const Donor = require('../models/donor.model');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Register recipient
// @route   POST /api/recipients/register
// @access  Private
exports.registerRecipient = async (req, res, next) => {
  try {
    const {
      bloodType,
      location,
      medicalInfo
    } = req.body;

    // Check if recipient already exists
    const existingRecipient = await Recipient.findOne({ user: req.user.id });
    if (existingRecipient) {
      return res.status(400).json({
        success: false,
        message: 'Recipient profile already exists'
      });
    }

    // Create recipient profile
    const recipient = await Recipient.create({
      user: req.user.id,
      bloodType,
      location,
      medicalInfo
    });

    res.status(201).json({
      success: true,
      data: recipient
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating recipient profile',
      error: err.message
    });
  }
};

// @desc    Create blood request
// @route   POST /api/recipients/requests
// @access  Private
exports.createBloodRequest = async (req, res, next) => {
  try {
    const {
      bloodType,
      units,
      urgencyLevel,
      hospital,
      neededBy,
      notes
    } = req.body;

    // Create blood request
    const bloodRequest = await BloodRequest.create({
      recipient: req.user.id,
      bloodType,
      units,
      urgencyLevel,
      hospital,
      neededBy,
      notes
    });

    // Find matching donors
    const matchingDonors = await Donor.find({
      bloodType,
      availability: true,
      'medicalInfo.isEligible': true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: hospital.location.coordinates
          },
          $maxDistance: 50000 // 50km radius
        }
      }
    }).populate('user', 'name email phone');

    // Send notifications to matching donors
    for (const donor of matchingDonors) {
      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: donor.user.email,
        subject: 'Blood Donation Request',
        html: `
          <h2>Blood Donation Request</h2>
          <p>Dear ${donor.user.name},</p>
          <p>There is an urgent blood donation request matching your blood type (${donor.bloodType}).</p>
          <p>Hospital: ${hospital.name}</p>
          <p>Address: ${hospital.address}</p>
          <p>Units needed: ${units}</p>
          <p>Needed by: ${new Date(neededBy).toLocaleDateString()}</p>
          <p>Please contact us if you are available to donate.</p>
        `
      });

      // Send SMS
      await twilioClient.messages.create({
        body: `Blood donation request: ${hospital.name} needs ${units} units of ${bloodType} blood by ${new Date(neededBy).toLocaleDateString()}. Please contact us if available.`,
        to: donor.user.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      // Add donor to matched donors list
      bloodRequest.matchedDonors.push({
        donor: donor._id,
        status: 'contacted'
      });
    }

    await bloodRequest.save();

    res.status(201).json({
      success: true,
      data: bloodRequest
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating blood request',
      error: err.message
    });
  }
};

// @desc    Get recipient profile
// @route   GET /api/recipients/me
// @access  Private
exports.getRecipientProfile = async (req, res, next) => {
  try {
    const recipient = await Recipient.findOne({ user: req.user.id }).populate({
      path: 'user',
      select: 'name email phone'
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error getting recipient profile',
      error: err.message
    });
  }
};

// @desc    Get recipient's blood requests
// @route   GET /api/recipients/me/requests
// @access  Private
exports.getRecipientRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ recipient: req.user.id })
      .populate('matchedDonors.donor', 'bloodType location')
      .populate('matchedDonors.donor.user', 'name email phone');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error getting blood requests',
      error: err.message
    });
  }
};

// @desc    Update recipient profile
// @route   PUT /api/recipients/me
// @access  Private
exports.updateRecipientProfile = async (req, res, next) => {
  try {
    const recipient = await Recipient.findOne({ user: req.user.id });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient profile not found'
      });
    }

    // Update recipient profile
    const updatedRecipient = await Recipient.findByIdAndUpdate(
      recipient._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedRecipient
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error updating recipient profile',
      error: err.message
    });
  }
}; 