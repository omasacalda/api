const STATUS_CODE = require('../commons/constants/statusCode');

const login = (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      throw new Error('Please complete all required fields')
    }

    next();
  } catch (err) {
    next({ status: STATUS_CODE.BAD_REQUEST, message: `${err}` });
  }
}

module.exports = {
  login
}
