const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles with optional filters
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, isAvailable } = req.query;
    let query = {};

    // Search by name or brand
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { brand: searchRegex }];
    }

    // Filter by type (car, bike, suv, van)
    if (type && type.toLowerCase() !== 'all') {
      query.type = type.toLowerCase();
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Filter by availability
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    console.error('getVehicles error:', error);
    res.status(500).json({ message: 'Server error fetching vehicles' });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('getVehicleById error:', error);
    res.status(500).json({ message: 'Server error fetching vehicle details' });
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res) => {
  try {
    const { name, brand, type, pricePerDay, seats, fuelType, imageUrl, isAvailable, description } = req.body;

    if (!name || !brand || !type || !pricePerDay || !seats || !imageUrl) {
      return res.status(400).json({ message: 'Please fill in all required vehicle details' });
    }

    const vehicle = await Vehicle.create({
      name: name.trim(),
      brand: brand.trim(),
      type: type.toLowerCase(),
      pricePerDay: Number(pricePerDay),
      seats: Number(seats),
      fuelType: fuelType || 'Petrol',
      imageUrl: imageUrl.trim(),
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      description: description ? description.trim() : '',
    });

    res.status(201).json({ success: true, message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    console.error('createVehicle error:', error);
    res.status(500).json({ message: error.message || 'Server error creating vehicle' });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { name, brand, type, pricePerDay, seats, fuelType, imageUrl, isAvailable, description } = req.body;

    vehicle.name = name ? name.trim() : vehicle.name;
    vehicle.brand = brand ? brand.trim() : vehicle.brand;
    vehicle.type = type ? type.toLowerCase() : vehicle.type;
    vehicle.pricePerDay = pricePerDay !== undefined ? Number(pricePerDay) : vehicle.pricePerDay;
    vehicle.seats = seats !== undefined ? Number(seats) : vehicle.seats;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.imageUrl = imageUrl ? imageUrl.trim() : vehicle.imageUrl;
    vehicle.isAvailable = isAvailable !== undefined ? isAvailable : vehicle.isAvailable;
    vehicle.description = description !== undefined ? description.trim() : vehicle.description;

    const updatedVehicle = await vehicle.save();
    res.json({ success: true, message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    console.error('updateVehicle error:', error);
    res.status(500).json({ message: error.message || 'Server error updating vehicle' });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('deleteVehicle error:', error);
    res.status(500).json({ message: 'Server error deleting vehicle' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
