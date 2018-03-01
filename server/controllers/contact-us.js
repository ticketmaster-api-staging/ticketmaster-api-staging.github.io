const moment = require('moment');

const nodemailerTransport = require('../services/nodemailer');
const liquidEngine = require('../services/liquidEngine');

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss z';
const mailOptions = {
  from: 'TM OPEN PLATFORM',
  to: 'devportalinquiry@ticketmaster.com',
  subject: 'Contact us form',
};

const contactUsController = function(req, res, next) {
  const mailParams = {
    yourName: req.query.yourName,
    email: req.query.email,
    subject: req.query.subject,
    descriptions: req.query.descriptions,
    date: moment().utc().format(TIME_FORMAT),
    url: req.headers.referer,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  };

  liquidEngine
    .renderFile('views/contact-us-mail', mailParams)
    .then((html) => Object.assign({html}, mailOptions))
    .then(nodemailerTransport.sendMail.bind(nodemailerTransport))
    .then(() => {
      res.status(200).send({status: 'success'});
    })
    .catch((err) => {
      res.status(500).send({status: 'error'});
    });
};

module.exports = contactUsController;
