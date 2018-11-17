const moment = require('moment');

const tokenUtils = require('../utils/token');
const errorHandler = require('../utils/error-handler');

const authorizeBooking = (req, res, next) => {
  try {
    if (!req.headers['authorization']) {
      throw new Error('Token is not valid');
    }

    const token = req.headers['authorization'].replace('Bearer ', '');
    const decoded = tokenUtils.decode(token);

    if (decoded.iss.booking_id) {
      req.booking_id = decoded.iss.booking_id;
      req.user_id = decoded.iss.user_id;
      req.booking_date = decoded.iss.date;
      req.role = 'default';
      return next();
    }

    if (moment(decoded.exp).isBefore(moment())) {
      throw new Error('Token is not valid');
    }

    req.user = decoded.iss;
    req.role = decoded.iss.type;

    next();
  } catch (err) {
    errorHandler(err, req, res)
  }
}

module.exports = authorizeBooking
