import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { HttpStatus } from "../models/common";
import { errorResponse } from "../utils/response";

export const validateRequest = (schemas: { bodySchema?: Joi.ObjectSchema<any>; querySchema?: Joi.ObjectSchema<any>; paramsSchema?: Joi.ObjectSchema<any> }) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { bodySchema, querySchema, paramsSchema } = schemas;
		const { body, query, params } = req;

		if (bodySchema) {
			const { error, value } = bodySchema.validate(body);
			if (error) {
				errorResponse(error, 400, req, res);
			}
			req.validatedBody = value;
		}

		if (querySchema) {
			const { error, value } = querySchema.validate(query);
			if (error) {
				errorResponse(error, 400, req, res);
			}
			req.validatedQuery = value;
		}

		if (paramsSchema) {
			const { error, value } = paramsSchema.validate(params);
			if (error) {
				errorResponse(error, 400, req, res);
			}
			req.validatedParams = value;
		}
		next();
	};
};

export const validateTsvFile = (req: Request, res: Response, next: NextFunction) => {
	if (!req.file) errorResponse("No file uploaded!", HttpStatus.BadRequest, req, res);
	//else if (req.file.mimetype !== "text/tab-separated-values") errorResponse("Samples file must be a TSV file!", HttpStatus.BadRequest, req, res);
	else next();
};
