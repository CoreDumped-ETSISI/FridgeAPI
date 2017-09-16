'use strict'

const mongoose = require('mongoose')
const Purchase = require('../models/purchase')
const Product = require('../models/product')

function getPurchase(req, res) {
  let purchaseId = req.params.id
  console.log('GET /api/purchase/' + purchaseId)

  Purchase.findById(purchaseId, (err, purchase) => {
    if (err) return res.status(500).send({
      message: 'Error'
    })
    if (!purchase) return res.status(404).send({
      message: 'The purchase does not exist'
    })
    res.status(200).send({
      purchase
    })
  })
}

function getPurchases(req, res) {
  console.log('GET /api/purchases/')

  Purchase.find({})
    .populate('productList')
    .exec((err, purchases) => {
      if (err) return res.status(500).send({
        message: 'Error'
      })
      if (!purchases) return res.status(404).send({
        message: 'The purchases does not exist'
      })
      res.status(200).send({
        purchases
      })
    })
}

function countOccurrences(obj, list){
  var count = 0
  for(var i = 0; i < list.length; i++){
    if(obj == list[i])
    count++
  }
  return count
}

function savePurchase(req, res) {
  console.log("POST /api/savePurchase")

  let idList = req.body.productList.split(",")

  Product.find({ _id: {$in: idList} })
    .exec(function(err, products) {
        if (err) res.status(500).send({
          message: `A error ocurried during saving your purchase ${err}`
        })

        var amount = 0
        var productList = []
        for (var x = 0; x < products.length; x++) {
          var count = countOccurrences(products[x]._id, idList)
          amount += products[x].price * count
          productList.push({product: products[x], quantity: count})
        }

        const purchase = new Purchase({
          amount: amount,
          productList: productList
        })

        purchase.save((err, purchaseStored) => {
          if (err) res.status(500).send({
            message: `A error ocurried during saving your purchase ${err}`
          })
          res.status(200).send({
            user: req.user,
            message: purchaseStored
          })
        })
    })
}

module.exports = {
  getPurchase,
  getPurchases,
  savePurchase
}
