const bookingRepository = require('./BookingRepository');
const cityRepository = require('./CityRepository');
const userRepository = require('./UserRepository');

class RepositoryFactory {
  getRepositoryForModel(model) {
    switch(model) {
      case 'Booking':
        return bookingRepository;
      case 'City':
        return cityRepository;
      case 'User':
        return userRepository;
      default:
        throw new Error('Repository not implemented for this model');
    }
  }
}

module.exports = new RepositoryFactory();

