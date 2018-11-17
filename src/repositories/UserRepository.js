const User = require('../models').user;
const Booking = require('../models').booking;

class UserRepository {
  get(id) {
    return User.findOne({where: {id}});
  }

  getByEmail(email) {
    return User.findOne({
      where: { email }
    });
  }

  getAll(offset, limit) {
    return User.findAll({limit, offset});
  }

  save(data) {
    return User.create(data).then((created) => {
      return created.id;
    });
  }

  update(id, data) {
    return User.findOne({where: {id}}).then(
      (User) => {
        return User.update(data, {where: {id}});
      }
    )
  }

  delete(id) {
    return User.destroy({where: {id}});
  }

  exists(id) {
    return User.count({where: {id}}).then((count) => Boolean(count));
  }

  count() {
    return User.count();
  }
}

module.exports = new UserRepository();
