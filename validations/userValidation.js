
const Joi = require('joi');

const loginOrRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^.{2,30}$')).required(),
});

const personFormSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.date()
    .max('now')
    .iso()
    .required()
    .custom((value) => {
      const userAge = new Date().getFullYear() - new Date(value).getFullYear();
      if (userAge < 18) {
        throw new Joi.ValidationError('User must be 18 years or older');
      }
      return value;
    }),
  phoneNumber: Joi.string()
    .required().regex(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Mobile number must be a valid 10-digit number.',
      'any.required': 'Mobile number is required.',
    }),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  addresses: Joi.array().items(Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string(),
    country: Joi.string().required(),
  })).required(),
})


module.exports.loginOrRegisterValidator = (user) => {
  return loginOrRegisterSchema.validate(user);
};

module.exports.personInfoValidator = (user) => {
  return personFormSchema.validate(user);
};