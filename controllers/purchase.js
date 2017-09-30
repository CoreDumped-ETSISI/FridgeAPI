'use strict'

const mongoose = require('mongoose')
const Purchase = require('../models/purchase')
const Product = require('../models/product')
const User = require('../models/user')

function getPurchase(req, res) {
  let purchaseId = req.params.id

  Purchase.findOne({ _id:purchaseId, userId: req.user })
    .select("-userId")                   //TODO: Overwrite function toJSON to avoid this
    .exec((err, purchase) => {
      if (err) return res.sendStatus(500)
      if (!purchase || purchase.length == 0) return res.sendStatus(404)
      return res.status(200).send( purchase )
    })
}

function getPurchaseList(req, res) {
  Purchase.find({userId: req.user}, "-userId", (err, purchases) => {
      if (err) return res.sendStatus(500)
      if (!purchases || purchases.length == 0) return res.sendStatus(404)
      return res.status(200).send( purchases )
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
  if(!req.body.productList) return res.sendStatus(418)
  let idList = req.body.productList.split(",")

  Product.find({ _id: {$in: idList} })
    .exec(function(err, products) {
        if (err) return res.sendStatus(500)
        if(!products || products.length == 0) return res.sendStatus(500)

        var amount = 0
        var productList = []
        for (var x = 0; x < products.length; x++) {
          var count = countOccurrences(products[x]._id, idList)
          amount += products[x].price * count
          productList.push({product: products[x], quantity: count})
        }

        const purchase = new Purchase({
          userId: req.user,
          amount: amount,
          productList: productList
        })

        User.findOne({ _id: req.user })
          .exec((err, user) => {
            if (err) return res.sendStatus(500)
            if (!user) return res.sendStatus(404)
            if (user.balance - amount < 0) return res.sendStatus(403)

            purchase.save((err, purchaseStored) => {
              if (err) return res.sendStatus(500)

              User.findOneAndUpdate({ _id: req.user }, { $inc: { balance: -amount } })
                .exec((err, user) => {

                  return res.status(200).send(purchaseStored)
                })
            })
          })
    })
}

function getLastPurchases(req, res) {
  Purchase.find({})
  .sort({timestamp: -1})
  .limit(10)
  .exec(function(err, purchases) {
    if(err) return res.sendStatus(500)
    return res.status(200).send(purchases)
    })
}

function deletePurchase(req, res) {
  const purchaseId = req.params.id
  if(!purchaseId) return res.sendStatus(418)

  Purchase.findOne({ _id:purchaseId })
    .exec((err, purchase) => {
      if (err) return res.sendStatus(500)
      if (!purchase) return res.sendStatus(404)

      User.findOneAndUpdate({ _id: purchase.userId }, { $inc: { balance: purchase.amount } })
        .exec((err, user) => {
          if (err) return res.sendStatus(500)
          if (!user) return res.sendStatus(404)
          purchase.remove()
          return res.sendStatus(200)
        })
    })
}

module.exports = {
  getPurchase,
  getPurchaseList,
  getLastPurchases,
  savePurchase,
  deletePurchase
}
