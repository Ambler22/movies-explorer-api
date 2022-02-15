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

const CORS_WHITELIST = [
  'http://178.154.221.199:3001',
  'http://api.movies.ex.nomoredomains.rocks',
  'http://movies.ex.nomoredomains.rocks',
  'https://movies.ex.nomoredomains.rocks',
  'http://localhost:3000',
];

const corsOption = {
  credentials: true,
  optionsSuccessStatus: 204,
  origin: function checkCorsList(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use('*', cors(corsOption));

/* const LEGAL_CORS = [
  'http://178.154.221.199:3001',
  'http://api.movies.ex.nomoredomains.rocks',
  'http://movies.ex.nomoredomains.rocks',
  'https://movies.ex.nomoredomains.rocks',
  'http://localhost:3000',
];

app.use('*', cors({
  origin: LEGAL_CORS,
  credentials: true,
})); */

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
