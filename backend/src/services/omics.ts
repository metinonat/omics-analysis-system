import { ClientSession } from "mongoose";
import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db/db-models";
import { OmicsData } from "../models/omics";
import { PaginatedResponse } from "../models/requests";
import logger from "../utils/logger";

export const listOmicsData = async (page: number, perPage: number, order: "asc" | "desc"): Promise<PaginatedResponse<OmicsData>> => {
	let result: PaginatedResponse<OmicsData> = {
		data: [],
		page,
		perPage,
		total: 0,
	};

	result.total = await Omics.countDocuments();
	if (result.total > 0) {
		const omics = await Omics.find()
			.sort({ gene: order })
			.skip((page - 1) * perPage)
			.limit(perPage);

		for (let gene of omics) {
			let samples = await Samples.find({ gene: gene.id });
			result.data.push({
				...gene.toObject(),
				samples: samples,
			});
		}
	}
	return result;
};

export const getOmicsData = async (geneId: string): Promise<OmicsData> => {
	let result: OmicsData;

	const gene = await Omics.findOne({ id: geneId }).exec();
	logger.info(gene);
	if (!gene) throw new AppError(ErrorCode.NotFound, "Gene not found");
	result = gene.toObject();

	const samples = await Samples.find({ gene: gene._id });
	result.samples = samples;

	return result;
};

export const upsertOmics = async (gene: string, transcript: string[], trx: ClientSession) => {
	logger.info("upsertOmics");
	return await Omics.findOneAndUpdate({ gene: gene }, new Omics({ gene: gene, transcript: transcript }), { upsert: true, new: true, session: trx }).exec();
};
