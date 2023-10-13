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

export type GeneAnalysisResponse = {
	sampleSize: number;
	mean: number;
	median: number;
	variance: number;
	standartDeviation: number;
};

export type ZScoreOutliersResponse = {
	_id: string;
	gene: string;
	mean: number;
	stdDev: number;
	samples: (ISamples & { _id: string })[];
};
