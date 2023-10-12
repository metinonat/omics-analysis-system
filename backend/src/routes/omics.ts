import { Router } from "express";
import Joi from "joi";
import { getOmicsHandler, listOmicsForInputHandler, listOmicsHandler, upsertOmicsHandler } from "../controllers/omics";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.get("/list", [
	validateRequest({
		querySchema: Joi.object({
			page: Joi.number().min(1).default(1),
			perPage: Joi.number().min(5).max(25).default(10),
			order: Joi.string().valid("asc", "desc").default("asc"),
			filter: Joi.string().optional(),
		}),
	}),
	listOmicsHandler,
]);

router.get("/list/input", [
	validateRequest({
		querySchema: Joi.object({
			filter: Joi.string().optional(),
		}),
	}),
	listOmicsForInputHandler,
]);

router.get("/", [
	validateRequest({
		querySchema: Joi.object({
			geneId: Joi.string().optional(),
			gene: Joi.string().optional(),
		}).or("geneId", "gene"),
	}),
	getOmicsHandler,
]);

router.post("/", [
	validateRequest({
		bodySchema: Joi.object({
			geneId: Joi.string().optional(),
			gene: Joi.string().required(),
			transcript: Joi.string().required(),
		}),
	}),
	upsertOmicsHandler,
]);

export default router;
