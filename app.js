'use strict'

const bodyParser  = require("body-parser")
const cors = require("cors")
const express = require("express")
const app = express()
const api = require('./routes')
const logger = require('./services/logger')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

logger(app)

app.use(api)

module.exports = app;
