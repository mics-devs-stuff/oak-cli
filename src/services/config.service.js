/**
 * ==============
 * CONFIG SERVICE
 * ==============
 * 
 */
import { existsSync } from 'fs';

import fsService from './fs.service.js';

import taskService from './task.service.js';
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
const OAK_CONFIG_PATH = `${process.cwd()}/${OAK_CONFIG}`;


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
        config = import(OAK_CONFIG_PATH);
    } else {
        /**
         * TODO
         * Log a no-config-file message
         */
    }

    return config;
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
    getConfigTemplatesNames
};