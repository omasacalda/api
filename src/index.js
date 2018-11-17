const express = require('express');

const config = require('./configs/config')
const loadExpressConfig = require('./configs/express.js');
const router = require('./configs/router.js');
const errorHandler = require('./utils/error-handler');

let app = express();
app = loadExpressConfig(app);

app.use('/', router);
app.use(errorHandler);

app.listen(config.APP_PORT, () => {
  console.log('App started on port: ' + config.APP_PORT);
});
