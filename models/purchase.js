'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = require('./product')

const PurchaseSchema = Schema({
  amount: Number,
  productList: [{
    _id:false,
    // product: ProductSchema.Schema,
    product: {},
    quantity: Number
  }],
  timestamp: { type:Date, default: Date.now() }
})

module.exports = mongoose.model('Purchase', PurchaseSchema)
