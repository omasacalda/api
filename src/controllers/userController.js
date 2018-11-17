const userRoute = require('express').Router();
const userService = require('../services/userService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');

userRoute.post('/', (request, response) => {
  userService.save(request.body)
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

userRoute.get('/:id', (request, response) => {
  userService.get(request.params.id)
    .then(data => {
      response.status(STATUS_CODE.OK);
      response.json(data);
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

userRoute.delete('/:id', (request, response) => {
  userService.delete(request.params.id)
    .then(() => {
      response.status(STATUS_CODE.NO_CONTENT);
      response.end();
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

userRoute.put('/:id', (request, response) => {
  userService.update(request.params.id, request.body)
    .then(data => {
      response.status(STATUS_CODE.OK);
      response.json(data);
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

userRoute.get('/', (request, response) => {
  userService.getAll(request.query.offset, request.query.limit)
    .then(data => {
      if (!data || data.size === 0) {
        response.status(STATUS_CODE.NO_CONTENT);
        response.end();
      } else {
        response.status(STATUS_CODE.OK);
        response.json(data);
      }
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

module.exports = userRoute;