/**
 * ============
 * TASK SERVICE
 * ============
 * 
 */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Listr from 'listr';
import { commandSync } from 'execa';
import { promisify } from 'util';

import fsService from '../utils/fs.service.js';
import { config } from '../oak/core.service.js';

/**
 * =========
 * CONSTANTS
 * =========
 */
const __dirname             = fsService.__dirname;
const access                = promisify(fs.access);
const TEMPLATES_FOLDER      = config.templates_folder;
const PROMPTS               = config.prompts;
const OAK_CONFIG            = config.config_file;


/**
 * ================================
 * ======== EXPORT METHODS ========
 * ================================
 */

/**
 * Runs the copy of the config file
 * @param {string} config_file the config file name
 * @returns true if everything is clear, if not will kill the process
 */
async function startConfigCopy(config_file) {
    let process_url = process.cwd();

    const config_path = path.resolve(
        __dirname,
        `../../../${TEMPLATES_FOLDER}/${config_file}`
    );

    try {
        access(config_path, fs.constants.R_OK);
    } catch (err) {
        console.error('%s An error occurred while accessing the config template', chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
        process.exit(1);
    }

    /**
     * If everything is clear on the current directory, will bind the file name to the destination url
     * because the fs.copyFileSync destination must be a file
     */
    process_url += `/${OAK_CONFIG}`;

    const tasks = new Listr(
        [
            {
                title: 'Copying config file',
                task: () => fs.copyFileSync(config_path, process_url),
            }
        ]);

    await tasks.run();
    console.log('%s OAK is ready!', chalk.hex(PROMPTS.success.color).bold(PROMPTS.success.message));
    return true;
}

/**
 * Checks if there are any extra scripts to be executed and adds them to the tasks list.
 * 
 * @param {Array} scripts - An array of script objects with properties: script, args, match, and name.
 * @param {Array} tasks_list - The list of tasks to be executed.
 */
const checkExtraScripts = (scripts, tasks_list) => {
    let tasks = [];

    // Iterate through each script in the scripts array
    scripts.forEach((script) => {
        /**
         * Check if the script has a match function and if it returns true, execute the script.
         * The match function is used to execute scripts conditionally based on options.
         */
        if (script.match === undefined || script.match(options)) { 
            let script_cmd;

            // If the script has args, construct the script command with arguments
            if (script.args) {
                const args = script.args(options);
                script_cmd = script.script + ' ' + args.join(' ');
            } else {
                // Otherwise, use the script command as is
                script_cmd = script.script;
            }

            // Create a task object with title, task function, and script command
            const task = {
                title: script.name,
                task: () => {
                    // Log the script execution
                    console.log(`\n%s`, chalk.bold(script));

                    try {
                        // Execute the script command using execaCommandSync
                        commandSync(script_cmd);
                        // Log success message
                        console.log(`\n%s Pre script ${script.name} finished!`, chalk.hex(PROMPTS.success.color).bold(PROMPTS.success.message));
                    } catch (error) {
                        // Log error message
                        console.error(`%s An error occurred while running the pre script ${script.name}`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
                        console.error(chalk.hex(PROMPTS.warning.color)(error));
                    }
                },
            };

            tasks.push(task);
        }
    });

    // Concatenate the tasks array with the tasks_list array
    tasks_list = tasks.concat(tasks_list);
}

//_______________EXECUTE COMMAND________________
/**
 * Executes via CLI the command
 * @param {string} command the command to be launched
 * @param {object} options the user selected options as names
 */
async function execute(command, options, oak_config) {
    const leaf = options.leaf;
    //COMMAND TASK
    let tasks_list = [
        {
            title: `Executed ${leaf} generation`,
            task: () => {
                console.log(`\n%s`, chalk.bold(command));

                try {
                    commandSync(command);
                    console.log(`\n%s The ${leaf} has been succesfully created!`, chalk.hex(PROMPTS.success.color).bold(PROMPTS.success.message));
                } catch (error) {
                    console.error(`%s An error occurred while generating the ${leaf}`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
                    console.error(chalk.hex(PROMPTS.warning.color)(error));
                }
            },
        }
    ];

    //PRE SCRIPTS
    if (oak_config.pre_scripts && oak_config.pre_scripts.length) {
        checkExtraScripts(oak_config.pre_scripts, tasks_list);
    }
    //POST SCRIPTS
    if (oak_config.post_scripts && oak_config.post_scripts.length) {
        checkExtraScripts(oak_config.post_scripts, tasks_list);
    }


    //BIND AND RUN TASKS
    const tasks = new Listr(tasks_list);
    await tasks.run();
}


export default {
    startConfigCopy,
    execute
};