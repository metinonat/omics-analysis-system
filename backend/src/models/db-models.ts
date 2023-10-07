import { model } from "mongoose";
import { omicsSchema, samplesSchema } from "./schema";
import { IOmics, ISamples } from "./interface";

export const Omics = model<IOmics>("Omics", omicsSchema);

export const Samples = model<ISamples>("Samples", samplesSchema);