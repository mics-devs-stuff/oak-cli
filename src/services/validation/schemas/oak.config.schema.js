import Joi from 'joi';

const leafValidator = Joi.array().items(
    Joi.object({
        name: 
            Joi.string()
                .required(),
        folder: 
            Joi.string()
                .required(),
        script: 
            Joi.string()
                .required(),
        build_nodes_path:
            Joi.boolean(),
        options: [
            Joi.array().items(
                Joi.string()
                    .empty('')
            ),
            Joi.function()
        ],
    })
);
/**
 * Since the nodes can have a recursive object hierarchy, we need to make sure to declare
 * a function to recursively retrieve the validation schema.
 * @returns {JOI.ObjectSchema<any>} The Joi node object recursive validation.
 */
const nodesValidator = Joi.array().items(
        Joi.object({
            name: Joi.string()
                .required(),
            folder: Joi.string()
                .required(),
            leafs: leafValidator,
            nodes: Joi.link('#node'),
        }).xor('leafs', 'nodes').required()
    ).id('node');


/**
 * Returns the full config validation schema for the JOI library.
 */
export default Joi.object({
    trees: 
        Joi.array().items(
            Joi.object({
                name: 
                    Joi.string()
                        .required(),
                path: 
                    Joi.string()
                        .required(),
                nodes: nodesValidator
                    .required(),
            })
        ),
    pre_scripts: 
        Joi.array().items(
            Joi.object({
                name: 
                    Joi.string()
                        .required(),
                script: 
                    Joi.string()
                        .required(),
            })
        ),
    post_scripts: 
        Joi.array().items(
            Joi.object({
                name: 
                    Joi.string()
                        .required(),
                script: 
                    Joi.string()
                        .required(),
            })
        )
});