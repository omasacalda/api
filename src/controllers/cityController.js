const cityRoute = require('express').Router();
const cityService = require('../services/cityService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');

cityRoute.post('/', (request, response) => {
  cityService.save(request.body)
    .then(id => {
      response.header('Location', Util.generateLocationUri(request, id));
      response.status(STATUS_CODE.CREATED);
      response.end();
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

cityRoute.get('/:id', (request, response) => {
  cityService.get(request.params.id)
    .then(data => {
      response.status(STATUS_CODE.OK);
      response.json(data);
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

cityRoute.get('/', (request, response) => {
  cityService.getAll(request.query)
    .then(data => {
      response.json({
        success: true,
        data
      });
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

module.exports = cityRoute;
