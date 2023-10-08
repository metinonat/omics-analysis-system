export enum ErrorCode {
	NotFound = 1,
	AlreadyExists = 2,
}

export enum HttpStatus {
	Success = 200,
	BadRequest = 400,
	NotFound = 404,
	InternalServerError = 500,
}

export class AppError extends Error {
	public code: ErrorCode;

	constructor(code: ErrorCode, message: string) {
		super(message);
		this.code = code;
	}
}
