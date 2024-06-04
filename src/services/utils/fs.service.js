/**
 * ==========
 * FS SERVICE
 * ==========
 * 
 */
import { readdirSync } from 'fs';

/**
 * DIRNAME AND FILENAME
 */
 import path from 'path';
 import { fileURLToPath } from 'url';
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);


/**
 * ================================
 * ======== EXPORT METHODS ========
 * ================================
 */

/**
 * Gets all the directories of a specific path
 * @param {string} path the path to get the directories from
 * @returns an array of all the directories of the specific path
 */
 const getDirectories = (path) => {
    try {
        return readdirSync(path, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
    } catch (error) {
        return [];
    }
};

export default {
    __filename,
    __dirname,
    getDirectories
};