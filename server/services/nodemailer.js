const nodemailer = require('nodemailer');
const config = require('../config/nodemailer');

const transporter = nodemailer.createTransport(config);

module.exports = transporter;
