const moment = require('moment');

const tokenUtils = require('../utils/token');
const errorHandler = require('../utils/error-handler');

const authorize = (req, res, next) => {
  try {
    const token = req.headers['authorization'].replace('Bearer ', '');
    const decoded = tokenUtils.decode(token);

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

module.exports = authorize
