// docs/schemas.js

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleInfo:
 *       type: object
 *       properties:
 *         vin:
 *           type: string
 *           example: "1213231"
 *         color:
 *           type: string
 *           example: "Metallic Silver"
 *         doorCount:
 *           type: integer
 *           enum: [2, 4]
 *           example: 4
 *         driveTrain:
 *           type: string
 *           example: "v8"
 *
 *     DoorStatus:
 *       type: object
 *       properties:
 *         location:
 *           type: string
 *           enum: [frontLeft, frontRight, backLeft, backRight]
 *           example: "frontLeft"
 *         locked:
 *           type: boolean
 *           example: true
 *
 *     Fuel:
 *       type: object
 *       properties:
 *         percent:
 *           type: number
 *           format: float
 *           example: 30.2
 *
 *     Battery:
 *       type: object
 *       properties:
 *         percent:
 *           type: number
 *           format: float
 *           example: 50.3
 *
 *     EngineRequest:
 *       type: object
 *       required: [action]
 *       properties:
 *         action:
 *           type: string
 *           enum: [START, STOP]
 *           example: START
 *
 *     EngineResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *           example: success
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 *         requestId:
 *           type: string
 *         details:
 *           type: object
 */
