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
import table from 'text-table';
import cfonts from 'cfonts';
import { exec } from 'child_process';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import openDocumentation from './help.service.js';


/**
 * ======
 * CONFIG
 * ======
 */

const config = require('../../config.json');
const package_json = require('../../../package.json');


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



/**
 * Prints all the commands options
 * @returns void
 */
 const showCommands = () => {

    // CONSTANTS
    const options = config.options;
    const args = config.args;

    // VARIABLES
    let options_rows = [];
    let args_rows = [];


    /**
     * Options table build
     */
    Object.keys(options).forEach((option) => {
        /**
         * Here we build the commands from the options
         */
        const command = chalk.hex(PROMPTS.info.color).bold(options[option].cmd);
        const option_description = `(${options[option].name}) ${options[option].description}`;

        options_rows.push([command, option_description]);
    });

    /**
     * Args table build
     */
    const args_keys = Object.keys(args);

    args_keys.forEach((arg) => {
        args_rows.push([chalk.hex(config.prompts.info2.color).bold(args[arg].cmd), `(${args[arg].name}) ${args[arg].description}`]);
    });

    /**
     * Options table prompt
     */
    console.log(`\n${chalk.hex(config.prompts.info.color).inverse('OPTIONS')}`);
    console.log(table(options_rows));

    /**
     * Args table prompt
     */
    console.log(`\n${chalk.hex(config.prompts.info2.color).inverse('ARGS')}`);
    console.log(table(args_rows));

    process.exit(1);
};

/**
 * Gets a cool ASCII name and achronym of the oak CLI. Also it prints the 
 * version and the npm packages that have been used.
 * @returns void
 */
const promptVersion = () => {
    const oak = config.name.toUpperCase();
    const oak_name = `${oak} CLI`;
    const cfonts_config = {
        font: 'block',              // define the font face
        align: 'left',              // define text alignment
        colors: ['green'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: false,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'  
    };

    //ASCII
    const oak_ascii = cfonts.render(oak_name, cfonts_config);

    /**
     * Prints name, achronym, version and description
     */

    console.log(oak_ascii.string);
    console.log('-----------------------------------------------------\n');

    console.log(`${oak} CLI: ${chalk.hex(config.prompts.success.color)(package_json.version)}`);
    console.log(`${package_json.description}\n`);

    /**
     * Builds the npm packages table
     */
    //TABLE
    //HEAD
    const TAB = '      ';
    const table_heads = table([
        ['Packages', `${TAB}  Version`]
    ]);
    console.log(table_heads);
    console.log('-----------------------------------------------------');

    //ROWS
    let table_rows = [];
    Object.keys(package_json.dependencies).forEach((name) => {
        table_rows.push([name, `${TAB}${package_json.dependencies[name].substring(1)}`]);
    });

    console.log(table(table_rows));
    console.log('\n');
    process.exit(1);
};

export default {
    parseArgs,
    openDocumentation,
    showCommands,
    promptVersion
};