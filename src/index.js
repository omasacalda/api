const express = require('express');

const config = require('./configs/config')
const loadExpressConfig = require('./configs/express.js');
const router = require('./configs/router.js');
const errorHandler = require('./utils/error-handler');
const CacheService = require('./services/Cache');

let app = express();
app = loadExpressConfig(app);

app.use('/', router);
app.use(errorHandler);

const server = app.listen(config.APP_PORT, () => {
  console.log('App started on port: ' + config.APP_PORT);
});

const io = require('socket.io')(server, { origins: '*:*'});
let activeSockets = [];

io.on('connection', async (socket) => {
  activeSockets.push(socket);

  const cachedBookings = await CacheService.get('bookings_in_progress');
  // socket.emit('bookings_in_progress', cachedBookings || [])
  // socket.broadcast.emit('broadcast', 'bookings_in_progress', cachedBookings || []);
  activeSockets.forEach((socket) => socket.emit('bookings_in_progress', cachedBookings || []));

  socket.on('set_booking_date', async (data) => {
    const cachedBookings = await CacheService.set('bookings_in_progress', data)
    activeSockets.forEach((socket) => socket.emit('bookings_in_progress', cachedBookings));
    // socket.emit('bookings_in_progress', cachedBookings || [])
    // socket.broadcast.emit('broadcast', 'bookings_in_progress', cachedBookings || []);
  });

  socket.on('remove_booking_date', async (data) => {
    const cachedBookings = await CacheService.remove('bookings_in_progress', data)
    activeSockets.forEach((socket) => socket.emit('bookings_in_progress', cachedBookings));
    // socket.emit('bookings_in_progress', cachedBookings || [])
    // socket.broadcast.emit('broadcast', 'bookings_in_progress', cachedBookings || []);
  });
})
