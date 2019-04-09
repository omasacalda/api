const schedule = require('node-schedule');
const moment = require('moment');

const config = require('../configs/config')
const BookingRepository = require('../repositories/BookingRepository');
const Mailer = require('../services/Mailer')

const sendReminderEmails = async () => {
  const fiveDaysFromNow = moment().add(5, 'd').format('YYYY-MM-DD');

  const query = {
    is_deleted: 0,
    date: {$eq: fiveDaysFromNow}
  }

  const bookings = await BookingRepository.getEverything({ query, include: ['user', 'city'] });

  bookings.forEach((booking) => {
    const user = booking.user;

    const bookingDate = moment(booking.date).format('DD.MM.YYYY');
    const msg = {
      to: user.email,
      from: 'O masa calda <noreply@omasacalda.ro>',
      templateId: config.SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        "subject": 'Rezervarea ta O Masa Calda',
        "title": `5 zile pana la rezervarea ta din ${bookingDate}`,
        "booking_url": `${config.WEB_HOST}/booking/${booking.token}`,
        "user_first_name": user.first_name,
        "user_last_name": user.last_name,
        "user_email": user.email,
        "date": bookingDate,
        "city": booking.city.name,
        "person_count": booking.person_count,
        "phone_number": user.phone
      }
    };
    
    console.log(
      'REMINDER MAIL',
      `user: ${msg.to}`,
      `date: ${bookingDate}`,
      `id: ${booking.id}`
    );

    Mailer.send(msg);
  })
}

const EVERY_MIDNIGHT = '0 0 0 * * *';
// const EVERY_5_SECONDS = '*/10 * * * * *';

schedule.scheduleJob(EVERY_MIDNIGHT, sendReminderEmails);
