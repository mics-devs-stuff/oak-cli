/**
 * =========
 * LIBRARIES
 * =========
 */
import oakService from './services/oak.service.js';

/**
 * ======
 * CONFIG
 * ======
 */


/**
 * =========
 * CONSTANTS
 * =========
 */



export async function oak(args) {
    const options = oakService.parseArgs(args);
    console.log(options);


    /**
     * Endless feature calls recursively the main fucntion with the same args
     */
    // if (options.endless) {
    //     oak(args);
    // }
}