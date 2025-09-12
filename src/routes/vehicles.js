import express from 'express';
import {
  getVehicle,
  getDoors,
  getFuel,
  getBattery,
  postEngine,
} from '../controllers/vehiclesController.js';
import {
  validateVehicleParams,
  validateEngineBody
} from '../middleware/validateVehicle.js';

const router = express.Router();

router.get('/:id', validateVehicleParams, getVehicle);
router.get('/:id/doors', validateVehicleParams, getDoors);
router.get('/:id/fuel', validateVehicleParams, getFuel);
router.get('/:id/battery', validateVehicleParams, getBattery);
router.post('/:id/engine', validateEngineBody, postEngine);

export default router;