export type PaginatedResponse<T> = {
	total: number;
	page: number;
	perPage: number;
	data: T[];
};
