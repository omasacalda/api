const NodeCache = require('node-cache');

class Cache {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 0 }); // unlimited ttl
  }

  set(key, data) {
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

        return resolve(value)
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
