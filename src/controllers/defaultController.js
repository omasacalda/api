const defaultRoute = require('express').Router();

defaultRoute.get('/', (request, response, next) => {
  response.json({ message: 'Hello from masacalda API' });
});

module.exports = defaultRoute;
