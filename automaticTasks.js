'use strict'

const winston = require('winston')
const Cron = require('cron').CronJob
const exec = require('child_process').exec;
const config = require('./config')

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

function createBK() {
  let date = new Date()
  var cmd = '"C:/Program Files/MongoDB/Server/3.4/bin/mongodump.exe" --host localhost --port 27017 --db fridgeapp_v2 --out ./backups/' + dateToYMD(date);
  exec(cmd, function (error, stdout, stderr) {
    if (error) console.log(error)
    else console.log("Backup created :)")
  });
}

function createLogsFiles(){
  let date = new Date()
  console.log(`Creating a new log file (./logs/info/${dateToYMD(date)}-info.log)`)
  console.log(`Creating a new log file (./logs/error/${dateToYMD(date)}-error.log)`)
  winston.configure({
      transports: [
        new (winston.transports.File)({ name: 'info-file', filename: `./logs/info/${dateToYMD(date)}-info.log`, level: 'info' }),
        new (winston.transports.File)({ name: 'error-file', filename: `./logs/error/${dateToYMD(date)}-error.log`, level: 'error' })
      ]
  })
}

new Cron('0 * * * * *', function() {
  createLogsFiles()
  createBK()
}, null, true, 'Europe/Madrid');
