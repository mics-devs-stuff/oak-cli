/**
 * ==============
 * CONFIG SERVICE
 * ==============
 * 
 */
import { existsSync } from 'fs';
import logSymbols from 'log-symbols';
import chalk from 'chalk';

import fsService from './fs.service.js';
import taskService from './task.service.js';
import validationService from './validation/validation.service.js';
/**
 * This is because ESM doesn't support require so 
 * in order to import json files it's needed
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * ======
 * CONFIG
 * ======
 */

const config = require('../config.json');


/**
 * =========
 * CONSTANTS
 * =========
 */

const __dirname = fsService.__dirname;
const OAK_CONFIG = config.config_file;
const MAIN_CMD = config.name;
const OAK_CONFIG_PATH = `${process.cwd()}/${OAK_CONFIG}`;
const PROMPTS = config.prompts;
const OPTIONS = config.options;


/**
 * =========
 * VARIABLES
 * =========
 */



/**
 * ================================
 * ======== EXPORT METHODS ========
 * ================================
 */

/**
 * Does the initialization checks for the configuration file
 * @param {object} options the user command options to check
 * @returns void
 */
 const initConfig = async (options) => {
    const config_exists = existsSync(OAK_CONFIG_PATH);
    let config;

    
    /**
     * Checks if the user wants a config initialization and handles the different conditions.
     */
    if (options.init && !config_exists) {
        /**
         * This condition happens in case of an initialization from a template
         */
        if (options.config_template) {
            const config_names = getConfigTemplatesNames();
            
            /**
             * This checks if the template selected by the user is present
             */
            if (config_names.includes(options.config_template)) {
                await taskService.startConfigCopy(`${options.config_template}/${OAK_CONFIG}`);
            } else {
                /**
                 * TODO
                 * Log an no-custom-config-file message
                 */
                process.exit(1);
            }
        } else {
            await taskService.startConfigCopy(OAK_CONFIG);
        }

        process.exit(1);
    } else if (options.init && config_exists){
        /**
         * TODO
         * Log an already-present-config-file message
         */
        process.exit(1);
    }

    if (config_exists) {
        config = await import(OAK_CONFIG_PATH);
        /**
         * Spicy one: Basically, if we want to maintain the configuration file as a node module export,
         * when retrieving it dynamically from the current working directory, we need to take the whole configuration from
         * the 'default' attribute. Still don't know why, but since it works...
         */
        config = config.default;
    } else {
        /**
         * TODO
         * Log a no-config-file message
         */
    }

    return config;
};

/**
 * Validates the config
 * @param {object} config the configuration object
 * @param {boolean} details a detailed prompt of errors (used fot the specific validation command)
 */
 const validate = (config, details) => {
    const validation = validationService.validateSchema(config, details);

    if (validation.error) {
        console.log(chalk.hex(PROMPTS.warning.color).bold(`\n${PROMPTS.validation.message}\n`));
     
        validation.error.details.forEach((error) => {
           console.log(`%s ${error.message}\n`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
        });
     
        if (!details) {
           console.log(`%s For a detailed validation you can use "${MAIN_CMD} ${OPTIONS.validate.cmd}"\n`, chalk.hex(PROMPTS.info.color).bold(PROMPTS.info.message));
        }
     
        process.exit(1);
    }

    if (details) {
        const success_message = `${PROMPTS.validation.message} ${PROMPTS.success.message}\n`;
        console.log(`\n${logSymbols.success}`, chalk.hex(PROMPTS.success.color).bold(success_message));
        process.exit(1);
    }
};

/**
 * Gets the directories inside the templates folder
 * @returns {Array<string>} the folders where the config files resides
 */
 const getConfigTemplatesNames = () => {
    const config_path = path.resolve(
        __dirname,
        `../../../${TEMPLATES_FOLDER}`
    );

    return fsService.getDirectories(config_path);
};

export default {
    initConfig,
    validate,
    getConfigTemplatesNames
};