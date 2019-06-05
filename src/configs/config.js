module.exports = {
  morgan: "dev",
  APP_PORT: process.env.PORT || 3000,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  SENDGRID_KEY: process.env.SENDGRID_KEY,
  SENDGRID_TEMPLATE_ID: process.env.SENDGRID_TEMPLATE_ID,
  SENDGRID_ADMIN_TEMPLATE_ID: process.env.SENDGRID_ADMIN_TEMPLATE_ID,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  WEB_HOST: process.env.WEB_HOST,
  BOOKING_IN_PROGRESS_TTL: process.env.BOOKING_IN_PROGRESS_TTL || 120, // seconds
};
