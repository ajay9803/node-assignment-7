import Joi from "joi";

// schema to validate todo while creating / updating
export const createTodoBodySchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required.",
  }),
  description: Joi.string().min(10).required().messages({
    "any.required": "Description is required.",
  }),
}).options({ stripUnknown: true });

// schema to validate todo id
export const getTodoParamsSchema = Joi.object({
  id: Joi.number().min(0).required().messages({
    "number.base": '"id" should be a number.',
    "number.min": '"id" should be greater than or equal to 0.',
    "any.required": '"id" is a required field.',
  }),
}).options({
  stripUnknown: true,
});
