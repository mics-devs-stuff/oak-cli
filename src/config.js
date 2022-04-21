export default {
    "name": "oak",
    "config_file": "oak.config.js",
    "templates_folder": "templates",
    "options": {
        "init": {
            "cmd": "init",
            "name": "Init",
            "description": "Initializes the oak configuration file"
        },
        "version": {
            "cmd": "v",
            "name": "Version",
            "description": "Shows the oak version and some extra infos"
        },
        "help": {
            "cmd": "help",
            "name": "Help",
            "description": "Shows the available commands",
            "alias": "h"
        },
        "validate": {
            "cmd": "validate",
            "name": "Validate",
            "description": "Validates the oak.config.js file"
        }
    },
    "args": {
        "doc": {
            "cmd": "--doc",
            "alias": "-d",
            "name": "Help",
            "description": "Opens the documentation of a specific topic"
        },
        "endless": {
            "cmd": "--endless",
            "alias": "-e",
            "name": "Endless",
            "description": "Oak will run endlessly till the user will stop it"
        }
    },
    "docs": {
        "oak": {
            "name": "oak",
            "url": ""
        },
        "config": {
            "name": "configuration",
            "url": ""
        },
        "help": {
            "name": "commands",
            "url": ""
        }
    }
};