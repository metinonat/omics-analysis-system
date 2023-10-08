import { HttpStatus } from "../../../src/models/common";
import { IOmics } from "../../../src/models/db/interface";
import { PaginatedResponse } from "../../../src/models/requests";
import { request } from "../../utils";

const app = "http://localhost:8080";

describe("Omics endpoints", () => {
	const newGene = "Gene1";
	it("POST omics", async () => {
		const res = await request<IOmics>({ method: "POST", url: `${app}/omics`, body: { gene: newGene, transcript: ["transcript1", "transcript2"] } });

		expect(res).toBeDefined();
		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data).toBeDefined();
		expect(res?.data.gene).toBe(newGene);
	});
	it("GET omics", async () => {
		const res = await request<PaginatedResponse<IOmics>>({ method: "GET", url: `${app}/omics` });

		expect(res).toBeDefined();
		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data.page).toBe(1);
		expect(res?.data.perPage).toBe(10);
		expect(res?.data.data?.[0]?.gene).toBe(newGene);
		expect(res?.data.total).toBeGreaterThan(0);
	});
	it("GET omics/:geneId", async () => {
		const res = await request<IOmics>({ method: "GET", url: `${app}/omics/${newGene}` });

		expect(res).toBeDefined();
		expect(res?.status).toBe(HttpStatus.Success);
		expect(res?.data).toBeDefined();
		expect(res?.data.gene).toBe(newGene);
	});
	it("GET omics/:geneId Not Found", async () => {
		let gene = "GeneNotFound";
		const res = await request<IOmics>({ method: "GET", url: `${app}/omics/${gene}` });

		expect(res).toBeDefined();
		expect(res?.status).toBe(404);
	});
});
