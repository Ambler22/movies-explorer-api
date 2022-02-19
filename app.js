require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const { router } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const { limiter } = require('./middlewares/limiter');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const LEGAL_CORS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://movies.ex.nomoredomains.rocks',
  'https://movies.ex.nomoredomains.rocks',
  'http://api.movies.ex.nomoredomains.rocks',
  'https://api.movies.ex.nomoredomains.rocks',
];

app.use('*', cors({
  origin: LEGAL_CORS,
  credentials: true,
}));

app.use(requestLogger);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(router);

app.use(errors());
app.use(errorLogger);
app.use(error);

app.listen(PORT, () => {
  console.log(`App listen ${PORT}`);
});
