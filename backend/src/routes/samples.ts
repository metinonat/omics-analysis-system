import { Router } from "express";
import Joi from "joi";
import { getSampleHandler, listSamplesHandler, upsertSamplesHandler } from "../controllers/samples";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.get("/list", [
	validateRequest({
		querySchema: Joi.object({
			page: Joi.number().min(1).default(1),
			perPage: Joi.number().min(5).max(25).default(10),
			order: Joi.string().valid("asc", "desc").default("asc"),
			orderField: Joi.string().valid("name", "gene", "created").default("created"),
			filterName: Joi.string().optional(),
		}),
	}),
	listSamplesHandler,
]);

router.get("/:sampleId", [
	validateRequest({
		paramsSchema: Joi.object({
			sampleId: Joi.string().required(),
		}),
	}),
	getSampleHandler,
]);

router.post("/", [
	validateRequest({
		bodySchema: Joi.object({
			sampleId: Joi.string().optional(),
			name: Joi.string().required(),
			geneId: Joi.string().required(),
			value: Joi.number().required(),
		}),
	}),
	upsertSamplesHandler,
]);

export default router;
