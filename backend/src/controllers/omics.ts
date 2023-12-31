import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { getOmicsData, listOmicsData, listOmicsForInputData, upsertOmics } from "../services/omics";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const listOmicsHandler = async (req: Request, res: Response) => {
	try {
		const omics = await listOmicsData(req.validatedQuery.page, req.validatedQuery.perPage, req.validatedQuery.order, req.validatedQuery.filter);
		res.status(HttpStatus.Success).json(omics);
	} catch (error) {
		logger.error(error);
		errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
	}
};


export const listOmicsForInputHandler = async (req: Request, res: Response) => {
	try {
		const omics = await listOmicsForInputData(req.validatedQuery.filter);
		res.status(HttpStatus.Success).json(omics);
	} catch (error) {
		logger.error(error);
		errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
	}
};

export const getOmicsHandler = async (req: Request, res: Response) => {
	try {
		const gene = await getOmicsData(req.validatedQuery);
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

export const upsertOmicsHandler = async (req: Request, res: Response) => {
	try {
		let gene = await upsertOmics(req.validatedBody.geneId, req.validatedBody.gene, req.validatedBody.transcript);
		res.status(HttpStatus.Success).json(gene);
	} catch (error) {
		logger.error(error);
		errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
	}
};
