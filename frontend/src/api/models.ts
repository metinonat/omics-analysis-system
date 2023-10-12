interface Gene {
  _id: string;
  gene: string;
  transcript: string;
}

interface Sample {
  _id: string;
  created: number;
  name: string;
  geneId: string;
  value: number;
  gene: string;
}

interface GeneAnalysis {
  id: string;
  gene: string;
  mean: number;
  stdDev: number;
  samples: Sample[];
}
