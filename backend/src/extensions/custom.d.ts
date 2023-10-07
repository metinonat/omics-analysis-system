declare namespace Express {
	export interface Request {
		validatedBody?: any;
		validatedQuery?: any;
		validatedParams?: any;
	}
}
