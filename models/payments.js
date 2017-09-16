'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PaymentSchema = require('./payment')

const PaymentsSchema = Schema({
  payments: [PaymentSchema.Schema]
})

module.exports = mongoose.model('Payments', PaymentsSchema)
