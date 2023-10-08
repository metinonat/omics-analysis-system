import axios, { AxiosError, AxiosResponse } from "axios";
import logger from "../src/utils/logger";

export type TestResponse<T> = { status: number; data: T } | undefined;

export const request = async <T>(params: { method: "GET" | "POST" | "UPDATE" | "DELETE"; url: string; body?: any; logError?: boolean }): Promise<{ status: number; data: T } | undefined> => {
	try {
		let response: AxiosResponse<T>;
		if (!params.logError) params.logError = false;

		switch (params.method) {
			case "POST":
				response = await axios.post<T>(params.url, params.body);
				break;
			case "UPDATE":
				response = await axios.put<T>(params.url, params.body);
				break;
			case "DELETE":
				response = await axios.delete<T>(params.url);
				break;
			case "GET":
			default:
				response = await axios.get<T>(params.url);
				break;
		}
		return response;
	} catch (error) {
		if (params.logError) {
			logger.error(`request to ${params.url} returned: ${error}`);
		}
		if (error instanceof AxiosError) {
			return error.response;
		}
	}
	return undefined;
};
