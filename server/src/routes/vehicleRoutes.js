const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getVehicles)
  .post(protect, adminOnly, createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, adminOnly, updateVehicle)
  .delete(protect, adminOnly, deleteVehicle);

module.exports = router;
