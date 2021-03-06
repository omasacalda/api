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

    const bookingDate = moment(data.date).format('DD.MM.YYYY');
    const msg = {
      to: data.email,
      from: 'O masa calda <noreply@omasacalda.ro>',
      templateId: config.SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": 'Rezervare O Masa Calda',
        "title": `Te-ai programat cu succes in data de ${bookingDate}`,
        "booking_url": `${config.WEB_HOST}/booking/${bookingToken}`,
        "user_first_name": data.first_name,
        "user_last_name": data.last_name,
        "user_email": data.email,
        "date": bookingDate,
        "city": city.name,
        "person_count": data.person_count,
        "phone_number": data.phone
      }
    };
    Mailer.send(msg);


    // Send mail to admin
    Mailer.send({
      to: config.ADMIN_EMAIL,
      from: 'O masa calda <noreply@omasacalda.ro>',
      templateId: config.SENDGRID_ADMIN_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": '[Admin] Rezervare O Masa Calda',
        "title": `A fost facuta o noua rezervare in data de ${bookingDate}`,
        "user_first_name": data.first_name,
        "user_last_name": data.last_name,
        "user_email": data.email,
        "date": bookingDate,
        "city": city.name,
        "person_count": data.person_count,
        "phone_number": data.phone,
        "type": data.type,
        "company_name": data.company_name
      }
    })

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

bookingRoute.get('/:id', authorizeBooking, async (req, res) => {
  try {
    const bookingID = req.params.id;
    const booking = await bookingService.get(bookingID);

    const role = req.role;

    if (role === 'default' && (booking.id !== req.booking_id || booking.user_id !== req.user_id)) {
      throw Object.assign({}, new Error(), { message: 'Access denied' });
    }

    if (role !== 'default' && role !== 'admin') {
      throw Object.assign({}, new Error(), { message: 'Access denied' });
    }

    return res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    errorHandler(err, req, res)
  }
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

    const user = await userService.get(booking.user_id);
    const city = await cityService.get(booking.city_id);

    const bookingDateString = bookingDate.format('DD.MM.YYYY');

    // Send mail to admin
    Mailer.send({
      to: config.ADMIN_EMAIL,
      from: 'O masa calda <noreply@omasacalda.ro>',
      templateId: config.SENDGRID_ADMIN_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": '[Admin] Anulare Rezervare O Masa Calda',
        "title": `Rezervarea din data de ${bookingDateString} a fost anulata`,
        "user_first_name": user.first_name,
        "user_last_name": user.last_name,
        "user_email": user.email,
        "date": bookingDateString,
        "city": city.name,
        "person_count": booking.person_count,
        "phone_number": user.phone,
        "type": booking.type,
        "company_name": booking.company_name
      }
    })

    return res.json({
      success: true
    });
  } catch (err) {
    errorHandler(err, req, res)
  }
});

bookingRoute.get('/', (request, response) => {
  bookingService.getAll(request.query.offset, request.query.limit || 9999)
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
