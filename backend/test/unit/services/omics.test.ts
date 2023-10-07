import { IOmics } from "../../../src/models/interface";
import { request } from "../../utils";

const app = "http://localhost:8080";

describe("Omics endpoints", () => {
    it("GET omics/:geneId Not Found", async () => {
        let gene = "GeneNotFound";
        const res = await request<IOmics>("GET", `${app}/omics/${gene}`);
        
        expect(res).toBeDefined();
        expect(res?.status).toBe(404);
    });
});
