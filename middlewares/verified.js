'use strict'

const services = require('../services')
const winston = require('winston')
const User = require('../models/user')

function isVerified(req, res, next) {
  User.findOne({_id: req.user})
  .exec((err, user) => {
    if (err) res.sendStatus(500)
    if (!user) res.sendStatus(401)

    if (user.status == 'Verified') {
      next()
    } else {
      winston.warn(user._id + " is not verified");
      res.sendStatus(401)
    }

  })
}

module.exports = isVerified
