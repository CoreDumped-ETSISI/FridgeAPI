'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = require('./product')

const PurchaseSchema = Schema({
  amount: Number,
  // productList: [{type:Schema.Types.ObjectId, ref: 'Product'}],
  productList:[ProductSchema.Schema],
  timestamp: { type:Date, default: Date.now() }
})

module.exports = mongoose.model('Purchase', PurchaseSchema)
