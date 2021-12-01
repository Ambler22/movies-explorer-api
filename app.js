const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { router } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const { limiter } = require('./middlewares/limiter');

// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(router);
app.use(limiter);

app.use(errors());
app.use(errorLogger);
app.use(error);

app.listen(PORT, () => {
  console.log(`App listen ${PORT}`);
});
