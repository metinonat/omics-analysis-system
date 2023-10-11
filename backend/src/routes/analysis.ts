import { Router } from "express";
import Joi from "joi";
import { getGeneAnalysisHandler, getZScoreOutliersHandler } from "../controllers/analysis";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.get("/gene/:geneId", [
	validateRequest({
		paramsSchema: Joi.object({
			geneId: Joi.string().required(),
		}),
	}),
	getGeneAnalysisHandler,
]);

router.post("/outliers/z-score", [
	validateRequest({
		bodySchema: Joi.object({
			threshold: Joi.number().required(),
			genes: Joi.array().items(Joi.string()).required(),
		}),
	}),
	getZScoreOutliersHandler,
]);

// router.get("/outliers/ml", [getMLOutliersHandler]);

export default router;
