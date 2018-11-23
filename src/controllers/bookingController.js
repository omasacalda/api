const moment = require('moment');
const bookingRoute = require('express').Router();

const config = require('../configs/config');
const bookingService = require('../services/bookingService');
const userService = require('../services/userService');
const cityService = require('../services/cityService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');
const errorHandler = require('../utils/error-handler');
const bookingValidator = require('../validators/booking');
const token = require('../utils/token');
const authorizeBooking = require('../middlewares/authorize-booking');
const Mailer = require('../services/Mailer');

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
    const booking = await bookingService.save({
      ...data,
      city_id: city.id,
      user_id: userID
    });
    const bookingToken = token.generate({
      user_id: userID,
      booking_id: booking.id
    });
    const updatedBooking = await bookingService.update(booking.id, {
      token: bookingToken
    });

    const bookingDate = moment(data.date).format('DD-MM-YYYY');
    const msg = {
      to: data.email,
      from: 'noreply@omasacalda.ro',
      subject: `O masa calda | Te-ai programat cu succes in data de ${bookingDate}`,
      html: `
        <div>
          <p>Hello</p>
          <a href='${config.WEB_HOST}/booking/${bookingToken}'>Anuleaza programarea</a>
        </div>
      `,
    };
    await Mailer.send(msg);

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

bookingRoute.delete('/:id', authorizeBooking, async (req, res) => {
  try {
    const bookingID = req.params.id;
    const booking = await bookingService.get(bookingID);

    const now = moment();
    const bookingDate = moment(booking.date);
    if (bookingDate.isBefore(now, 'day')) {
      throw Object.assign({}, new Error(), { message: `Can't delete a past booking` });
    }

    const role = req.role;
    if (role === 'default' && (booking.id !== req.booking_id || booking.user_id !== req.user_id)) {
      throw Object.assign({}, new Error(), { message: 'Access denied' });
    }

    if (role !== 'default' && role !== 'admin') {
      throw Object.assign({}, new Error(), { message: 'Access denied' });
    }

    await bookingService.delete(bookingID);

    return res.json({
      success: true
    });
  } catch (err) {
    errorHandler(err, req, res)
  }
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
