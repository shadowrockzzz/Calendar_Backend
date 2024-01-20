const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date : {type: String, required: true},
  time : {type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
