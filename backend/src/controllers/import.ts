import { Request, Response } from "express";
import { AppError, ErrorCode, HttpStatus } from "../models/common";
import { uploadTsv, uploadTsvOnBackground } from "../services/import";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";

export const uploadTsvHandler = async (req: Request, res: Response) => {
	try {
		if (!req.file) throw new AppError(ErrorCode.BadRequest, "File is required!");
		if (req.validatedQuery?.background) {
			await uploadTsvOnBackground(req.file.path);
			res.status(HttpStatus.Success).json();
		} else {
			const result = await uploadTsv(req.file.path);
			res.status(HttpStatus.Success).json(result);
		}
	} catch (error) {
		logger.error(error);
		if (error instanceof AppError && error.code === ErrorCode.UploadFailed) {
			errorResponse(error.message, HttpStatus.InternalServerError, req, res);
		} else if (error instanceof AppError && error.code === ErrorCode.BadRequest) {
			errorResponse(error.message, HttpStatus.BadRequest, req, res);
		}
		errorResponse("Unknown error!", HttpStatus.InternalServerError, req, res);
	}
};
