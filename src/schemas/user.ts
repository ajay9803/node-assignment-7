import Joi from "joi";

// schema to validate request body while creating / updating user
export const createUserBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid format.",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required.",
      "string.min": "Password must be atleast 8 characters.",
      "password.uppercase":
        "Password must have atleast one uppercase character.",
      "password.lowercase":
        "Password must have atleast one lowercase character.",
      "password.special": "Password must have atleast one special character.",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),
}).options({
  stripUnknown: true,
});

// schema to validate login credentials of user
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid format.",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required..",
      "string.min": "Password must be atleast 8 characters..",
      "password.uppercase":
        "Password must have atleast one uppercase character..",
      "password.lowercase":
        "Password must have atleast one lowercase character..",
      "password.special": "Password must have atleast one special character..",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),
}).options({
  stripUnknown: true,
});

// schema to validate user id
export const getUserParamsSchema = Joi.object({
  id: Joi.number().min(0).required().messages({
    "number.base": '"id" should be a number.',
    "number.min": '"id" should be greater than or equal to 0.',
    "any.required": '"id" is a required field.',
  }),
}).options({
  stripUnknown: true,
});
