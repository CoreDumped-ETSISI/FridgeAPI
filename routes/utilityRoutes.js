'use strict'

const express = require ('express')
const api = express.Router()

const verified = require('../middlewares/verified')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const config = require('../config')

const User = require('../models/user')
const Product = require('../models/product')
const Payment = require('../models/payment')
const Purchase = require('../models/purchase')

api.delete('/restartDB', (req, res) => {
  User.remove({}, function(err) {
    console.log('User collection removed')
  });
  Product.remove({}, function(err) {
    console.log('Product collection removed')
  });
  Payment.remove({}, function(err) {
    console.log('Payment collection removed')
  });
  Purchase.remove({}, function(err) {
    console.log('Purchase collection removed')
  });
  const user = new User({
    email: 'admin@admin.com',
    displayName: 'Admin',
    avatarImage: undefined,
    password: config.ADMIN_PASS,
    status: 'Verified',
    admin: config.ADMIN_TOKEN,
    balance: 0
  })
  user.save((err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(500)
    return res.status(200).send()
  })
})

module.exports = api
