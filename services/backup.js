'use strict'

const Cron = require('cron').CronJob
const exec = require('child_process').exec

function dateToYMD(date) {
    var d = date.getDate()
    var m = date.getMonth() + 1
    var y = date.getFullYear()
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
}

function createBK() {
  let date = new Date()
  var cmd = '"C:/Program Files/MongoDB/Server/3.4/bin/mongodump.exe" --host localhost --port 27017 --db fridgeapp_v2 --out ' + process.env.BK_DIR + '/' + dateToYMD(date)
  // var cmd = 'mongodump --db process.env.DB_NAME --out ' + process.env.BK_DIR + '/' + dateToYMD(date) //For Linux
  exec(cmd, function (error, stdout, stderr) {
    if (error) console.log(error)
    else console.log("---------------- Backup created ;) ----------------")
  });
}

new Cron('0 0 0 * * *', function() {
  createBK()
}, null, true, 'Europe/Madrid')
