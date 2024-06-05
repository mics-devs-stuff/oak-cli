/**
 * =========
 * LIBRARIES
 * =========
 */
import core from './services/oak/core.service.js';
import { config } from './services/oak/core.service.js';
import configService from './services/oak/config.service.js';
import helpService from './services/info/help.service.js';
import taskService from './services/oak/task.service.js';

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

const choices = {};
let oak_config;


export async function oak(args) {
    let options = core.parseArgs(args);

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

    if (!oak_config) {
        // logService.info.noConfigFile();
        console.log('no config');
        process.exit(1);
    }

    // CONFIG VALIDATION
    if (options.validate) {
        configService.validate(oak_config, true);
    } else {
        configService.validate(oak_config);
    }

    /**
     * Questions
     */
    
    // TREE
    options = await core.chooseTree(oak_config.trees, choices, options);
    
    options = await core.chooseLeaf(choices, options);

    // COMMAND BUILD
    let command;
    if (choices.leaf.build_nodes_path) {
        command = core.buildCommand(choices, options);
    } else {
        const command_options = choices.leaf.options;
        command = choices.leaf.script + (command_options && command_options.length ? ` ${command_options.join(' ')}` : '');
    }
    
    // COMMAND EXECUTION
    await taskService.execute(command, options, oak_config);

    /**
     * Endlessly calls the main fucntion with the same args
     */
    if (options.endless) {
        choices = {};
        oak(args);
    }
}