'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PurchaseSchema = require('./purchase')

const PurchasesSchema = Schema({
  purchases: [PurchaseSchema.Schema]
})

module.exports = mongoose.model('Purchases', PurchasesSchema)
