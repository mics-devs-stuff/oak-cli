// TODO MOVE DOCS AND INFO IN help.service.js
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

export default openDocumentation