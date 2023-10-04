import express, { Express } from 'express';

import logger from './utils/logger';
import config from './config';
logger.info('Config is loaded...');

import { connect } from 'mongoose';

const app: Express = express();

const start = async () => {
	await connect(config.MONGO_URL);
	
	app.listen(config.HTTP_PORT, () => {
		logger.info(`Server is running on port ${config.HTTP_PORT}`);
	});
}

logger.info('Starting server...');
start();