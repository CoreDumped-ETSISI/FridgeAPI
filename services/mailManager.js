
const nodemailer = require('nodemailer');
const config = require('./config')

var transporter = nodemailer.createTransport({
  service: config.mailService,
  auth: {
    user: config.mailUser,
    pass: config.mailPass
  }
});

function sendVerificationEmail(req, res){
  var mailOptions = {
    from: config.mailUser,
    to: '${email}',
    subject: 'Verify your email'
    text: 'Hola ${displayName}, solo falta un paso para que seas sucrito de CoreDumped de pleno derecho, y para serlo solo necesitamos que hagas click en el siguiente enlace ${link}',
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendPasswordEmail(req, res){
  var mailOptions = {
    from: config.mailUser,
    to: '${email}',
    subject: 'Recover your password'
    text: 'Hola ${displayName}, para recuperar tu contraseña debes hacer click en el siguiente enlace ${link}',
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordEmail
}
