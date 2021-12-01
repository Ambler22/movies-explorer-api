const router = require('express').Router();

const { createMovie, getMovies, deleteMovieById } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovieById } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovieById, deleteMovieById);

module.exports = router;
