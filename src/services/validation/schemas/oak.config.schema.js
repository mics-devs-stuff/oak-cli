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
 * a fucntion to recursively retrieve the validation schema.
 * @returns {JOI.ObjectSchema<any>} The Joi node object recursive validation.
 */
const nodesValidator = Joi.object().pattern(/^/,
        Joi.object({
            name: Joi.string()
                .required(),
            folder: Joi.string()
                .required(),
            leafs: leafValidator,
            nodes: Joi.link('#node'),
        }).nand('leafs', 'nodes')
    ).id('node');




/**
 * Returns the full config validation schema for the JOI library.
 */
export default Joi.object({
    question: 
        Joi.string()
            .empty(),
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
        )
});