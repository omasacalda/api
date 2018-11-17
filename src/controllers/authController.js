const authRoute = require('express').Router();

const bookingService = require('../services/bookingService');
const userService = require('../services/userService');
const cityService = require('../services/cityService');
const authService = require('../services/authService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');
const errorHandler = require('../utils/error-handler');
const authValidator = require('../validators/auth');
const token = require('../utils/token');

authRoute.post('/', authValidator.login, async (req, res) => {
  try {
    const data = req.body;
    const token = await authService.login(data);

    return res
      .status(STATUS_CODE.OK)
      .json({
        success: true,
        data: {
          token
        }
      });
  } catch (err) {
    errorHandler(err, req, res)
  }
});

module.exports = authRoute;
