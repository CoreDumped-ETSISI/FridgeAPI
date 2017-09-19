
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
  name: String,
  price: Number,
  marketPrice: Number,
  image: String,
  stock: Number
})

module.exports = mongoose.model('Product', ProductSchema)
