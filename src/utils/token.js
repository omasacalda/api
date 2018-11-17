const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../configs/config');

const generate = (data, ttl = null) => {
  let expiry = null;

  if (ttl != null) {
    expiry = moment().add(ttl, 's').valueOf();
  }

  return jwt.encode({
    iss: data,
    exp: expiry
  }, config.TOKEN_SECRET);
}

const decode = (token) => {
  return jwt.decode(token, config.TOKEN_SECRET);
}

const TTL = {
  TTL_12_MONTHS: 365 * 24 * 60 * 60, // 1y in seconds
  TTL_6_MONTHS: 182 * 24 * 60 * 60
};

module.exports = {
  generate,
  decode,
  TTL
}
