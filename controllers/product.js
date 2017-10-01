'use strict'

const mongoose = require('mongoose')
const Product = require('../models/product')
const services = require('../services')
const config = require('../config')

function getProduct(req, res) {
  let productId = req.params.id
  if(!services.validId(productId)) return res.sendStatus(400)

  Product.findById(productId, (err, product) => {
    if (err) return res.senStatus(500)
    if (!product) return res.sendStatus(404)
    res.status(200).send(product)
  })
}

function getProductList(req, res) {
  Product.find({}, (err, products) => {
    if (err) return res.sendStatus(500)
    if (!products) return res.sendStatus(404)
    return res.status(200).send(products)
  })
}

function updateProduct(req, res){
  const productId = req.params.id
  if(!services.validId(productId)) return res.sendStatus(400)

  if(!req.body.name &&
     !req.body.price &&
     !req.body.image &&
     !req.body.units)
     return res.sendStatus(400)

  var updatedFields = {}
  if(req.body.name) {
    updatedFields.name = req.body.name
    if (!services.validProductName(updatedFields.name)) return res.sendStatus(400)
  }
  if(req.body.image) {
    updatedFields.image = req.body.image
    if (!services.validURL(updatedFields.image)) return res.sendStatus(400)
  }
  if(req.body.price && req.body.units) {
    updatedFields.marketPrice = req.body.price
    updatedFields.stock = req.body.units
    if(!services.validFloat(updatedFields.marketPrice)) return res.sendStatus(400)
    if(!services.validInt(updatedFields.stock)) return res.sendStatus(400)
    updatedFields.price = services.calcPrice(updatedFields.marketPrice / updatedFields.stock)
  }

  Product.findOne({ _id: productId })
    .exec((err, product) => {
      if (err) return res.sendStatus(500)
      if (!product || product.length == 0) return res.sendStatus(404)
      product.set(updatedFields)
      product.save((err, productStored) => {
        if (err) return res.sendStatus(500)
        return res.status(200).send(productStored)
      })
    })
}

function saveProduct(req, res) {
  if (!services.validProductName(req.body.name) ||
      !services.validFloat(req.body.price)||
      !services.validInt(req.body.units))
      return res.sendStatus(400)

  if(req.body.image) {
    if (!services.validURL(req.body.image)) return res.sendStatus(400)
  }

  var finalPrice = services.calcPrice(req.body.price / req.body.units)

  const product = new Product({
    name: req.body.name,
    marketPrice: req.body.price,
    price: finalPrice,
    image: req.body.image || config.predefinedImage,
    stock: req.body.units
  })

  product.save((err, productStored) => {
    if (err) return res.sendStatus(500)
    return res.status(200).send(productStored)
  })
}

function deleteProduct(req, res){
  const productId = req.params.id
  if(!services.validId(productId)) return res.sendStatus(400)

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
