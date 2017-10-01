'use strict'

var mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
// const aux = require('./automaticTasks')
const winston = require('winston')

let date = new Date()

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

winston.configure({
    transports: [
      new (winston.transports.File)({ name: 'info-file', filename: `./logs/info/${dateToYMD(date)}-info.log`, level: 'info' }),
      new (winston.transports.File)({ name: 'error-file', filename: `./logs/error/${dateToYMD(date)}-error.log`, level: 'error' })
    ]
});

mongoose.connect(config.db, (err, res) => {
  if (err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log("Connection to DB was succesfull")
    app.listen(config.port, () => {
      console.log(`Node server running on http://localhost:${config.port}`);
    });
  }
});
