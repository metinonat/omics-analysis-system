import { ISamples } from "./db/interface";

export type PaginatedResponse<T> = {
	total: number;
	page: number;
	perPage: number;
	data: T[];
};

export type GetSampleResponse = Omit<ISamples, "geneId" | "__v"> & {
	gene: string;
};
