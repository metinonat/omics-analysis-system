import { Schema } from "mongoose";
import { IOmics, ISamples } from "./interface";

export const omicsSchema = new Schema<IOmics>({
	gene: { type: String, required: true, unique: true },
	transcript: [{ type: String, required: true }],
});

export const samplesSchema = new Schema<ISamples>({
	name: { type: String, required: true },
	gene: { type: Schema.Types.ObjectId, ref: "Omics", required: true },
	value: { type: Number, required: true },
});
