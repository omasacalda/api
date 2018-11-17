const bookingRoute = require('express').Router();
const bookingService = require('../services/bookingService');
const userService = require('../services/userService');
const cityService = require('../services/cityService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');
const errorHandler = require('../utils/error-handler');
const bookingValidator = require('../validators/booking');
const token = require('../utils/token');

bookingRoute.post('/', bookingValidator, async (req, res) => {
  try {
    const data = req.body;

    const city = await cityService.get(data.city_id);

    // Create user
    const userID = await userService.save({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      type: 'default'
    });

    // Create booking
    const bookingID = await bookingService.save({
      ...data,
      city_id: city.id,
      user_id: userID
    });
    const bookingToken = token.generate({
      user_id: userID,
      booking_id: bookingID
    });
    const updatedBooking = await bookingService.update(bookingID, {
      token: bookingToken
    });

    return res
      .status(STATUS_CODE.OK)
      .json({
        success: true,
        data: {
          ...updatedBooking.dataValues,
          token: undefined
        }
      });
  } catch (err) {
    errorHandler(err, req, res)
  }
});

bookingRoute.get('/:id', (request, response) => {
  bookingService.get(request.params.id)
    .then(data => {
      response.status(STATUS_CODE.OK);
      response.json(data);
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

bookingRoute.delete('/:id', (request, response) => {
  bookingService.delete(request.params.id)
    .then(() => {
      response.status(STATUS_CODE.NO_CONTENT);
      response.end();
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

bookingRoute.put('/:id', (request, response) => {
  bookingService.update(request.params.id, request.body)
    .then(data => {
      response.status(STATUS_CODE.OK);
      response.json(data);
    })
    .catch(err => {
      response.status(err.status);
      response.json(err);
    });
});

bookingRoute.get('/', (request, response) => {
  bookingService.getAll(request.query.offset, request.query.limit)
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

module.exports = bookingRoute;
