import chalk from 'chalk';
import cfonts from 'cfonts';
import table from 'text-table';
import { exec } from 'child_process';
import { config, package_json } from './core.service.js';



/** 
 * =====================
 * DOCUMENTATION & INFOS
 * =====================
 */

/**
 * Opens a specific documentation url
 * @param {string} topic the topic to see the documentation from
 * @returns void
 */

const openDocumentation = (topic) => {
    const documentation = DOCS[topic];

    /**
     * Just a check in case
     */
    if (documentation) {
        const doc_url = documentation.url;
        const command = `${OPEN_CMD_URL} ${doc_url}`;

        /**
         * For this command is required a try/catch logic since it doesn't alway enter inside the callback
         */
        try {
            exec(command, (err) => {
                if (err) {
                    console.log(`%s ${err}`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
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
        console.error(`%s Currently, there's no documentation for this ...`, chalk.hex(PROMPTS.warning.color).bold(PROMPTS.warning.message));
    }

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


export default { 
    openDocumentation, 
    promptVersion, 
    showCommands 
};