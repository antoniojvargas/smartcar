import express from 'express';
import vehiclesRouter from './routes/vehicles.js';

const app = express();
app.use(express.json());

// Routes
app.use('/vehicles', vehiclesRouter);

export default app;
