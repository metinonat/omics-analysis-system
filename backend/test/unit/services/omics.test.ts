import { HttpStatus } from "../../../src/models/common";
import { IOmics } from "../../../src/models/db/interface";
import { OmicsData } from "../../../src/models/omics";
import { PaginatedResponse } from "../../../src/models/requests";
import { request } from "../../utils";

const app = "http://localhost:8080";

describe("Omics endpoints", () => {
	const newGene = "Gene2";
	it("POST omics", async () => {
		const res = await request<OmicsData>({ method: "POST", url: `${app}/omics`, body: { gene: newGene, transcript: ["transcript1", "transcript2"] }, logError: true });

		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data).toBeDefined();
		expect(res?.data.gene).toBe(newGene);
		expect(res?.data.transcript).toContain("transcript1");
		expect(res?.data.transcript).toContain("transcript2");
		expect(res?.data.samples.length).toBe(0);
	});
	it("GET omics", async () => {
		const res = await request<PaginatedResponse<IOmics>>({ method: "GET", url: `${app}/omics`, logError: true });

		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data.page).toBe(1);
		expect(res?.data.perPage).toBe(10);
		expect(res?.data.data?.[0]?.gene).toBe(newGene);
		expect(res?.data.total).toBeGreaterThan(0);
	});
	it("GET omics/:geneId", async () => {
		const res = await request<IOmics>({ method: "GET", url: `${app}/omics/${newGene}`, logError: true });

		expect(res).toBeDefined();
		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data).toBeDefined();
		expect(res?.data.gene).toBe(newGene);
	});
	it("GET omics/:geneId Not Found", async () => {
		let gene = "GeneNotFound";
		const res = await request<IOmics>({ method: "GET", url: `${app}/omics/${gene}`, logError: true });

		expect(res).toBeDefined();
		expect(res?.status).toBe(404);
	});
});
