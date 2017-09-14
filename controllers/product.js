'use strict'

const mongoose = require('mongoose')
const Product = require('../models/product')

function getProduct(req, res) {
  let productId = req.params.id
  console.log('GET /api/product/' + productId)

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({
      message: 'Error'
    })
    if (!product) return res.status(404).send({
      message: 'The product does not exist'
    })
    res.status(200).send({
      product
    })
  })
}

function getProductList(req, res) {
  console.log('GET /api/productList')

  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({
      message: 'Error'
    })
    if (!products) return res.status(404).send({})
    res.status(200).send({
      products
    })
  })
}

function createProduct(req, res) {
  console.log('POST /api/createProduct')
  console.log(req.body)

  let product = new Product()
  product.name = req.body.name
  product.price = req.body.price

  product.save((err, productStored) => {
    if (err) res.status(500).send({
      massage: 'Error saving the product in the DB'
    })
    res.status(200).send({
      product: productStored
    })
  })
}

module.exports = {
  getProduct,
  getProductList,
  createProduct
}
