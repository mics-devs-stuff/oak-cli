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
        nodes: [
            {
                name: 'node 1',
                folder: 'node-1-folder',
                leafs: [
                    {
                        name: 'leaf1-of-node-1',
                        script: 'echo "hello from node 1" >',
                        folder: 'leaf1-folder',
                        build_nodes_path: true,
                        options: ['--project=something']
                    },
                    {
                        name: 'leaf2-of-node-1',
                        script: 'echo hello from node 2',
                        folder: 'leaf2-folder',
                        build_nodes_path: true,
                        options: ['--force']
                    }
                ],
            }
        ]
    }],
};

export default config;