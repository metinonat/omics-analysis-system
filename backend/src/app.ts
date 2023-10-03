import express, { Express, Request, Response } from 'express';

import logger from './utils/logger';
import config from './config';

import { connectDb } from './utils/utils';

const app: Express = express();

const start = async () => {
	await connectDb();

	app.listen(config.HTTP_PORT, () => {
		logger.info(`Server is running on port ${config.HTTP_PORT}`);
	});
}


start();
