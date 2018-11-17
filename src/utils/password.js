const hash = require('node_hash');
const crypto = require('crypto');

const getHashedPassword = (plainPassword, salt) => {
  return hash.sha512(plainPassword, salt)
}

const hashPassword = (plainPassword) => {
  const salt = crypto.randomBytes(128).toString('base64');
  return {
    pass: getHashedPassword(plainPassword, salt),
    salt
  }
}

const verifyPassword = (enterdPassword, dbPassword, salt) => {
  return getHashedPassword(enterdPassword, salt) === dbPassword
}

module.exports = {
  hashPassword,
  verifyPassword
}
