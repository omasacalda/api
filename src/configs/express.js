const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('../middlewares/cors');
const config = require('./config')

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(morgan(config.morgan));
  app.use(cors);

  return app;
};
