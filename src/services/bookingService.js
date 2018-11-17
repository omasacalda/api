const moment = require('moment');

const repositoryFactory = require('../repositories/repositoryFactory');
const STATUS_CODE = require('../commons/constants/statusCode');

class BookingService {
  constructor() {
    this.repository = repositoryFactory.getRepositoryForModel('Booking');
  }

  save(data) {
    return new Promise(async (resolve, reject) => {
      const now = moment();
      const bookingDate = moment(data.date);

      if (bookingDate.isBefore(now)) {
        return reject({'status': STATUS_CODE.BAD_REQUEST, 'message': 'Booking date is before now'});
      }

      const booking = await this.repository.getByDate(bookingDate.format('YYYY-MM-DD'));
      if (booking) {
        return reject({'status': STATUS_CODE.BAD_REQUEST, 'message': 'Date is booked'});
      }

      this.repository.save(data)
        .then(id => {
          resolve(id);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.repository.get(id)
        .then(data => {
          if (!data) {
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No Booking found with id ' + id});
          }
          resolve(data);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
    });
  }

  getAll(offset = 0, limit = 15) {
     const result = {
      meta: {
        offset: offset,
        limit: limit,
        count: 0
      },
      data: []
     };

     return new Promise((resolve, reject) => {
      this.repository.getAll(Number(offset), Number(limit))
        .then(data => {
          result.data = data;

          return this.repository.count();
        })
        .then(count => {
          result.meta.count = count;

          resolve(result);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
     });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.repository.exists(id)
        .then(exists => {
          if (!exists) {
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No Booking found with id: ' + id});
          }
          return this.repository.delete(id);
        })
        .then(affectedBooking => {
          resolve(true);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      this.repository.exists(id)
        .then(exists => {
          if (!exists) {
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No Booking found with id ' + id});
          }
          return this.repository.update(id, data);
        })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
    });
  }
}

module.exports = new BookingService();
