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
