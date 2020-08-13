const express = require('express');
require('dotenv').config();

const app = express();

// Esta parte é importante para poder converter o body que vem nas requisições.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Models
const User = require('./models/user');

// Middlewares
const dateMiddleware = require('./middlewares/date-middleware');

// Routes
const indexRoutes = require('./routes/index-routes');
const userRoutes = require('./routes/user-routes');

app.use(dateMiddleware);

app.use('/', indexRoutes);
app.use('/user', userRoutes);

module.exports = app;