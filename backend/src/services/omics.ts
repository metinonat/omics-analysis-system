import mongoose, { Schema } from "mongoose";
import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db/db-models";
import { IOmics } from "../models/db/interface";
import { OmicsData } from "../models/omics";
import { PaginatedResponse } from "../models/requests";

export const listOmicsData = async (page: number, perPage: number, order: "asc" | "desc", filter?: string): Promise<PaginatedResponse<OmicsData>> => {
	let result: PaginatedResponse<OmicsData> = {
		total: 0,
		page,
		perPage,
		data: [],
	};
	let filterObj = {};
	if (filter) filterObj = { gene: { $regex: ".*" + filter + ".*" } };

	result.total = await Omics.countDocuments();
	if (result.total > 0) {
		const omics = await Omics.find(filterObj)
			.sort({ gene: order })
			.skip((page - 1) * perPage)
			.limit(perPage)
			.select("-__v");

		for (let gene of omics) {
			let samples = await Samples.find({ geneId: gene.id }).select("-__v").exec();
			result.data.push({
				...gene.toObject<IOmics>(),
				samples: samples,
			});
		}
	}
	return result;
};

export const listOmicsForInputData = async (filter?: string) => {
	let filterObj = {};
	if (filter) filterObj = { name: { $regex: ".*" + filter + ".*" } };
	const omics = await Omics.find(filterObj).sort({ gene: "desc" }).select("-__v");
	return omics.map((gene) => gene.toObject());
};

export const getOmicsData = async (params: { geneId?: Schema.Types.ObjectId; gene?: string }): Promise<OmicsData> => {
	let result: OmicsData;
	let gene;
	if (params.geneId) {
		gene = await Omics.findById(params.geneId).select("-__v").exec();
	}
	if (params.gene && !gene) {
		gene = await Omics.findOne({ gene: params.gene }).select("-__v").exec();
	}
	if (!gene) throw new AppError(ErrorCode.NotFound, "Gene not found");
	result = gene.toObject();

	const samples = await Samples.find({ geneId: gene.id }).select("-__v").exec();
	result.samples = samples;

	return result;
};

export const upsertOmics = async (geneId: mongoose.Types.ObjectId, gene: string, transcript: string[]) => {
	const existing = await Omics.findById(geneId).select("-__v").exec();
	if (existing) {
		let result = await Omics.updateOne({ _id: geneId }, { gene: gene, transcript: transcript });
		return result.upsertedId;
	} else {
		let result = await Omics.findOneAndUpdate({ gene: gene }, { gene: gene, transcript: transcript });
		if (!result) {
			result = await Omics.create({ gene: gene, transcript: transcript });
		}
		return result.id;
	}
};

export const findOrInsertOmics = async (gene: string, transcript: string[]) => {
	const existing = await Omics.findOne({ gene: gene }).select("-__v").exec();
	if (existing) {
		return existing.id;
	} else {
		let result = await Omics.create({ gene: gene, transcript: transcript });
		return result.id;
	}
};
