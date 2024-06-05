//____________________ERROR SERVICE____________________
/**
 * Groups up warning and error messages
 */
import chalk from 'chalk';
import logSymbols from 'log-symbols';
/**
 * This is because ESM doesn't support require so 
 * in order to import json files it's needed
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/**
 * =========
 * CONSTANTS
 * =========
 */
const config            = require('../../config.json');
const PROMPTS           = config.prompts;
const OPTIONS           = config.options;
const MOLE              = config.name;
const MOLE_CONFIG_FILE  = config.config_file;

//ERRORS & WARNINGS
/**
 * Notifies the user that the option/argument used is not available
 * @returns void
 */
const commandNotAvailable = () => {
   console.log(`\n%s That's not the right command, sorry...`, chalk.hex(PROMPTS.warning.color).bold(PROMPTS.warning.message));
   console.log(`You can see the list of all available commands using \'${MOLE} ${OPTIONS.help.alias}\' or \'${MOLE} ${OPTIONS.help.cmd}\'\n`);
   process.exit(1);
};

/**
 * Notifies the user that there are no features to select
 * @param {string} relative_path the relative path used for directories listing
 * @returns void
 */
const noFeatures = (relative_path) => {
   console.log(`%s Looks like there are no features folders to select\n`, chalk.hex(PROMPTS.warning.color).bold(PROMPTS.warning.message));
   console.log(`Relative path: ${relative_path}\n`);
   process.exit(1);
};

/**
 * Prompts the oak config validation errors
 * @param {object} choices the user object choices
 * @param {boolean} is_detailed if the error list is detailed
 * @returns {Array} errors the error list to display
*/
const configValidationError = (errors, is_detailed) => {
   console.log(chalk.hex(PROMPTS.warning.color).bold(`\n${PROMPTS.validation.message}\n`));

   errors.forEach((error) => {
      console.log(`%s ${error.message}\n`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
   });

   if (!is_detailed) {
      console.log(`%s For a more detailed validation you can use "${MOLE} ${OPTIONS.config.cmd}"\n`, chalk.hex(PROMPTS.info.color).bold(PROMPTS.info.message));
   }

   process.exit(1);
};

/**
 * 
 */
const optionsIsNotAnArray = () => {
   console.log(`%s The options parameter in the schematic you've configured doesn't return an array!\n`, chalk.hex(PROMPTS.error.color).bold(PROMPTS.error.message));
   process.exit(1);
};


//INFO
/**
 * Notifies the user that the configuration file is already present
 */
const configAlreadyPresent = () => {
   console.log(`\n%s There's already a configuration file out there!`, chalk.hex(PROMPTS.info.color).bold(PROMPTS.info.message));
   console.log(`If you want to remove it, use \'${chalk.bold(`rm ${MOLE_CONFIG_FILE}`)}\', and just obliterate it!\n`);
   process.exit(1);
};

/**
 * Notifies the user that the configuration file is not present
 * @returns void
 */
const noConfigFile = () => {
   console.log(`\n%s Looks like there's no configuration file here...`, chalk.hex(PROMPTS.info.color).bold(PROMPTS.info.message));
   console.log(`Try run \'${chalk.underline('oak init')}\' to generate a brand new one!\n`);
   process.exit(1);
};

/**
 * Notifies the user that the custom configuration file is not present
 * @param {string} config_name the config file name
 */
const noCustomConfigFile = (config_name) => {
   const config_names = oakService.getConfigsNames();
   console.log(`\n%s Looks like there's no ${chalk.bold(config_name)} configuration folder on oak...`, chalk.hex(PROMPTS.info.color).bold(PROMPTS.info.message));
   console.log(`Available ones are: ${chalk.underline(config_names.join(', '))}\n`);
   process.exit(1);
};

/**
 * Notifies the user that the configuration file is not present
 */
const validationSucceeded = () => {
   const success_message = `${PROMPTS.validation.message} ${PROMPTS.success.message}\n`;
   console.log(`\n${logSymbols.success}`, chalk.hex(PROMPTS.success.color).bold(success_message));
   process.exit(1);
};

export default {
   errors: {
      noFeatures,
      commandNotAvailable,
      configValidationError,
      optionsIsNotAnArray
   },
   successes: {
      validationSucceeded
   },
   info: {
      configAlreadyPresent,
      noConfigFile,
      noCustomConfigFile
   }
};