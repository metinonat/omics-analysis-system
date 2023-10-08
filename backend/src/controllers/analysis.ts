import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { getGeneAnalysis } from "../services/analysis";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const getGeneAnalysisHandler = async (req: Request, res: Response) => {
	try {
		const gene = await getGeneAnalysis(req.validatedParams.geneId);
		res.status(HttpStatus.Success).json(gene);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};
