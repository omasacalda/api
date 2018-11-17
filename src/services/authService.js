const passwordUtils = require('../utils/password');
const tokenUtils = require('../utils/token');
const repositoryFactory = require('../repositories/repositoryFactory');
const STATUS_CODE = require('../commons/constants/statusCode');

class AuthService {
  constructor() {
    this.userRepo = repositoryFactory.getRepositoryForModel('User');
  }

  login(data = {}) {
    return new Promise(async (resolve, reject) => {
      const user = await this.userRepo.getByEmail(data.email);

      if (!user) {
        return reject({'status': STATUS_CODE.BAD_REQUEST, 'message': 'Invalid login credentials'});
      }

      if (!passwordUtils.verifyPassword(data.password, user.password, user.salt)) {
        return reject({'status': STATUS_CODE.BAD_REQUEST, 'message': 'Invalid login credentials'});
      }

      return resolve(tokenUtils.generate(user.toJSON(), tokenUtils.TTL.TTL_12_MONTHS));
    })
  }
}

module.exports = new AuthService();
