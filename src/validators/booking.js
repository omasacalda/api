const STATUS_CODE = require('../commons/constants/statusCode');

const booking = (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      person_count,
      type, // ENUM ('companie', 'individual')
      date,
      city_id,
      company_name
    } = req.body;

    const isEmail = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (
      !(first_name.length > 2) ||
      !(last_name.length > 2) ||
      !(phone.length > 7) ||
      !email.length ||
      !isEmail.test(email) ||
      !(person_count > 1) ||
      !(person_count < 5) ||
      !date ||
      !city_id ||
      (type === 'companie' && !company_name)
    ) {
      throw new Error('Please complete all required fields');
    }

    next();
  } catch (err) {
    next({ status: STATUS_CODE.BAD_REQUEST, message: `${err}` });
  }
};

module.exports = booking;
