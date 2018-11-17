const repositoryFactory = require('../repositories/repositoryFactory');
const STATUS_CODE = require('../commons/constants/statusCode');

class CityService {
  constructor() {
    this.repository = repositoryFactory.getRepositoryForModel('City');
  }

  save(data) {
    return new Promise((resolve, reject) => {
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
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No City found with id ' + id});
          }
          resolve(data);
        })
        .catch(err => {
          reject({'status': STATUS_CODE.INTERNAL_SERVER_ERROR, 'message': err.message});
        });
    });
  }

  getAll() {
     const result = {
       data: []
     };

     return new Promise((resolve, reject) => {
      this.repository.getAll()
        .then(data => {
          result.data = data;
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
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No City found with id: ' + id});
          }
          return this.repository.delete(id);
        })
        .then(affectedCity => {
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
            return reject({'status': STATUS_CODE.NOT_FOUND, 'message': 'No City found with id ' + id});
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

module.exports = new CityService();
