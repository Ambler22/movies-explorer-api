const router = require('express').Router();

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/not-found-error');

const { login, createUser } = require('../controllers/users');
const { validateAuthorization, validateRegistration } = require('../middlewares/validation');

router.post('/signup', validateRegistration, createUser);

router.post('/signin', validateAuthorization, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена.');
});

module.exports = { router };
