'use strict'

const services = require('../services')
const User = require('../models/user')
const config = require('../config')

function isAdmin(req, res, next) {
  User.findOne({_id: req.user})
  .select('+admin')
  .exec((err, user) => {
    if (err) res.sendStatus(404)

    if(user && user.admin == config.ADMIN_TOKEN) {
      console.log("Admin " + user._id + " logged")
      next()
    } else {
      res.sendStatus(403)
    }

  })
}

module.exports = isAdmin
