'use strict'

const mongoose = require('mongoose')
const Product = require('../models/product')
const services = require('../services')
const config = require('../config')

function getProduct(req, res) {
  let productId = req.params.id

  Product.findById(productId, (err, product) => {
    if (err) return res.senStatus(500)
    if (!product) return res.sendStatus(404)
    res.status(200).send({ product })
  })
}

function getProductList(req, res) {
  Product.find({}, (err, products) => {
    if (err) return res.sendStatus(500)
    if (!products) return res.sendStatus(404)
    return res.status(200).send({ products })
  })
}

function updateProduct(req, res){
  const productId = req.params.id

  if(!req.body.name &&
     !req.body.price &&
     !req.body.image &&
     !req.body.units)
     return res.sendStatus(418)

  Product.findOne({ _id: productId })
    .exec((err, product) => {
      if (err) return res.sendStatus(500)
      if (!product || product.length == 0) return res.sendStatus(404)

      if(req.body.name) product.name = req.body.name
      if(req.body.price && req.body.units){
        var finalPrice = services.calculatePrice(req.body.price / req.body.units)
        product.marketPrice = req.body.price
        product.price = finalPrice
      }
      if(req.body.image) product.image = req.body.image
      if(req.body.units) product.stock = req.body.units

      product.save((err, productStored) => {
        if (err) return res.sendStatus(500)
        return res.status(200).send( productStored )
      })
    })
}

function saveProduct(req, res) {
  if(!req.body.name ||
     !req.body.price ||
     !req.body.units)
     return res.sendStatus(418)

  var finalPrice = services.calculatePrice(req.body.price / req.body.units)

  const product = new Product({
    name: req.body.name,
    marketPrice: req.body.price,
    price: finalPrice,
    image: req.body.image || config.predefinedImage,
    stock: req.body.units
  })

  product.save((err, productStored) => {
    if (err) return res.sendStatus(500)
    return res.status(200).send( productStored )
  })
}

function deleteProduct(req, res){
  const productId = req.params.id
  if(!productId) return res.sendStatus(418)

  Product.remove({ _id:productId })
    .exec((err, product) => {
      if (err) return res.sendStatus(500)
      if (!product) return res.sendStatus(404)
      return res.sendStatus(200)
    })
}

module.exports = {
  getProduct,
  getProductList,
  updateProduct,
  saveProduct,
  deleteProduct
}
