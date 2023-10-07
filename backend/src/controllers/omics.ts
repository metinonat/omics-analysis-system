import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { getOmicsData } from "../services/omics";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const getOmicsHandler = async (req: Request, res: Response) => {
	try {
		const gene = await getOmicsData(req.params.geneId);
		res.json(gene);
	} catch (error) {
		logger.error(error)
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};
