import { Schema } from "mongoose";
import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db/db-models";
import { ISamples } from "../models/db/interface";
import { GetSampleResponse, PaginatedResponse } from "../models/requests";

export const listSamplesData = async (
	page: number,
	perPage: number,
	order: "asc" | "desc",
	orderField: "gene" | "name" | "created",
	filterName: string
): Promise<PaginatedResponse<GetSampleResponse>> => {
	let result: PaginatedResponse<GetSampleResponse> = {
		total: 0,
		page,
		perPage,
		data: [],
	};
	let filter = {};
	if (filterName) filter = { name: { $regex: ".*" + filterName + ".*" } };
	result.total = await Samples.countDocuments();
	if (result.total > 0) {
		const samples = await Samples.find(filter)
			.sort({ orderField: order })
			.skip((page - 1) * perPage)
			.limit(perPage)
			.select("-__v");

		for (let sample of samples) {
			const gene = await Omics.findById(sample.geneId).select("gene").exec();
			if (!gene) throw new AppError(ErrorCode.NotFound, "Gene not found!");
			result.data.push({
				...sample.toObject<ISamples>(),
				gene: gene.gene,
			});
		}
	}
	return result;
};

export const getSample = async (sampleId: string): Promise<GetSampleResponse> => {
	let result: GetSampleResponse;
	const sample = await Samples.findById(sampleId).select("-__v").exec();
	if (!sample) throw new AppError(ErrorCode.NotFound, "Sample not found");

	const gene = await Omics.findById(sample.geneId).select("gene").exec();
	if (!gene) throw new AppError(ErrorCode.NotFound, "Gene not found!");

	result = sample.toObject();
	result.gene = gene.gene;
	return result;
};

export const upsertSample = async (sampleId: string, name: string, geneId: Schema.Types.ObjectId, value: number) => {
	const omics = await Omics.findById(geneId).exec();
	if (!omics) throw new AppError(ErrorCode.NotFound, "Gene not found!");

	if (sampleId) {
		const existing = await Samples.findById(sampleId).exec();
		if (!existing) throw new AppError(ErrorCode.NotFound, "Sample not found!");
		let result = await Samples.updateOne({ _id: sampleId }, { name: name, geneId: geneId, value: value });
		return result.upsertedId;
	} else {
		let filter: any = { name: name, geneId: geneId };

		const existing = await Samples.findOne(filter, { name: name, geneId: geneId, value: value }).exec();

		if (!existing) {
			let result = await Samples.create({ name: name, geneId: geneId, value: value });
			return result.id;
		} else {
			if (value === existing.value) {
				throw new AppError(ErrorCode.AlreadyExists, "Sample and gene pair is already exists with same value!");
			} else {
				let result = await Samples.updateOne({ _id: existing.id }, { name: name, geneId: geneId, value: value });
				return result.upsertedId;
			}
		}
	}
};

export const upsertSampleFromUpload = async (name: string, geneId: Schema.Types.ObjectId, value: number) => {
	let filter: any = { name: name, geneId: geneId };

	const existing = await Samples.findOne(filter).exec();

	if (!existing) {
		await Samples.create({ name: name, geneId: geneId, value: value });
	} else {
		await Samples.updateOne({ _id: existing.id }, { name: name, geneId: geneId, value: value });
	}
};
