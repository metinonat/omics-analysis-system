import { Router } from "express";
import Joi from "joi";
import { getOmicsHandler } from "../controllers/omics";
import { validateRequest } from "../middlewares/validation";

export const router = Router();

router.get("/omics/:geneId", [
	validateRequest({
		paramsSchema: Joi.object({
			geneId: Joi.string().required(),
		}),
	}),
	getOmicsHandler,
]);

router.get("/analysis", (req, res) => {
	res.send("Data Analysis!");
});
