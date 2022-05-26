export default {
    question: 'In which project you need to generate stuff',
    trees: {
        tree_1: {
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
                            options: '--project=something' // options gets appended after the name or path
                        }
                    ],
                }
            }
        },
    }
};
  