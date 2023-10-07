import { Request, Response } from "express";
import Joi from "joi";
import logger from "./logger";

export const errorResponse = (error: string | any, statusCode: number, req: Request, res: Response) => {
    logger.error(req);

	if (typeof error === "string") {
		res.status(statusCode).json({
			message: error,
		});
	} else {
        if(error instanceof Joi.ValidationError) {
            res.status(statusCode).json({
                message: error.message,
                error: error.details,
            });
        } else {
            res.status(statusCode).json({
                message: error.message ?? "Unknown error",
            });
        }
	}
};
