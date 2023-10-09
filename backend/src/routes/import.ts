import { Router } from "express";
import Joi from "joi";
import multer from "multer";
import config from "../config";
import { uploadTsvHandler } from "../controllers/import";
import { validateRequest, validateTsvFile } from "../middlewares/validation";

const router = Router();
const upload = multer({ dest: config.UPLOADS_DIR });

router.post("/tsv", [
	upload.single("samples"),
	validateRequest({
		querySchema: Joi.object({
			background: Joi.boolean().optional().default(false),
		}),
	}),
	validateTsvFile,
	uploadTsvHandler,
]);
export default router;
