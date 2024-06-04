const config = {
    pre_scripts: [
        {
            name: 'Pre script name',
            script: 'echo pre script'
        }
    ],
    post_scripts: [
        {
            name: 'post script name',
            script: 'echo post script'
        }
    ],
    trees: [{
        name: 'project1',
        path: 'path/to/the/project', // must end with no slash...
        nodes: {
            node_1: [
                {
                    name: 'node 1',
                    folder: 'node-1-folder',
                    leafs: [
                        {
                            name: 'leaf1-of-node-1',
                            script: 'echo hello from node 1',
                            folder: 'leaf-folder',
                            build_nodes_path: true,
                            /**
                             * Can also be present a function that takes one argument, which is the oak object.
                             * and returns the full command to execute.
                             */
                            options: ['--project=something']
                        }
                    ],

                }
            ]
        }
    }],
};

export default config;