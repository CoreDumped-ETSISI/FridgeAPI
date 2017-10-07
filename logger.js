
var fs = require('fs')
var path = require('path')
var rfs = require('rotating-file-stream')
const morgan = require('morgan')

const logDirectory = path.join(__dirname, 'log')

const format = '[:date[iso]] :status :method :url : :remote-addr :req[authorization]'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

function log(app){
  app.use(morgan(format, {
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  app.use(morgan(format, {stream: accessLogStream}))
}

module.exports = log
