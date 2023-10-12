import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { getSample, listSamplesData, upsertSample } from "../services/samples";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const listSamplesHandler = async (req: Request, res: Response) => {
	try {
		const samples = await listSamplesData(req.validatedQuery.page, req.validatedQuery.perPage, req.validatedQuery.order, req.validatedQuery.orderField, req.validatedQuery.filterName);
		res.status(HttpStatus.Success).json(samples);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};

export const getSampleHandler = async (req: Request, res: Response) => {
	try {
		const sample = await getSample(req.validatedParams.sampleId);
		res.status(HttpStatus.Success).json(sample);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};

export const upsertSamplesHandler = async (req: Request, res: Response) => {
	try {
		let sample = await upsertSample(req.validatedBody.sampleId, req.validatedBody.name, req.validatedBody.geneId, req.validatedBody.value);
		res.status(HttpStatus.Success).json(sample);
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.NotFound) {
			errorResponse(error.message, HttpStatus.NotFound, req, res);
		} else if (error instanceof AppError && error.code === ErrorCode.AlreadyExists) {
			errorResponse(error.message, HttpStatus.BadRequest, req, res);
		} else {
			errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
		}
	}
};
