
const nodemailer = require('nodemailer');
const services = require('../services/index')
const config = require('../config')

var transporter = nodemailer.createTransport({
  service: config.mailService,
  auth: {
    user: config.mailUser,
    pass: config.mailPass
  }
});

function sendEmail(mail){
  var mailOptions = {
    from: config.mailUser,
    to: mail.email,
    subject: mail.subject,
    text: mail.text
  };
  console.log(mail)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendWelcomeEmail(email, name){           //TODO Catch errors
    var mail = {
      email: email,
      subject: 'Bienvenido a CoreDumped',
      text: `Hola ${name}, nos alegra que te hayas unido a CoreDumped.\n\nUn gran saludo de parte de la dirección.`
    };
    sendEmail(mail)
}

function sendPasswordEmail(email, name, token){     //TODO Catch errors
  var encodeEmail = services.encrypt(email)
  var link = `http://${config.hostname}/resetPassword/${encodeEmail}/${token}`
  var mailOptions = {
     email: email,
     subject: 'Recover your password',
     text: `Hola ${name}, para recuperar tu contraseña debes hacer click en el siguiente enlace ${link}`,
  };
  sendEmail(mail)
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordEmail
}
