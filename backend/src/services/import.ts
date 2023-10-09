import { parseStream } from "fast-csv";
import fs from "fs";
import { AppError, ErrorCode } from "../models/common";
import logger from "../utils/logger";
import { findOrInsertOmics } from "./omics";
import { upsertSampleFromUpload } from "./samples";

export const uploadTsv = async (filePath: string) => {
	logger.info(filePath);
	const stream = fs.createReadStream(filePath);
	let genesData: any[] = [];
	let results = await new Promise((resolve, reject) => {
		parseStream(stream, { delimiter: "\t", headers: true })
			.on("data", (data) => {
				genesData.push(data);
			})
			.on("end", async () => {
				let errorCount = 0;
				let successCount = 0;
				for (let data of genesData) {
					try {
						// Gene might already exist in the database
						let geneId = await findOrInsertOmics(data.gene, data.transcript);
						if (!geneId) continue;

						for (let key in data) {
							successCount += 1;
							if (key !== "gene" && key !== "transcript") {
								await upsertSampleFromUpload(key, geneId, data[key]);
							}
						}
					} catch (error) {
						errorCount += 1;
						logger.error(error);
					}
				}
				logger.info("Upload finished with " + successCount + " successful samples and " + errorCount + " failed samples!");
				resolve({
					total: genesData.length,
					failedWrites: errorCount,
				});
			})
			.on("error", (error) => {
				logger.error(error);
				throw new AppError(ErrorCode.UploadFailed, "Upload failed!");
			});
	});
	return results;
};

export const uploadTsvOnBackground = async (filePath: string) => {
	logger.info(filePath);
	const stream = fs.createReadStream(filePath);
	let genesData: any[] = [];
	parseStream(stream, { delimiter: "\t", headers: true })
		.on("data", (data) => {
			genesData.push(data);
		})
		.on("end", async () => {
			let errorCount = 0;
			for (let data of genesData) {
				try {
					// Gene might already exist in the database
					let geneId = await findOrInsertOmics(data.gene, data.transcript);
					if (!geneId) continue;

					for (let key in data) {
						if (key !== "gene" && key !== "transcript") {
							await upsertSampleFromUpload(key, geneId, data[key]);
						}
					}
				} catch (error) {
					errorCount += 1;
					logger.error(error);
				}
			}
			logger.info("Upload finished with " + genesData.length + " genes!");
		})
		.on("error", (error) => {
			logger.error(error);
			throw new AppError(ErrorCode.UploadFailed, "Upload failed!");
		});
};
