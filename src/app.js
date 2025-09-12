import express from 'express';
import vehiclesRouter from './routes/vehicles.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import NotFoundError from './errors/NotFoundError.js';

const app = express();

app.use(express.json());

// Attach request correlation
app.use(requestLogger);

// Routes
app.use('/vehicles', vehiclesRouter);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
