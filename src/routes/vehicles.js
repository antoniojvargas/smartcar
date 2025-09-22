import express from 'express';
import {
  getVehicle,
  getDoors,
  getFuel,
  getBattery,
  postEngine,
} from '../MMApi/MMApiController.js';
import {
  validateVehicleParams,
  validateEngineBody,
} from '../middleware/validateVehicle.js';
import {
  sanitizeVehicleId,
  sanitizeEngineAction,
  handleValidationErrors,
} from '../middleware/sanitizeInputs.js';

const router = express.Router();

/**
 * Vehicles Router
 *
 * Provides REST API endpoints to retrieve and manipulate vehicle data.
 * All routes validate the vehicle ID parameter before reaching the controller.
 *
 * @module routes/vehicles
 */

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleInfo'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Bad gateway - third-party service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id',
  sanitizeVehicleId,
  handleValidationErrors,
  validateVehicleParams,
  getVehicle,
);

/**
 * @swagger
 * /vehicles/{id}/doors:
 *   get:
 *     summary: Get door lock status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Door status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoorStatus'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Bad gateway - third-party service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id/doors',
  sanitizeVehicleId,
  handleValidationErrors,
  validateVehicleParams,
  getDoors,
);

/**
 * @swagger
 * /vehicles/{id}/fuel:
 *   get:
 *     summary: Get fuel percentage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Fuel level
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fuel'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Bad gateway - third-party service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id/fuel',
  sanitizeVehicleId,
  handleValidationErrors,
  validateVehicleParams,
  getFuel,
);

/**
 * @swagger
 * /vehicles/{id}/battery:
 *   get:
 *     summary: Get battery percentage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Battery level
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Battery'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Bad gateway - third-party service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id/battery',
  sanitizeVehicleId,
  handleValidationErrors,
  validateVehicleParams,
  getBattery,
);

/**
 * @swagger
 * /vehicles/{id}/engine:
 *   post:
 *     summary: Start or stop the engine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EngineRequest'
 *     responses:
 *       200:
 *         description: Engine action result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EngineResponse'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: Bad gateway - third-party service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:id/engine',
  sanitizeVehicleId,
  sanitizeEngineAction,
  handleValidationErrors,
  validateEngineBody,
  postEngine,
);

export default router;
