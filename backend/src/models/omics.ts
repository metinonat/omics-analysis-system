import { IOmics, ISamples } from "./db/interface";

export type OmicsData = IOmics & {
	samples: ISamples[];
};
