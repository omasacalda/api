const STATUS_CODE = require('../commons/constants/statusCode');

const booking = (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      person_count,
      type,
      date,
      city_id
    } = req.body;

    const isEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (
      !(first_name.length > 2 ) ||
      !(last_name.length > 2 ) ||
      !(phone.length > 7 ) ||
      !(email.length) ||
      !isEmail.test(email) ||
      !(person_count > 3) ||
      !(person_count < 7) ||
      !date ||
      !city_id
    ) {
      throw new Error('Please complete all required fields')
    }

    next();
  } catch (err) {
    next({ status: STATUS_CODE.BAD_REQUEST, message: `${err}` });
  }
}

module.exports = booking
