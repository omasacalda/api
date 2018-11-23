module.exports = {
  morgan: 'dev',
  APP_PORT: process.env.PORT || 3000,
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'supersecrettoken0masacalda',
  SENDGRID_KEY: process.env.SENDGRID_KEY,
  WEB_HOST: process.env.WEB_HOST || 'http://localhost:3000'
};
