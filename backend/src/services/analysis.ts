import { PipelineStage } from "mongoose";
import { AppError, ErrorCode } from "../models/common";
import { Omics, Samples } from "../models/db/db-models";
import { GeneAnalysisResponse, ZScoreOutliersResponse } from "../models/requests";

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

export const getZScoreOutliers = async (threshold: number, genes: string[]): Promise<ZScoreOutliersResponse[]> => {
	const getAll = genes.length === 0;
	const pipeline: PipelineStage[] = [
		{
			$group: {
				_id: "$geneId",
				samples: {
					$push: {
						name: "$name",
						value: "$value",
						created: "$created",
					},
				},
			},
		},
		{
			$addFields: {
				mean: { $avg: "$samples.value" },
				stdDev: { $stdDevSamp: "$samples.value" },
			},
		},
		{
			$unwind: "$samples",
		},
		{
			$addFields: {
				zScore: {
					$cond: {
						if: { $ne: ["$stdDev", 0] },
						then: {
							$abs: {
								$divide: [{ $subtract: ["$samples.value", "$mean"] }, "$stdDev"],
							},
						},
						else: 0,
					},
				},
			},
		},
		{
			$match: {
				zScore: { $gt: threshold },
			},
		},
		{
			$lookup: {
				from: "omics",
				localField: "_id",
				foreignField: "_id",
				as: "omicsInfo",
			},
		},
		{
			$addFields: {
				geneInfo: { $arrayElemAt: ["$omicsInfo", 0] },
			},
		},
	];
	if (!getAll) {
		pipeline.push({
			$match: {
				"geneInfo.gene": { $in: genes },
			},
		});
	}
	pipeline.push({
		$group: {
			_id: "$_id",
			gene: { $first: "$geneInfo.gene" },
			mean: { $first: "$mean" },
			stdDev: { $first: "$stdDev" },
			samples: {
				$push: "$samples",
			},
		},
	});
	const outliers = await Samples.aggregate(pipeline);
	return outliers;
};

export const getChartData = async (genes: string[]): Promise<any> => {
	const genesList = await Omics.find({ gene: { $in: genes } }).exec();
	if (!genesList) {
		throw new AppError(ErrorCode.NotFound, `Gene not found!`);
	}
	const labels = await Samples.find({ geneId: { $in: genesList.map((gene) => gene.id) } })
		.sort({ created: "asc" })
		.distinct("name")
		.exec();
	const samples = await Samples.find({ geneId: { $in: genesList.map((gene) => gene.id) } })
		.sort({ created: "asc" })
		.exec();
	const maxExpression = samples.reduce((max, sample) => (sample.value > max ? sample.value : max), 0);
	const minExpression = samples.reduce((min, sample) => (sample.value < min ? sample.value : min), 0);
	return {
		labels,
		datasets: genesList.map((gene) => {
			let data = [];
			for (let i = 0; i < labels.length; i++) {
				data.push(samples.find((sample) => sample.name === labels[i] && sample.geneId == gene.id)?.value ?? -1);
			}
			return {
				label: gene.gene,
				data,
			};
		}),
		max: maxExpression + Math.floor(maxExpression * 0.1),
		min: minExpression - Math.floor(minExpression * 0.1),
	};
};

export const getBoxPlotData = async (threshold: number, genes: string[]): Promise<any> => {
	const analysis: ZScoreOutliersResponse[] = await getZScoreOutliers(threshold, genes);
	const genesList = await Omics.find({ gene: { $in: genes } }).exec();
	if (!genesList) {
		throw new AppError(ErrorCode.NotFound, `Gene not found!`);
	}
	const samples = await Samples.find({ geneId: { $in: genesList.map((gene) => gene.id) } })
		.sort({ created: "asc" })
		.exec();
	if (samples.length === 0 || genes.length === 0) {
		throw new AppError(ErrorCode.NotFound, `No data to show!`);
	}
	let outliersSet: { x: string; y: number }[] = [];
	analysis.map((item) => {
		item.samples.map((sample) => {
			outliersSet.push({ x: item.gene, y: sample.value });
		});
	});
	return {
		series: [
			{
				name: "Gene Expression",
				type: "boxPlot",
				data: genesList.map((gene) => {
					const zScoreResult = analysis.find((item) => item.gene == gene.gene);
					const geneSamples = samples.filter((sample) => sample.geneId == gene.id && !zScoreResult?.samples.map((s) => s.name).includes(sample.name));
					const min = geneSamples.reduce((min, sample) => (sample.value < min ? sample.value : min), 0);
					const max = geneSamples.reduce((max, sample) => (sample.value > max ? sample.value : max), 0);
					const q1 = geneSamples[Math.floor(geneSamples.length / 4)]?.value ?? 0;
					const q2 = geneSamples[Math.floor(geneSamples.length / 2)]?.value ?? 0;
					const q3 = geneSamples[Math.floor((geneSamples.length * 3) / 4)]?.value ?? 0;
					return {
						x: gene.gene,
						y: [min, q1, q2, q3, max],
					};
				}),
			},
			{
				name: "outliers",
				type: "scatter",
				data: outliersSet,
			},
		],
	};
};
