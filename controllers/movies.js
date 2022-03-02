const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Невалидный id.'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм по указанному _id не найден.'));
      } if (owner !== String(movie.owner)) {
        next(new ForbiddenError('Вы не можете удалить этот фильм.'));
      }

      Movie.findByIdAndRemove(movie)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Невалидный id.'));
          } else {
            next(new ServerError('Произошла ошибка'));
          }
        });
    })
    .catch(next);
};
