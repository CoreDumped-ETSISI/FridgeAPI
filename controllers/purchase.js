'use strict'

const mongoose = require('mongoose')
const Purchase = require('../models/purchase')
const Product = require('../models/product')

function getPurchase(req, res) {
  let purchaseId = req.params.id
  console.log('GET /api/purchase/' + purchaseId)

  Purchase.findOne({ _id:purchaseId, userId: req.user })
    .select("-userId -__v")                   //TODO: Overwrite function toJSON to avoid this
    .exec((err, purchase) => {
      if (err) return res.status(500).send({
        message: 'Error'
      })
      if (!purchase || purchase.length == 0) return res.status(404).send({message:`Error at proccessing request: ${err}`})
      return res.status(200).send(
        purchase
      )
    })
}

function getPurchaseList(req, res) {
  console.log('GET /api/purchaseList/')

  Purchase.find({userId: req.user}, "-userId -__v", (err, purchases) => {
      if (err) return res.status(500).send({message:`Error at proccessing request: ${err}`})
      if (!purchases || purchases.length == 0) return res.status(404).send({message:`Error at proccessing request: ${err}`})
      res.status(200).send(
        purchases
      )
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

  if(!req.body.productList) res.status(400).send({message:`Error at proccessing request: ${err}`})
  let idList = req.body.productList.split(",")

  Product.find({ _id: {$in: idList} })
    .exec(function(err, products) {
        if (err) return res.status(500).send({message:`Error at proccessing request: ${err}`})
        if(!products || products.length == 0) return res.status(500).send({message:`Error at proccessing request: ${err}`})

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


        purchase.save( (err, purchaseStored) => {
          console.log(purchaseStored)
          if (err) res.status(500).send({message:`Error at proccessing request: ${err}`})
            res.status(200).send(purchaseStored)
        })

    })
}

function getLastPurchases(req, res) {
  Purchase.find({})
  .sort({timestamp: -1})
  .limit(10)
  .exec(function(err, purchases) {
        console.log(purchases)
        res.status(200).send(purchases)
    })
}

function deletePurchase(req, res) {
  const purchaseId = req.params.id
  console.log('DELETE /api/deletePurchase/'+ purchaseId)
  if(!purchaseId) return res.status(418).send({ message: 'Error' }) //TODO:Change text
  Purchase.remove({ _id:purchaseId })
    .exec((err, purchase) => {
      if (err) return res.status(500).send({ message: 'Error' }) //TODO:Change text
      if (!purchase) return res.status(404).send({ message: 'Error' }) //TODO:Change text
      else return res.status(200).send({ message: 'OK' }) //TODO:Change text
    })
}


module.exports = {
  getPurchase,
  getPurchaseList,
  getLastPurchases,
  savePurchase,
  deletePurchase
}
