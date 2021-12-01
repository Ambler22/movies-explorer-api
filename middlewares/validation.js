const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validation = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Введена некорректная ссылка.');
};

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validation),
    trailer: Joi.string().required().custom(validation),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validation),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteMovieById = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateAuthorization = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validation,
  validateCreateMovie,
  validateDeleteMovieById,
  validateUpdateUser,
  validateRegistration,
  validateAuthorization,
};
