/**
 * ===========
 * OAK SERVICE
 * ===========
 * 
 * The OAK service provides support for all the main stuff regarding oak,
 * such as the arguments and options parsing and management of trees, nodes and leafs.
 */


import arg from 'arg';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import helpService from './help.service.js';

const {
    openDocumentation, 
    promptVersion, 
    showCommands 
} = helpService;

/**
 * ======
 * CONFIG
 * ======
 */

export const config = require('../../config.json');
export const package_json = require('../../../package.json');


/**
 * =========
 * CONSTANTS
 * =========
 */

const DOCS = config.docs;
const CONFIG_ARGS = config.args;
const PROMPTS = config.prompts;

/**
 * =========
 * VARIABLES
 * =========
 */

export let OPEN_CMD_URL = null;

/**
 * Choose the proper url command based by the OS
 */
switch (process.platform) {
    case 'win32':
        OPEN_CMD_URL = 'start';
        break;
    case 'darwin':
    default:
        OPEN_CMD_URL = 'open';
        break;
}


/**
 * ================================
 * ======== EXPORT METHODS ========
 * ================================
 */

/**
 * ===========
 * CLI OPTIONS
 * ===========
 */

/**
 * The parseArgs function uses the arg npm library, in order to parse
 * @param {Array} raw_args the arguments written by the user
 * @returns the parsed CLI options
 */
 const parseArgs = (raw_args) => {
    // CONFIG_ARGS DECLARATION
    const config_args = {};

    // CONFIG_ARGS INITIALIZATION
    config_args[CONFIG_ARGS.doc.cmd]                = Boolean;
    config_args[CONFIG_ARGS.endless.cmd]            = Boolean;
    // ALIASES
    config_args[CONFIG_ARGS.doc.alias]              = CONFIG_ARGS.doc.cmd;
    config_args[CONFIG_ARGS.endless.alias]          = CONFIG_ARGS.endless.cmd;

    try {
        const args = arg(
            config_args,
            {
                argv: raw_args.slice(2)
            }
        );

        const options = {};

        if (args._[0]) {
            switch (args._[0]) {
                // INIT
                case config.options.init.cmd:

                    options.init = true;
                    if (args._[1]) {
                        options.config_template = args._[1];
                    }
                    break;
                // VERSION
                case config.options.version.cmd:

                    options.version = true;
                    break;
                // HELP
                case config.options.help.alias:
                case config.options.help.cmd:
                    
                    options.help = true;
                    options.doc_topic = config.options.help.cmd;
                    break;
                // CONFIG
                case config.options.validate.cmd:

                    options.validate = true;
                    options.doc_topic = config.docs.config.name;
                    break;
    
                default:
                    process.exit(1);
                    // LOG COMMAND NOT AVAILABLE
                    break;
            }
        }

        return {
            check_docs: args[CONFIG_ARGS.doc.cmd] || false,
            endless: args[CONFIG_ARGS.endless.cmd] || false,
            ...options
        };
    } catch (err) {
        if (err.code === 'ARG_UNKNOWN_OPTION') {
            process.exit(1);
            // SHOULD LOG COMMAND NOT AVAILABLE
        } else {
            throw err;
        }
    }
};


export default {
    parseArgs,
    openDocumentation, 
    promptVersion, 
    showCommands
};