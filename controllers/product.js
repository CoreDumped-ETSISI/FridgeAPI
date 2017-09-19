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

function updateProduct(req, res){
  const productId = req.params.id
  console.log('GET /api/updateProduct/' + productId)

  if(!req.body.name &&
     !req.body.price &&
     !req.body.image &&
     !req.body.units)
     return res.status(418).send({ massage: "Nothing to change"})

  Product.findOne({ _id: productId })
    .exec((err, product) => {
      if (err) return res.status(500).send({
        message: 'Error'                            //TODO:Change text
      })
      if (!product || product.length == 0) return res.status(404).send({
        message: 'The product does not exist'     //TODO:Change text
      })

      if(req.body.name) product.name = req.body.name
      if(req.body.price && req.body.units){
        var finalPrice = calculatePrice(req.body.price / req.body.units)
        product.marketPrice = req.body.price
        product.price = finalPrice
      }
      if(req.body.image) product.image = req.body.image
      if(req.body.units) product.stock = req.body.units
      product.save((err, productStored) => {
        console.log(err);
        if (err) return res.status(500).send({
          massage: 'Error saving the product in the DB'   //TODO:Change text
        })
        return res.status(200).send({
          product: productStored
        })
      })
    })
}

function saveProduct(req, res) {
  console.log('POST /api/saveProduct')

  var finalPrice = calculatePrice(req.body.price / req.body.units)

  const product = new Product({
    name: req.body.name,
    marketPrice: req.body.price,
    price: finalPrice,
    image: req.body.image || config.predefinedImage,
    stock: req.body.units
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
  updateProduct,
  saveProduct
}
