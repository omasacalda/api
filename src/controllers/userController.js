const userRoute = require('express').Router();
const userService = require('../services/userService');
const Util = require('../commons/util');
const STATUS_CODE = require('../commons/constants/statusCode');
const authorize = require('../middlewares/authorize');
const errorHandler = require('../utils/error-handler');

userRoute.get('/profile', authorize, async (req, res) => {
  try {
    console.log('req.user', req.user);
    const user = await userService.get(req.user.id);
    return res
      .status(STATUS_CODE.OK)
      .json({
        success: true,
        data: user
      });
  } catch (err) {
    errorHandler(err, req, res)
  }
});

module.exports = userRoute;
