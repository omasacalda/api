module.exports = {
  morgan: 'dev',
  APP_PORT: process.env.PORT || 3000,
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'supersecrettoken0masacalda',
  SENDGRID_KEY: process.env.SENDGRID_KEY,
  SENDGRID_TEMPLATE_ID: process.env.SENDGRID_TEMPLATE_ID || 'd-bae8454965b54a94aa5ca57faa9aff33',
  WEB_HOST: process.env.WEB_HOST || 'http://localhost:3000',
  BOOKING_IN_PROGRESS_TTL: process.env.BOOKING_IN_PROGRESS_TTL || 120 // seconds
};
