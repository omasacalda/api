const router = require('express').Router();

const defaultController = require('../controllers/defaultController');
const bookingController = require('../controllers/bookingController');
const cityController = require('../controllers/cityController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.use('/', defaultController);
router.use('/bookings', bookingController);
router.use('/cities', cityController);
router.use('/users', userController);
router.use('/auth', authController);

module.exports = router;
