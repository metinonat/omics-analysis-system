import { Router } from "express";
import analysis from "./analysis";
import omics from "./omics";
import samples from "./samples";

export const router = Router();

router.use("/omics", omics);
router.use("/samples", samples);
router.use("/analysis", analysis);
