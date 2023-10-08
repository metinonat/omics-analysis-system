import { Router } from "express";
import Joi from "joi";
import { getGeneAnalysisHandler } from "../controllers/analysis";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.get("/:geneId", [
	validateRequest({
		paramsSchema: Joi.object({
			geneId: Joi.string().required(),
		}),
	}),
	getGeneAnalysisHandler,
]);
export default router;
