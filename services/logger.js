
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')
const morgan = require('morgan')

const format = '[:date[iso]] :status :method :url : :remote-addr :req[authorization]'

// ensure log directory exists
fs.existsSync(process.env.LOG_DIR) || fs.mkdirSync(process.env.LOG_DIR)

// create a rotating write stream
var accessLogStream = rfs('console.log', {
  interval: '1d', // rotate daily
  path: process.env.LOG_DIR
})

function log(app){
  app.use(morgan(format, {
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  app.use(morgan(format, {stream: accessLogStream}))
}

module.exports = log
