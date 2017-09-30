'use strict'

const express = require("express")
const bodyParser  = require("body-parser")
const app = express()
const api = require('./routes')
const cors = require("cors")
const winston = require("winston")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

winston.add(winston.transports.File, { filename: 'somefile.log' }); //File for the logs

app.use(function(req, res, next) {        //Function to write the log for all the request
  let body = JSON.parse(JSON.stringify(req.body))
  body.password = undefined
  winston.info(req.method + " " + req.url + " " + JSON.stringify(body));
  next();
});

app.use('/api', api)

module.exports = app;
