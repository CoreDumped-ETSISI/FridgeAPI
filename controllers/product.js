'use strict'

const services = require('../services')
const input = require('../services/inputValidators')
const Product = require('../models/product')
const config = require('../config')

function getProduct(req, res) {
  let productId = req.params.id
  if(!input.validId(productId)) return res.sendStatus(400)

  Product.findOne(productId)
    .select('-marketPrice')
    .exec((err, product) => {
    if (err) return res.senStatus(500)
    if (!product) return res.sendStatus(404)
    res.status(200).send(product)
  })
}

function getProductList(req, res) {
  Product.find({})
    .select('-marketPrice')
    .exec((err, products) => {
    if (err) return res.sendStatus(500)
    if (!products) return res.sendStatus(404)
    return res.status(200).send(products)
  })
}

function getAvailableProductList(req, res) {
  Product.find({stock : {$gt:0} })
    .select('-marketPrice')
    .exec((err, products) => {
    if (err) return res.sendStatus(500)
    if (!products) return res.sendStatus(404)
    return res.status(200).send(products)
  })
}

function updateProduct(req, res){
  const productId = req.params.id
  if(!input.validId(productId)) return res.sendStatus(400)

  if(!req.body.name &&
     !req.body.price &&
     !req.body.image &&
     !req.body.units)
     return res.sendStatus(400)

  var updatedFields = {}
  if(req.body.name) {
    updatedFields.name = req.body.name
    if (!input.validProductName(updatedFields.name)) return res.sendStatus(400)
  }
  if(req.body.image) {
    updatedFields.image = req.body.image
    if (!input.validURL(updatedFields.image)) return res.sendStatus(400)
  }
  if(req.body.price && req.body.units) {
    updatedFields.marketPrice = req.body.price
    updatedFields.stock = req.body.units
    if(!input.validFloat(updatedFields.marketPrice)) return res.sendStatus(400)
    if(!input.validInt(updatedFields.stock)) return res.sendStatus(400)
    updatedFields.price = services.calcPrice(updatedFields.marketPrice / updatedFields.stock)
  }

  Product.findOne({ _id: productId })
    .exec((err, product) => {
      if (err) return res.sendStatus(500)
      if (!product || product.length == 0) return res.sendStatus(404)
      product.set(updatedFields)
      product.save((err, productStored) => {
        if (err) return res.sendStatus(500)
        return res.sendStatus(200)
      })
    })
}

function saveProduct(req, res) {
  if (!input.validProductName(req.body.name) ||
      !input.validFloat(req.body.price)||
      !input.validInt(req.body.units))
      return res.sendStatus(400)

  if(req.body.image) {
    if (!input.validURL(req.body.image)) return res.sendStatus(400)
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
    return res.sendStatus(200)
  })
}

function deleteProduct(req, res){
  const productId = req.params.id
  if(!input.validId(productId)) return res.sendStatus(400)

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
  getAvailableProductList,
  updateProduct,
  saveProduct,
  deleteProduct
}
