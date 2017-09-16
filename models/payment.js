'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PaymentSchema = Schema({
  amount: Number,
  timestamp: { type:Date, default: Date.now() }
})

module.exports = mongoose.model('Payment', PaymentSchema)
