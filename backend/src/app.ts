import express, { Express } from "express";

import logger from "./utils/logger";
import config from "./config";
logger.info("Config is loaded...");

import http from "http";
import { router } from "./routes/router";
import cors from "cors";
import { connectDb } from "./utils/utils";

const app: Express = express();

const start = async () => {
	await connectDb();

	const httpServer = http.createServer(app);

	app.use(
		cors({
			origin: true,
			credentials: true,
		})
	);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(router);

	httpServer.listen(config.HTTP_PORT, () => {
		logger.info(`Server is running on port ${config.HTTP_PORT}`);
	});
};

logger.info("Starting server...");
start();
