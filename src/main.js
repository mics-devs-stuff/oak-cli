/**
 * =========
 * LIBRARIES
 * =========
 */
import oakService from './services/oak.service.js';
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



export async function oak(args) {
    const options = oakService.parseArgs(args);

    /**
     * First see if the user wants to check documentation documentation
     */
    if (options.check_docs) {
        const topic = options.doc_topic || DEFAULT_DOC;

        oakService.openDocumentation(topic);
    }
    /**
     * Endless feature calls recursively the main fucntion with the same args
     */
    // if (options.endless) {
    //     oak(args);
    // }
}