import { Router } from "express";
import analysis from "./analysis";
import omics from "./omics";
import samples from "./samples";
import importData from "./import";

export const router = Router();

router.use("/omics", omics);
router.use("/samples", samples);
router.use("/analysis", analysis);
router.use("/import", importData);
