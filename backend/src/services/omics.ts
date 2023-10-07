import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db-models";
import { ISamples } from "../models/interface";
import { OmicsData } from "../models/omics";

export const getOmicsData = async (geneId: string): Promise<OmicsData> => {
	let result: OmicsData;

	const gene = await Omics.findOne({ id: geneId });
	if (!gene) throw new AppError(ErrorCode.NotFound, "Gene not found");
	result = gene.toObject();

	const samples: ISamples[] = await Samples.find({ gene: gene._id });
	result.samples = samples;

	return result;
};
