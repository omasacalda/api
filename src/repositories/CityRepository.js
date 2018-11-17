const City = require('../models').city;
const Booking = require('../models').booking;

class CityRepository {
  get(id) {
    return City.findOne({where: {id}});
  }

  getAll(query = {}) {
    let where = {};

    if (query.slug != null) {
      where.slug = query.slug
    }

    return City.findAll({
      where
    });
  }

  save(data) {
    return City.create(data).then((created) => {
      return created.id;
    });
  }

  update(id, data) {
    return City.findOne({where: {id}}).then(
      (City) => {
        return City.update(data, {where: {id}});
      }
    )
  }

  delete(id) {
    return City.destroy({where: {id}});
  }

  exists(id) {
    return City.count({where: {id}}).then((count) => Boolean(count));
  }

  count() {
    return City.count();
  }
}

module.exports = new CityRepository();
