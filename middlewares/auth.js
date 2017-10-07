'use strict'

const token = require('../services/token')

function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(401)
  }

  const tokenReq = req.headers.authorization.split(" ")[1]

  token.decode(tokenReq)
    .then(response => {
      req.user = response
      next()
    })
    .catch(response => {
      return res.sendStatus(401)
    })
}

module.exports = isAuth
