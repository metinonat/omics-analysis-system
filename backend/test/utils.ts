import axios, { AxiosError, AxiosResponse } from "axios";
import logger from "../src/utils/logger";

export type TestResponse<T> = { status: number; data: T } | undefined;

export const request = async <T>(method: "GET" | "POST" | "UPDATE" | "DELETE", url: string, logError: boolean = false): Promise<{ status: number; data: T } | undefined> => {
	try {
		let response: AxiosResponse<T>;
		switch (method) {
			case "POST":
				response = await axios.post<T>(url);
				break;
			case "UPDATE":
				response = await axios.put<T>(url);
				break;
			case "DELETE":
				response = await axios.delete<T>(url);
				break;
			case "GET":
			default:
				response = await axios.get<T>(url);
				break;
		}
		return response;
	} catch (error) {
		if (logError) {
			logger.error(`request to ${url} returned: ${error}`);
		}
		if (error instanceof AxiosError) {
			return error.response;
		}
	}
	return undefined;
};
