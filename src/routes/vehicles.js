import express from 'express';
import {
  getVehicle,
  getDoors,
  getFuel,
  getBattery,
  postEngine,
} from '../controllers/vehiclesController.js';

const router = express.Router();

router.get('/:id', getVehicle);
router.get('/:id/doors', getDoors);
router.get('/:id/fuel', getFuel);
router.get('/:id/battery', getBattery);
router.post('/:id/engine', postEngine);

export default router;