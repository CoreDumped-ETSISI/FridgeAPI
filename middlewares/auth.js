'use strict'

const services = require('../services')
const winston = require("winston")

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(401)
  }

  const token = req.headers.authorization.split(" ")[1]
  winston.debug("Token: " + token);

  services.decodeToken(token)
    .then(response => {
      req.user = response
      winston.info(req.user + " logged correctly");
      next()
    })
    .catch(response => {
      winston.warn("Bad token from " + req.ip);
      return res.sendStatus(401)
    })
}

module.exports = isAuth
