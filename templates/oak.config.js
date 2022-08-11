const config = {
    question: 'In which project you need to generate stuff',
    trees: [{
        name: 'project1',
        path: 'path/to/the/project', // must end with no slash...
        nodes: {
            node_1: {
                name: 'node 1',
                folder: 'node-1-folder',
                leafs: [
                    {
                        name: 'leaf1-of-node-1',
                        script: 'echo hello',
                        folder: 'leaf-folder',
                        /**
                         * Can also be a function that takes one anrgument, which is the oak object.
                         * and returns the full command to execute.
                         */
                        options: ['--project=something']
                    }
                ],
            }
        }
    }],
};

export default config;