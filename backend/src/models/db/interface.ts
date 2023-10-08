import { Schema } from "mongoose";

export interface IOmics {
	gene: string;
	transcript: Array<string>;
}

export interface ISamples {
	name: string;
	gene: Schema.Types.ObjectId;
	value: number;
}
