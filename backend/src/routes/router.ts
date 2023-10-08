import { Router } from "express";
import omics from "./omics";
import samples from "./samples";

export const router = Router();

router.use("/omics", omics);
router.use("/samples", samples);
