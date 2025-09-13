import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚗 Smartcar API running on port ${PORT}`);
  logger.info('Docs at http://localhost:3000/api-docs');
});
