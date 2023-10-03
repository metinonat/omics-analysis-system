import Joi, { valid } from 'joi'
import logger from './utils/logger';

type AppConfig = {
    MONGO_HOST: string;
    HTTP_PORT: number;
}

const validateAppConfig = (env: any) => {
    const validation = appConfigJoi.validate(env, {
        allowUnknown: true
    });
    if (validation.error) {
        logger.error("Config Validation Error: " + validation.error);
        throw new Error(validation.error.message);
    }
    return validation.value;
}

const appConfigJoi = Joi.object<AppConfig>({
    MONGO_HOST: Joi.string().required(),
    HTTP_PORT: Joi.number().optional().default(8080),
})

const config = validateAppConfig(process.env);
export default config;