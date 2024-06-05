/**
 * ===========
 * OAK SERVICE
 * ===========
 * 
 * The OAK service provides support for all the main stuff regarding oak,
 * such as the arguments and options parsing and management of trees, nodes and leafs.
 */

/**
 * TODO 
 * - import logService
 * - add logs across all file
 */

import arg from 'arg';
import inquirer from 'inquirer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * ============
 * PACKAGE JSON
 * ============
 */
export const package_json = require('../../../package.json');
export const config = require('../../config.json');


/**
 * =========
 * CONSTANTS
 * =========
 */

const CONFIG_ARGS = config.args;
const TEMPLATES_FOLDER = config.templates_folder;

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
    config_args[CONFIG_ARGS.doc.cmd] = Boolean;
    config_args[CONFIG_ARGS.endless.cmd] = Boolean;
    // ALIASES
    config_args[CONFIG_ARGS.doc.alias] = CONFIG_ARGS.doc.cmd;
    config_args[CONFIG_ARGS.endless.alias] = CONFIG_ARGS.endless.cmd;

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
                    // logService.errors.commandNotAvailable();
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
            // logService.errors.commandNotAvailable();
        } else {
            throw err;
        }
    }
};

/**
 * Based on the selected choice label it retrieves
 * the selected choice full object from the choices array
 * @param {string} selected the selected choice label
 * @param {array} choices the choices to retrieve the choice object from
 * @returns the selected choice object
 */
const getSelectedChoiceObject = (selected, choices) => {
    return choices.find((choice) => {
        return choice.name === selected;
    });
};

/**
 * Choses a specific tree
 * @param {object} config_trees the trees from the config
 * @param {object} choices the choices objects
 * @param {object} options the cli options
 * @returns the option object with the tree
 */
async function chooseTree(config_trees, choices, options) {
    let trees = [];
    config_trees.forEach((tree) => {
        trees.push(tree.name);
    });

    const questions = [];
    if (!options.tree) {
        const tree_question = {
            type: 'list',
            name: 'tree',
            message: 'Which tree?',
            choices: trees.sort()
        };

        questions.push(tree_question);
    }

    const answers = await inquirer.prompt(questions);

    /**
     * Retrieves the full object from the trees array
     */
    choices.tree = getSelectedChoiceObject(options.tree || answers.tree, config_trees);

    if (choices.tree === undefined) {
        // LOG SERVICE tree not found
        console.log('tree not found');
        process.exit(1);
    }

    return {
        ...options,
        tree: options.tree || answers.tree
    };
}
/**
 * Recursively digs through a hierarchical node structure to gather user input.
 *
 * @param {Array} nodes - The current level of nodes to display to the user.
 * @param {Number} [level=0] - The current level of recursion (default is 0).
 * @param {Object} options - An object to store user input at each level.
 * @param {Object} choices - An object to store the final selected choices.
 *
 * @returns {Object} The final selected options.
 */
const digNodes = async (nodes, level = 0, options, choices) => {
    /**
     * Initialize an empty array to store child nodes.
     */
    const child_nodes = [];

    /**
     * Iterate through the current level of nodes and push their names to the child_nodes array.
     */
    nodes.forEach((node) => {
        child_nodes.push(node.name);
    });

    /**
     * Initialize an empty array to store questions.
     */
    const questions = [];

    /**
     * Create a question object for the current level of nodes.
     */
    const node_question = {
        type: 'list',
        name: `node_${level}`,
        message: 'Select the node:',
        choices: child_nodes.sort()
    };

    /**
     * Add the question object to the questions array.
     */
    questions.push(node_question);

    /**
     * Prompt the user with the questions and store their answers.
     */
    const answers = await inquirer.prompt(questions);

    /**
     * Retrieve the full object from the trees array based on the user's answer.
     */
    choices[`node_${level}`] = getSelectedChoiceObject(options[`node_${level}`] || answers[`node_${level}`], nodes);

    /**
     * Store the user's answer in the options object.
     */
    options[`node_${level}`] = answers[`node_${level}`];

    /**
     * If the current node has child nodes, recursively call digNodes to traverse the hierarchy.
     */
    if (choices[`node_${level}`].nodes) {
        await digNodes(choices[`node_${level}`].nodes, level + 1, options, choices);
    } else {
        /**
         * If the current node is a leaf node, store its leafs in the choices object.
         */
        choices.leafs = choices[`node_${level}`].leafs;
        return options;
    }
};

/**
 * Recursively iterates over the nodes till it faces a leaf
 * @param {object} choices the choices objects
 * @param {object} options the feature options to bind the feature type
 * @returns the option object with the feature type
 */
async function chooseLeaf(choices, options) {

    const nodes = choices.tree.nodes;
    options = await digNodes(nodes, 0, options, choices);

    const leafs = choices.leafs;
    const leafs_names = [];

    leafs.forEach((leaf) => {
        leafs_names.push(leaf.name);
    });


    const questions = [];
    const tree_question = {
        type: 'list',
        name: 'leaf',
        message: 'Select the leaf to execute:',
        choices: leafs_names.sort()
    };

    questions.push(tree_question);

    const answers = await inquirer.prompt(questions);

    /**
     * Retrieves the full object from the leafs array
     */
    choices.leaf = getSelectedChoiceObject(options.leaf || answers.leaf, leafs);

    return {
        ...options,
        leaf: options.leaf || answers.leaf
    };
}

const getNodesPath = (choices) => {
    let path = '';
    let level = 0;
    while (choices[`node_${level}`]) {
        path += `${choices[`node_${level}`].folder.trim()}/`;
        level++;
    }
    return path.slice(0, -1);
};

/**
 * Build the final command to execute
 * @param {object} choices the user object choices
 * @returns the command string to execute
 */
const buildCommand = (choices) => {
    let command;
    const generation_path = `${choices.tree.path.trim()}/${getNodesPath(choices)}/${choices.leaf.folder ? choices.leaf.folder.trim() : ''}`
    command = `${choices.leaf.script} ${generation_path}`;

    /**
     * Checks the existance of the options and builds the command string
     */
    if (choices.leaf.options) {
        let script_options = [];

        // ? To implement
        // if (typeof choices.schematic.options === "function") {
        //     script_options = choices.schematic.options(options);

        //     if (!Array.isArray(script_options)) {
        //         logService.errors.optionsIsNotAnArray();
        //     }
        // } else
        if (
            Array.isArray(choices.leaf.options) &&
            choices.leaf.options.length
        ) {
            script_options = choices.leaf.options;
        }

        const string_options = script_options.join(' ');
        command += ` ${string_options}`;
    }

    return command;
};


/**
 * Gets all the oak configs names
 * FUTURE IMPLEMENTATION
 */
const getConfigsNames = () => {
    const config_path = path.resolve(__dirname, `../../../${TEMPLATES_FOLDER}`);
  
    return fsService.getDirectories(config_path);
};

export default {
    parseArgs,
    getSelectedChoiceObject,
    chooseTree,
    chooseLeaf,
    buildCommand,
    getConfigsNames
};