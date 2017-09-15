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

function saveProduct(req, res) {
  console.log('POST /api/saveProduct')
  console.log(`Req.body = ${req.body.name}`)

  const product = new Product({
    name: req.body.name,
    price: req.body.price, //TODO: Calculate price
    marketPrice: req.body.marketPrice,
    image: req.body.image,  //TODO: Set predefined image
    stock: req.body.stock
  })

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
  saveProduct
}
