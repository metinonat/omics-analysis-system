import { connect } from "mongoose";
import config from "../config";
import logger from "./logger";

export const connectDb = async (attempt: number = 0) => {
	logger.info(`Attempt[${attempt}] to connect to MongoDB...`);
	await connect(`${config.MONGO_URL}/${config.MONGO_DB}`, {
		serverSelectionTimeoutMS: 5000,
		authSource: config.MONGO_DB,
		user: config.MONGO_USER,
		pass: config.MONGO_PASSWORD,
	})
		.then(() => {
			logger.info("MongoDB connected!");
		})
		.catch((error) => {
			logger.error("MongoDB connection error: " + error);
			if (attempt >= 15) throw error;
			setTimeout(connectDb, 5000, attempt + 1);
		});
};
