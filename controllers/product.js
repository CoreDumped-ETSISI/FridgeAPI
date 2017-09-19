'use strict'

const mongoose = require('mongoose')
const Product = require('../models/product')
const config = require('../config')

function getProduct(req, res) {
  let productId = req.params.id
  console.log('GET /api/product/' + productId)

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({
      message: 'Error'                              //TODO:Change text
    })
    if (!product) return res.status(404).send({
      message: 'The product does not exist'         //TODO:Change text
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
      message: 'Error'                            //TODO:Change text
    })
    if (!products) return res.status(404).send({})
    res.status(200).send({
      products
    })
  })
}

function saveProduct(req, res) {
  console.log('POST /api/saveProduct')

  const product = new Product({
    name: req.body.name,
    marketPrice: req.body.price,
    price: calculatePrice(req.body.price),
    image: req.body.image || config.predefinedImage,
    stock: req.body.stock
  })

  product.save((err, productStored) => {
    console.log(err);
    if (err) return res.status(500).send({
      massage: 'Error saving the product in the DB'   //TODO:Change text
    })
    return res.status(200).send({
      product: productStored
    })
  })
}

module.exports = {
  getProduct,
  getProductList,
  saveProduct
}
