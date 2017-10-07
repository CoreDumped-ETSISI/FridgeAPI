'use strict'

const services = require('../services')
const User = require('../models/user')
const config = require('../config')

function isAdmin(req, res, next) {
  User.findOne({_id: req.user})
  .select('+admin')
  .exec((err, user) => {
    if (err) res.sendStatus(500)
    if (!user) res.sendStatus(401)

    if(user.admin == config.ADMIN_TOKEN) {
      winston.info(user._id + " logged has admin")
      next()
    } else {
      winston.warn(user._id + " try to use a admin function");
      res.sendStatus(401)
    }

  })
}

module.exports = isAdmin
