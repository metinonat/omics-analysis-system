import { Schema } from "mongoose";

export const omicsSchema = new Schema<IOmics>({
	gene: { type: String, required: true },
	exp1: { type: Number, required: true },
	exp2: { type: Number, required: true },
	cont1: { type: Number, required: true },
	cont2: { type: Number, required: true },
});
