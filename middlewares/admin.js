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
      console.log("Admin " + user._id + " logged")
      next()
    } else {
      res.sendStatus(401)
    }

  })
}

module.exports = isAdmin
