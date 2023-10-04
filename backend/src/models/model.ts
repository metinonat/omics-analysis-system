import { model } from "mongoose";
import { omicsSchema } from "./schema";

const Omics = model<IOmics>("Omics", omicsSchema);
