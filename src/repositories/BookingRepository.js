const Booking = require('../models').booking;
const City = require('../models').city;
const User = require('../models').user;

class BookingRepository {
  get(id) {
    return Booking.findOne({
      where: {id},
      include: [
        {
          model: City,
          as: 'city'
        },
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['salt', 'password']
          }
        }
      ]
    });
  }

  getAll(offset, limit) {
    return Booking.findAll({
      limit,
      offset,
      where: {
        is_deleted: 0
      },
      include: [
        {
          model: City,
          as: 'city'
        },
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['salt', 'password']
          }
        }
      ]
    });
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
      return created;
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
    return Booking.update({
      is_deleted: true
    }, {
      where: { id }
    });
  }

  exists(id) {
    return Booking.count({where: {id}}).then((count) => Boolean(count));
  }

  count() {
    return Booking.count();
  }
}

module.exports = new BookingRepository();
