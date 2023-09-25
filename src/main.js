/**
 * =========
 * LIBRARIES
 * =========
 */
import core from './services/oak/core.service.js';
import helpService from './services/oak/help.service.js';
import configService from './services/config.service.js';

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

const config = require('./config.json');


/**
 * =========
 * CONSTANTS
 * =========
 */

const DEFAULT_DOC = config.docs.oak.name;


/**
 * =========
 * VARIABLES
 * =========
 */

let choices = {};
let oak_config;


export async function oak(args) {
    const options = core.parseArgs(args);

    /**
     * First see if the user wants to check the documentation
     */
    if (options.check_docs) {
        const topic = options.doc_topic || DEFAULT_DOC;

        helpService.openDocumentation(topic);
    } else if (options.help) {
        helpService.showCommands();
    } else if (options.version) {
        helpService.promptVersion();
    }


    /**
     * OAK CONFIG INIT PROCESS
     * Here we define the configuration init flow.
     * First and foremost, we check and obtain the configuration file.
     * Second step is the validation with the JOI library.
     */
    oak_config = await configService.initConfig(options);

    // CONFIG VALIDATION
    if (options.validate) {
        configService.validate(oak_config, true);
    } else {
        configService.validate(oak_config);
    }

    /**
     * Endless feature calls recursively the main fucntion with the same args
     */
    // if (options.endless) {
    //     oak(args);
    // }
}