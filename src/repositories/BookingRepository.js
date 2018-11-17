const Booking = require('../models').booking;
const City = require('../models').city;
const User = require('../models').user;

class BookingRepository {
  get(id) {
    return Booking.findOne({where: {id}, include: [{model: City, as: 'city'}, {model: User, as: 'user'}]});
  }

  getAll(offset, limit) {
    return Booking.findAll({limit, offset, include: [{model: City, as: 'city'}, {model: User, as: 'user'}]});
  }

  getByDate(bookinDate) {
    return Booking.findOne({
      where: {
        date: bookinDate
      }
    })
  }

  save(data) {
    return Booking.create(data).then((created) => {
      return created.id;
    });
  }

  update(id, data) {
    return Booking.findOne({where: {id}}).then(
      (Booking) => {
        return Booking.update(data, {where: {id}});
      }
    )
  }

  delete(id) {
    return Booking.destroy({where: {id}});
  }

  exists(id) {
    return Booking.count({where: {id}}).then((count) => Boolean(count));
  }

  count() {
    return Booking.count();
  }
}

module.exports = new BookingRepository();
