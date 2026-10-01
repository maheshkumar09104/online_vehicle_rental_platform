const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide vehicle name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide vehicle brand'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select vehicle type'],
      enum: ['car', 'bike', 'suv', 'van'],
      lowercase: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please provide price per day'],
      min: [1, 'Price per day must be at least 1'],
    },
    seats: {
      type: Number,
      required: [true, 'Please provide number of seats'],
      min: [1, 'Seats must be at least 1'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please select fuel type'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      default: 'Petrol',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
