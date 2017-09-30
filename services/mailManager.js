// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const services = require('../services/index')
const config = require('../config')

// var transporter = nodemailer.createTransport({
//   service: config.mailService,
//   auth: {
//     user: config.mailUser,
//     pass: config.mailPass
//   }
// });

function sendEmail(mail) {
  // var mailOptions = {
  //   from: config.mailUser,
  //   to: mail.email,
  //   subject: mail.subject,
  //   text: mail.text
  // };
  // console.log(mail)
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
}





function sendWelcomeEmail(email, name) { //TODO Catch errors
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
  const msg = {
    to: email,
    from: config.mailUser,
    subject: 'a',
    text: 'b',
    html: 'c',
    templateId: '20cddb25-1cfe-4c22-9019-62c8524167a4',
    substitutions: {
      name: name
    },
  };
  sgMail.send(msg);
}

function sendPasswordEmail(email, name, token) { //TODO Catch errors
  var encodeEmail = services.encrypt(email)
  var link = `http://${config.hostname}/resetPassword/${encodeEmail}/${token}`
  // var mailOptions = {
  //    email: email,
  //    subject: 'Recover your password',
  //    text: `Hola ${name}, para recuperar tu contraseña debes hacer click en el siguiente enlace ${link}`,
  // };
  // sendEmail(mail)
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
  const msg = {
    to: email,
    from: config.mailUser,
    subject: 'a',
    text: 'b',
    html: 'c',
    templateId: '37b39a0e-4a34-4eee-97ec-ac1d10ce9d64',
    substitutions: {
      name: name,
      link: link
    },
  };
  sgMail.send(msg);
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordEmail
}
