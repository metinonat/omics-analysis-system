import { Schema } from "mongoose";
import { IOmics, ISamples } from "./interface";

export type OmicsData = IOmics & {
	id: Schema.Types.ObjectId;
	samples: ISamples[];
};
