'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PurchaseSchema = Schema({
  amount: Number,
  productList: [{type: Schema.Types.ObjectId}],
  timestamp: { type:Date, default: Date.now() }
})

module.exports = mongoose.model('Purchase', PurchaseSchema)
