/**
 * ===========
 * OAK SERVICE
 * ===========
 * 
 * The OAK service provides support for all the main stuff regarding oak,
 * such as the arguments and options parsing and management of trees, nodes and leafs.
 */

import arg from 'arg';
import chalk from 'chalk';
import { exec } from 'child_process';
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

const DOCS = config.docs;
const CONFIG_ARGS = config.args;
const PROMPTS = config.prompts;


/**
 * =========
 * VARIABLES
 * =========
 */

let OPEN_CMD_URL = null;

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
                        options.init_config = args._[1];
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
                    options.doc_topic = 'config';
                    break;
    
                default:
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
            // SHOULD LOG COMMAND NOT AVAILABLE
        } else {
            throw err;
        }
    }
};


/** 
 * =============
 * DOCUMENTATION
 * =============
 */

/**
 * Opens a specific documentation url
 * @param {string} topic the topic to see the documentation from
 * @returns void
 */
 const openDocumentation = (topic) => {
    const documentation = DOCS[topic];

    //Checks if the documentation topic exists
    if (documentation) {
        const doc_url = documentation.url;
        const command = `${OPEN_CMD_URL} ${doc_url}`;

        /**
         * For this command is required a try/catch logic since it doesn't alway enter inside the callback
         */
        try {
            exec(command, (err) => {
                if (err) {
                    console.log(`%s ${err}`, chalk.keyword(PROMPTS.error.color).bold(PROMPTS.error.message));
                    // node couldn't execute the command
                    return;
                }
            });

            console.log(`\nCheck for the ${documentation.name} documentation at\n`, chalk.hex(PROMPTS.info.color)(doc_url));
        } catch (error) {
            console.error(error);
            console.error(`%s An error occurred while running the ${OPEN_CMD_URL} command`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
        }
    } else {
        console.error(`%s Currently there's no documentation for this topic...`, chalk.hex(PROMPTS.warning.color).bold(PROMPTS.warning.message));
    }

    process.exit(1);
};

export default {
    parseArgs,
    openDocumentation
};