import express from 'express';
import vehiclesRouter from './routes/vehicles.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import NotFoundError from './errors/NotFoundError.js';
import { swaggerUiMiddleware } from './docs/swagger.js';
import { sanitizeInputs } from './middleware/sanitizeInputs.js';

const app = express();

app.use(express.json());

// Sanitaze all inputs
app.use(sanitizeInputs);

// Attach request correlation
app.use(requestLogger);

// Swagger docs
app.use('/api-docs', ...swaggerUiMiddleware);

// Routes
app.use('/vehicles', vehiclesRouter);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
