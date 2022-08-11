/**
 * ==================
 * VALIDATION SERVICE
 * ==================
 * 
 */
import schema from './schemas/oak.config.schema.js';

//CONSTANTS
/**
 * Options make the validation scalable based on the choices:
 * the abortEarly, for example, makes the validation stops at
 * the first error
 */
const DEFAULT_OPTIONS = {
    abortEarly: true
};

/**
 * 
 * @param {object} config the config object
 * @param {boolean} is_detailed flag for all error prompt
 * @returns the object result of the validation
 */
const validateSchema = (config, is_detailed) => {
    if (is_detailed) {
        DEFAULT_OPTIONS.abortEarly = false;
    }

    return schema.validate(config, DEFAULT_OPTIONS);
};

export default {
    validateSchema
};