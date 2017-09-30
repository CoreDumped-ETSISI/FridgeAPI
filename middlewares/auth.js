'use strict'

const services = require('../services')
const winston = require("winston")

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(403)
  }

  const token = req.headers.authorization.split(" ")[1]

  services.decodeToken(token)
    .then(response => {
      req.user = response
      winston.info(req.user + " logged");
      next()
    })
    .catch(response => {
      winston.info(token + " logging from " + req.ip);
      return res.sendStatus(403)
    })
}

module.exports = isAuth
