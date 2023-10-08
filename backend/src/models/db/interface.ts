import { Schema } from "mongoose";

export interface IOmics {
	gene: string;
	transcript: Array<string>;
}

export interface ISamples {
	name: string;
	geneId: Schema.Types.ObjectId;
	value: number;
}
