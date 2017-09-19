'use strict'

const services = require('../services')
function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'You don`t have autorization' })
  }

  const token = req.headers.authorization.split(" ")[1]

  services.decodeToken(token)
    .then(response => {
      console.log("All fine")                               //TODO:Change text
      req.user = response
      next()
    })
    .catch(response => {
      console.log("Error catched")                           //TODO:Change text
      res.status(response.status).send(response.message)
    })
}

module.exports = isAuth
