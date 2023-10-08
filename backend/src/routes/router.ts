import { Router } from "express";
import Joi from "joi";
import { getOmicsHandler, listOmicsHandler, upsertOmicsHandler } from "../controllers/omics";
import { validateRequest } from "../middlewares/validation";

export const router = Router();

router.get("/omics", [
	validateRequest({
		querySchema: Joi.object({
			page: Joi.number().min(1).default(1),
			perPage: Joi.number().min(5).max(25).default(10),
			order: Joi.string().valid("asc", "desc").default("asc"),
		}),
	}),
	listOmicsHandler,
]);

router.get("/omics/:geneId", [
	validateRequest({
		paramsSchema: Joi.object({
			geneId: Joi.string().required(),
		}),
	}),
	getOmicsHandler,
]);

router.post("/omics", [
	validateRequest({
		bodySchema: Joi.object({
			gene: Joi.string().required(),
			transcript: Joi.array().items(Joi.string().required()).required(),
		}),
	}),
	upsertOmicsHandler,
]);

router.get("/analysis", (req, res) => {
	res.send("Data Analysis!");
});
