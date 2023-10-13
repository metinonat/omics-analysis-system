import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { getChartData, getGeneAnalysis, getZScoreOutliers } from "../services/analysis";
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

export const getZScoreOutliersHandler = async (req: Request, res: Response) => {
	try {
		const outliers = await getZScoreOutliers(req.validatedBody.threshold, req.validatedBody.genes);
		res.status(HttpStatus.Success).json(outliers);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};

export const getChartDataHandler = async (req: Request, res: Response) => {
	try {
		const outliers = await getChartData(req.validatedBody.genes);
		res.status(HttpStatus.Success).json(outliers);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};
