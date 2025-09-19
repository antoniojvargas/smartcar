import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle API',
      version: '1.0.0',
      description: 'API documentation for the Vehicle service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server',
      },
    ],
  },

  apis: [
    path.resolve('src/routes/vehicles.js'),
    path.resolve('src/docs/schemas.js'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];
