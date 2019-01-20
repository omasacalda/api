const NodeCache = require('node-cache');
const moment = require('moment');

const config = require('../configs/config')
const BOOKING_IN_PROGRESS_TTL = config.BOOKING_IN_PROGRESS_TTL;

class Cache {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 0 }); // unlimited ttl
  }

  set(key, data) {
    data = {
      ...data,
      ttl: moment().add(BOOKING_IN_PROGRESS_TTL, 's').valueOf()
    }

    return new Promise(async (resolve, reject) => {
      let newData = [data];

      const cachedBookings = await this.get(key);

      if (cachedBookings && cachedBookings.length) {
        newData = [...newData, ...cachedBookings]
      }

      this.cache.set(key, newData, (err, success) => {
        if (err && !success) {
          return resolve(null);
        }

        return resolve(newData);
      })
    })

  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.cache.get(key, (err, value) => {
        if (err || value == null) {
          return resolve(null);
        }

        const now = moment();
        let shouldUpdateData = false;
        const newData = value.filter((item) => {
          const isExpired = moment(item.ttl).isBefore(now)
          if (isExpired) {
            shouldUpdateData = true
          }
          return !isExpired
        });

        if (shouldUpdateData) {
          this.cache.set(key, newData);
        }

        return resolve(newData)
      })
    })
  }

  remove(key, data) {
    return new Promise(async (resolve, reject) => {
      let newData = [];

      const cachedBookings = await this.get(key);
      if (cachedBookings && cachedBookings.length) {
        newData = cachedBookings.filter((item) => item.date !== data.date)
      }

      this.cache.set(key, newData, (err, success) => {
        if (err && !success) {
          return resolve(null);
        }

        return resolve(newData);
      })
    })
  }
}

module.exports = new Cache();
