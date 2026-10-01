const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vehicle, start date, and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid start or end date format' });
    }

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check vehicle exists and is active
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'This vehicle is currently not available for rent' });
    }

    // Double Booking Prevention:
    // Reject booking if dates overlap with an existing Confirmed booking for the same vehicle
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['Confirmed', 'Pending'] },
      $and: [
        { startDate: { $lt: end } },
        { endDate: { $gt: start } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Vehicle is already booked for the selected dates. Please select different dates.',
      });
    }

    // Calculate total days and total price
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * vehicle.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      status: 'Pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ message: error.message || 'Server error creating booking' });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('getAllBookings error:', error);
    res.status(500).json({ message: 'Server error fetching all bookings' });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updated = await booking.save();

    const populated = await Booking.findById(updated._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: populated,
    });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

// @desc    Cancel user's own booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({ message: 'Completed bookings cannot be cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('cancelMyBooking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking,
};
