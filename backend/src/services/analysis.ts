import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db/db-models";
import { GeneAnalysisResponse } from "../models/requests";

export const getGeneAnalysis = async (geneId: string): Promise<GeneAnalysisResponse> => {
	const geneAnalysis: GeneAnalysisResponse = {
		sampleSize: 0,
		mean: 0,
		median: 0,
		variance: 0,
		standartDeviation: 0,
	};

	const gene = await Omics.findById(geneId).exec();
	if (!gene) {
		throw new AppError(ErrorCode.NotFound, `Gene not found!`);
	}

	geneAnalysis.sampleSize = await Samples.countDocuments({ geneId: geneId }).exec();
	if (geneAnalysis.sampleSize > 0) {
		const samples = await Samples.find({ geneId: geneId }).sort({ value: "asc" }).exec();
		let sum = 0;
		for (let sample of samples) {
			sum += sample.value;
		}
		geneAnalysis.mean = sum / geneAnalysis.sampleSize;

		if (geneAnalysis.sampleSize % 2 === 0) {
			geneAnalysis.median = (samples[geneAnalysis.sampleSize / 2].value + samples[geneAnalysis.sampleSize / 2 - 1].value) / 2;
		} else {
			geneAnalysis.median = samples[Math.floor(geneAnalysis.sampleSize / 2)].value;
		}

		let sumOfSquares = 0;
		for (let sample of samples) {
			sumOfSquares += Math.pow(sample.value - geneAnalysis.mean, 2);
		}
		geneAnalysis.variance = sumOfSquares / geneAnalysis.sampleSize;
		geneAnalysis.standartDeviation = Math.sqrt(geneAnalysis.variance);
	}
	return geneAnalysis;
};
