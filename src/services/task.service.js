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
import { promisify } from 'util';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fsService from './fs.service.js';


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
        `../../${TEMPLATES_FOLDER}/${config_file}`
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

export default {
    startConfigCopy
};